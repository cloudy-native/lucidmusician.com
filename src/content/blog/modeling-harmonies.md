---
title: "Modeling Harmonies: From Scores of the Masters to Real-Time AI"
description: "Explore the pipeline behind LucidHarmony's AI harmonic generation, from historical scores to transformer inference in a hybrid plugin."
date: "2025-12-11"
readTime: "12 min read"
tags: ["machine-learning","music-theory","transformers","harmony","onnx","rust"]
---

*Published: December 11, 2025 · 12 min read*

How do you teach a machine to understand harmony? Not just to recognize chords, but to grasp the deep patterns that composers use to create musical coherence? This article explores the complete pipeline behind LucidHarmony's AI-powered harmonic generation system, from extracting knowledge from historical scores to running a compact neural model in real time inside an audio plugin.

> **Note:** This post contains code and music theory. You can safely skip code blocks and harmonic notation and still get the gist of the pipeline.

## Introduction

LucidHarmony's approach to harmonic modeling is a multi-stage pipeline that transforms centuries of musical knowledge into models that power a real-time harmonic engine. The system learns from the masters — analyzing thousands of Renaissance and Baroque (and related) compositions — and distills that knowledge into models that generate stylistically coherent chord progressions on the fly.

Why Renaissance and Baroque and not only pop songs? Because the harmonic language of composers like [Bach](https://en.wikipedia.org/wiki/Johann_Sebastian_Bach), [Palestrina](https://en.wikipedia.org/wiki/Giovanni_Palestrina), and [Monteverdi](https://en.wikipedia.org/wiki/Claudio_Monteverdi) set foundations that still underlie Western practice. By learning from those sources, LucidHarmony can produce progressions that feel robust from classical through ambient to pop — while **you** choose the instrumentation and genre.

The pipeline has four critical stages:

1. **Extraction** — converting scores into machine-readable harmonic sequences  
2. **Training** — teaching a sequence model to predict harmonic progressions  
3. **Export** — packaging the model for cross-platform plugin inference  
4. **Runtime** — inference, constraints, voice leading, and MIDI inside the plugin  

### Evolution (short history)

| Era | Model | Runtime packaging |
|-----|--------|-------------------|
| Early product | Stacked **LSTM** over Roman tokens | Custom weights JSON + hand-written C++ forward pass |
| Current (v1.3+) | **Transformer** over Roman tokens | **ONNX** + ONNX Runtime |
| Current architecture (v1.4 hybrid) | Same transformer assets | Domain logic (load model, generate, logits, metadata, MIDI events, follow compute) in **Rust**; JUCE for UI/shell/formats |

This article keeps the extraction story (still valid), describes training and export as they work **now**, and treats the LSTM export path as historical context only.

## Stage 1: Chord Extraction

The first challenge is converting raw scores into a format suitable for machine learning. Offline Python tooling processes MusicXML, MIDI, and Kern (and similar) sources spanning centuries of practice.

### The Extraction Process

The extraction pipeline uses the [`music21`](https://www.music21.org/music21docs/) library to parse scores and perform harmonic analysis:

#### 1. Parsing and Key Detection

```python
score = converter.parse(str(path))
k = score.analyze("key")
```

The system detects the key of each piece. Subsequent analysis is relative to that key so the model learns **functional** patterns that transpose across tonics.

#### 2. Chordification

```python
chordified = score.chordify().flatten()
```

Polyphonic scores become vertical “slices”—snapshots of notes sounding at each moment—turning counterpoint into a sequence of pitch collections.

#### 3. Harmonic Filtering: The Strong Beat Rule

Early versions captured every vertical sonority, producing “dissonant chatter”—fleeting harmonies that are not structural.

The **Strong Beat Rule** keeps harmonies on strong beats (e.g. quarter-note grid in 4/4) as anchors. Weak-beat sonorities are ignored and their duration merges into the previous strong-beat chord. That preserves rhythmic pacing while focusing on structural harmony.

#### 4. Roman Numeral Tokenization

```python
rn = roman.romanNumeralFromChord(c, k)
token = get_simplified_figure(rn)
```

Each chord becomes a standardized Roman numeral token. Simplification rules matter:

- Complex figures like `V[#4]6` reduce toward stable forms such as `V6`
- Quality markers are preserved where useful (`o`, `+`, …)
- **Inversions are kept**: `I`, `I6`, `I64`

**Why inversions matter:** by distinguishing `V` from `V6`, the model helps compose the **bass line**, not only chord roots.

#### 5. Duration Encoding

```python
# Format: Figure_Duration
# Example: "V6_1.0" (V6 lasting one quarter note)
```

The model learns both *what* follows *what* and the **harmonic rhythm**.

### Output Format

```json
{
  "metadata": {
    "file": "palestrina_mass_01.xml",
    "key": "D major"
  },
  "chords": ["I_2.0", "V6_1.0", "I_1.0", "IV_2.0", "V_1.0", "I_2.0"]
}
```

These sequences become the training corpus. Offline tools also emit **precomputed music-theory metadata** (packed JSON) used at runtime for spelling, pitch-class sets, NCT, and related lookups—see [Precomputed Music-Theory Metadata](/blog/precomputed-metadata-formats).

## Stage 2: Model Training

With large corpora of chord sequences, the next stage is training a neural network to predict progressions.

### Architecture: Transformer (current)

As of the v1.3 product line, training targets an **attention-based transformer** over the Roman-token vocabulary. Transformers model longer-range harmonic structure more effectively than the compact LSTM stack we used earlier, at the cost of a more careful export and runtime story (ONNX rather than a tiny custom matrix engine).

Conceptually the model still does next-token prediction:

- embed tokens  
- attend over context  
- project to vocabulary logits  
- train with cross-entropy / perplexity metrics  

Hyperparameters (depth, width, context length, dropout, schedules) are experiment-driven; what matters for the product is a model small enough for **local CPU inference** in a DAW plugin with interactive latency.

### Historical note: ChordLSTM

The first shipped generations used a stacked LSTM roughly like:

```python
class ChordLSTM(nn.Module):
    def __init__(self, vocab_size, embed_size=64, hidden_size=128,
                 num_layers=2, dropout=0.5):
        self.embedding = nn.Embedding(vocab_size, embed_size)
        self.lstm = nn.LSTM(embed_size, hidden_size, num_layers,
                            dropout=dropout, batch_first=True)
        self.fc = nn.Linear(hidden_size, vocab_size)
```

That design was easy to export as raw weight tensors and run with a hand-written C++ forward pass. It remains a good teaching example of sequence modeling (see [How is this AI?](/blog/but-is-it-ai)), but it is **not** the production architecture today.

### Training strategy (still applies)

**Vocabulary construction** from the corpus, plus special tokens for boundaries/padding. Typical vocabularies are on the order of hundreds of tokens after simplification—not tens of thousands.

**Sliding windows** over pieces so the model sees local and medium-range contexts.

**Regularization:** dropout, held-out pieces for validation, early stopping, learning-rate schedules on plateau.

**Metrics:** cross-entropy loss and perplexity (`exp(loss)`). A perplexity around ~10 means “about ten plausible next chords” on average—room for creativity without pure noise.

Checkpoints store weights, vocab, and hyperparameters for export.

## Stage 3: Export for Plugin Inference

Audio plugins must run with tight latency budgets and cannot ship full PyTorch.

### Current path: ONNX

Trained models are exported to **ONNX**. The plugin (via the domain library) loads the `.onnx` graph with **ONNX Runtime**, runs a forward pass over the token context, and obtains logits for sampling.

Why ONNX:

- **Cross-platform** runtimes (macOS, Windows, Linux)  
- **Stable C/C++/Rust bindings** without embedding Python  
- **Separation of concerns** — training stays in Python; runtime is a small inference stack  

Windows packaging of ORT has its own drama (DLL search order, host scanning); we document that separately in [It's 2026 and DLL Hell is Still a Thing](/blog/blog-onnxruntime-windows-audio-plugin).

### Historical path: JSON weight dump + pure C++ LSTM

Earlier releases exported rounded weight tensors to JSON and implemented LSTM gates by hand in C++. That was dependency-light and educational, but it did not scale cleanly to transformer graphs. Treat any remaining “export weights to JSON” snippets in older materials as **legacy**.

## Stage 4: Runtime in the Plugin

### Hybrid shell + domain

Today the runtime is hybrid:

- **JUCE / C++ shell** — plugin formats (AU, VST3, CLAP), editor UI, parameters, process-block glue, licensing HTTP, packaging.  
- **Rust domain library** — model load/query, generation/continuation/alternatives, logit masks and sampling helpers, Roman/NCT metadata, MIDI event construction, follow-mode pure compute, preset JSON.  
- **C ABI** — stable boundary; thin C++ façades keep call sites familiar while behavior lives in Rust.

See [Shipping Continuously: Moving a JUCE Plugin's Brain to Rust](/blog/blog-hybrid-rust-migration).

### From logits to notes

1. **Context** — recent Roman tokens (and duration encoding as designed).  
2. **Forward** — ONNX Runtime produces logits.  
3. **Decode** — temperature, top‑K, musical masks/biases (start chord, NCT, transitions, …).  
4. **Realize** — voice-leading search produces SATB (or similar) MIDI pitches with inversion constraints.  
5. **Emit** — note events become host MIDI, files, or drag-and-drop payloads in the shell.

### Voice leading (still essential)

The model outputs abstract tokens like `V6_1.0`. A **beam-search** voicer optimizes four-part realizations with costs for parallels, leaps, missing common tones, etc. Inversions from the token still constrain the bass. This is structured search on purpose—not “the network does voice leading for free.”

### Performance goals

- Interactive generation on CPU in a DAW  
- Model and metadata assets small enough to ship inside the plugin bundle  
- Deterministic options for tests (seeded sampling, fixed fixtures)

Exact millisecond budgets depend on context length, model size, and host buffer settings; the design target is “feels instant” for UI-driven generation, with heavier follow-mode work off the audio callback where needed.

## The Complete Pipeline in Action

1. **Extraction** — A `V6` in a chorale is analyzed in G major → token `V6_1.0`.  
2. **Training** — The transformer learns that such tokens participate in cadential and prolongational patterns across the corpus.  
3. **Export** — Weights become an ONNX graph + vocab tables; theory facts become packed JSON metadata.  
4. **Inference** — Domain code runs ONNX, samples the next token under temperature and constraints.  
5. **Voice leading** — Beam search realizes pitches consistent with the inversion.  
6. **Output** — MIDI notes hit the user’s instrument of choice (pad, strings, piano, orchestra library…).

## Lessons Learned

### 1. Simplification is essential

Capturing every ornamental detail explodes vocabulary and overfits. Simplified Roman tokens strike a balance between expressiveness and generalization.

### 2. Inversions are musical decisions

Treating inversions as distinct tokens lets the model influence bass motion; the voicer enforces those choices rather than inventing them alone.

### 3. Strong beat filtering is critical

Noisy vertical slices train the model on accidents of counterpoint. Structural harmony on a grid works better for progression learning.

### 4. Training stack ≠ shipping stack

Use PyTorch (or similar) to train; ship **ONNX + a small domain runtime**. Hand-rolling transformer math in C++ is a false economy once graphs grow.

### 5. Domain vs shell is a product architecture choice

Moving inference and music logic into Rust while keeping JUCE for hosts and UI let us improve the brain without pausing AU/VST3/CLAP shipment.

## Future Directions

- Hierarchical / phrase-level structure  
- Stronger user conditioning and interactive constraints  
- Style blending across corpora  
- Continued shell experiments (UI frameworks, alternate plugin toolkits) **after** the domain stays stable  

## Conclusion

Modeling harmony bridges music theory and machine learning—centuries of practice and modern sequence models. By designing extraction that preserves musical meaning, training that captures long-range dependencies, export that DAWs can run, and a hybrid runtime that stays shippable, LucidHarmony aims to be a creative partner rather than a random chord dice roller.

The system doesn’t replace musical knowledge; it encodes patterns learned from masters and combines them with explicit voice-leading and theory metadata. When you generate a progression, you’re using that stack—and then **you** choose the sound.

## Related reading

- [How is this AI?](/blog/but-is-it-ai)  
- [The LucidHarmony Tech Stack](/blog/technology-stack)  
- [Shipping Continuously: Moving a JUCE Plugin's Brain to Rust](/blog/blog-hybrid-rust-migration)  
- [C++ vs Rust: Domain Brains and Framework Bodies](/blog/cpp-vs-rust-domain-and-shell)  
- [Precomputed Music-Theory Metadata](/blog/precomputed-metadata-formats)  
- [It's 2026 and DLL Hell is Still a Thing](/blog/blog-onnxruntime-windows-audio-plugin)  

**Updated**
- 2026-07-12 — Replaced outdated LSTM / custom C++ JSON-export story with the current transformer → ONNX path.
- 2026-07-12 — Documented hybrid deployment: domain inference and orchestration in Rust; JUCE shell for UI and formats.
- 2026-07-12 — Clarified that LSTM details remain historical context, not what ships today.
- 2026-07-12 — Linked C++ vs Rust domain/shell comparison. 
