# Modeling Harmonies: From Scores of the Masters to Real-Time AI
*Published: December 11, 2025 • 12 min read*

How do you teach a machine to understand harmony? Not just to recognize chords, but to grasp the deep patterns that composers use to create musical coherence? This article explores the complete pipeline behind LucidHarmony's AI-powered harmonic generation system, from extracting knowledge from historical scores to deploying a lightweight neural network inside an audio plugin.

> [!NOTE]
> 
> This post contains code and music theory. But you can safely skip over code blocks and harmonic notation and still get the gist of what's happening in the pipeline. 
>
> We think it's pretty interesting in any case.

## Introduction
LucidHarmony's approach to harmonic modeling is built on a three-stage pipeline that transforms centuries of musical knowledge into an AI model that can be used in the real-time harmonic inference engine. The system learns from the masters—analyzing thousands of Renaissance and Baroque compositions—and distills this knowledge into a compact model that can generate stylistically authentic chord progressions on the fly.

Why Renaissance and Baroque and not pop songs? Because the harmonic language of composers like [Bach](https://en.wikipedia.org/wiki/Johann_Sebastian_Bach), [Palestrina](https://en.wikipedia.org/wiki/Giovanni_Palestrina), and [Monteverdi](https://en.wikipedia.org/wiki/Claudio_Monteverdi) in that time period set the harmonic foundation of Western music. By learning from the masters, LucidHarmony can generate harmonic progressions that are both musically coherent and stylistically authentic. You can use this know-how to create harmonies with this foundation that **sound** robust and beautiful in any context from classical through ambient to pop.

The pipeline consists of three critical stages:
1. **Extraction**: Converting musical scores into machine-readable harmonic sequences
2. **Training**: Teaching an [LSTM neural network](https://en.wikipedia.org/wiki/Long_short-term_memory) to predict harmonic progressions
3. **Export**: Deploying the model as a dependency-free C++ inference engine

Let's dive deep into each stage.

## Stage 1: Chord Extraction
The first challenge in modeling harmony is converting raw musical scores into a format suitable for machine learning. We created Python code to process MusicXML, MIDI, and Kern files from composers spanning the 14th to 18th centuries.

### The Extraction Process
The extraction pipeline uses the [`music21`](https://www.music21.org/music21docs/) library to parse scores and perform sophisticated harmonic analysis:

#### 1. Parsing and Key Detection
```python
score = converter.parse(str(path))
k = score.analyze("key")
```
The system automatically detects the key of each piece using `music21`'s built-in analysis tools. This is crucial because all subsequent harmonic analysis is performed relative to the detected key, allowing the model to learn functional harmony patterns that generalize across different keys.

#### 2. Chordification
```python
chordified = score.chordify().flatten()
```
Polyphonic scores are flattened into vertical "slices"—snapshots of all notes sounding at each moment in time. This transforms complex multi-voice counterpoint into a sequence of simultaneous pitch collections.

#### 3. Harmonic Filtering: The Strong Beat Rule
One of the most sophisticated aspects of the extraction process is its handling of passing tones and non-harmonic tones. Early versions of the system captured every vertical sonority, resulting in "dissonant chatter"—fleeting harmonies that don't represent the underlying harmonic structure.

The solution is a **Strong Beat Rule** that filters harmonies occurring on strong beats (quarter note level in 4/4 time) to be extracted as harmonic anchors. Weak-beat sonorities are ignored, and their duration is merged into the previous strong-beat chord. This maintains rhythmic integrity while focusing on structurally significant harmonies.

#### 4. Roman Numeral Tokenization
The heart of the extraction process is converting chords to Roman Numeral analysis:
```python
rn = roman.romanNumeralFromChord(c, k)
token = get_simplified_figure(rn)
```
Each chord is analyzed relative to the local key and converted to a standardized Roman numeral token. The `get_simplified_figure()` function performs critical simplifications:

**Simplification Rules:**
- Complex figures like `V[#4]6` are reduced to `V6`
- Quality markers are preserved: `o` for diminished, `+` for augmented
- Inversions are strictly maintained: `I`, `I6`, `I64`

**Why Inversions Matter:**
This is a crucial design decision. By preserving inversions in the token vocabulary (e.g., distinguishing `V` from `V6`), the model learns to compose the bass line, not just chord roots. A first-inversion chord (`V6`) has the third in the bass, fundamentally changing the voice leading and harmonic function.

#### 5. Duration Encoding
Each token is appended with a quantized duration:
```python
# Format: Figure_Duration
# Example: "V6_1.0" (V6 chord lasting one quarter note)
```
This allows the model to learn not just which chords follow which, but also the rhythmic pacing of harmonic change.

### Output Format
The extraction produces JSON files containing sequences of chord tokens:
```json
{
  "metadata": {
    "file": "palestrina_mass_01.xml",
    "key": "D major"
  },
  "chords": ["I_2.0", "V6_1.0", "I_1.0", "IV_2.0", "V_1.0", "I_2.0"]
}
```
This dataset becomes the training corpus for the neural network.

## Stage 2: Model Training
With thousands of chord sequences extracted from historical scores, the next stage is training a neural network to predict harmonic progressions. The training script implements a carefully designed [LSTM](https://en.wikipedia.org/wiki/Long_short-term_memory) architecture optimized for this task.

### Architecture: ChordLSTM
The model uses a stacked LSTM (Long Short-Term Memory) architecture, chosen for its ability to capture long-range dependencies in sequential data:
```python
class ChordLSTM(nn.Module):
    def __init__(self, vocab_size, embed_size=64, hidden_size=128,
                 num_layers=2, dropout=0.5):
        self.embedding = nn.Embedding(vocab_size, embed_size)
        self.lstm = nn.LSTM(embed_size, hidden_size, num_layers,
                            dropout=dropout, batch_first=True)
        self.fc = nn.Linear(hidden_size, vocab_size)
```
**Layer Breakdown:**
1. **Embedding Layer** (`embed_size=64`): Maps discrete chord tokens to dense 64-dimensional vectors. This allows the model to learn semantic relationships between chords (e.g., that `V` and `V7` are related).
2. **Stacked LSTM** (`hidden_size=128`, `num_layers=2`): Two LSTM layers with 128 hidden units each. The recurrent architecture maintains a "memory" of previous chords, allowing it to understand context like "we're in a cadential progression" or "this is the beginning of a sequence."
3. **Fully Connected Layer**: Projects the LSTM's hidden state back to vocabulary size, producing a probability distribution over all possible next chords.

### Training Strategy
The training process incorporates several sophisticated techniques to prevent overfitting and ensure generalization:

#### Vocabulary Construction
```python
# Build vocabulary from training data
tokens = [token for seq in sequences for token in seq]
token_counts = Counter(tokens)
vocab = {token: i for i, token in enumerate(unique_tokens)}
# Add special tokens
vocab["<PAD>"] = len(vocab)
vocab["<START>"] = len(vocab)
vocab["<END>"] = len(vocab)
```
The vocabulary is constructed dynamically from the training corpus, with special tokens for sequence boundaries and padding. Typical vocabulary sizes range from 200-500 tokens depending on the composer corpus.

#### Sliding Window Sequences
```python
SEQ_LENGTH = 32
# Create sliding windows
for i in range(len(indices) - seq_length):
    input_seq = indices[i : i + seq_length]
    target_seq = indices[i + 1 : i + seq_length + 1]
```
Each piece is split into overlapping 32-chord windows. The model learns to predict the next chord given the previous 32, allowing it to capture both local progressions and longer-term harmonic trajectories.

#### Regularization Techniques
**1. Dropout** (`dropout=0.5`): Randomly drops 50% of neurons during training to prevent [co-adaptation](https://aiwiki.ai/wiki/Co-adaptation) and [overfitting](https://aiwiki.ai/wiki/Overfitting).  
**2. Validation Split** (`VAL_SPLIT=0.15`): 15% of pieces are held out for validation, ensuring the model generalizes to unseen compositions.  
**3. Early Stopping** (`EARLY_STOP_PATIENCE=10`): Training halts if validation loss doesn't improve for 10 epochs, preventing overfitting to the training set.  
**4. Learning Rate Decay**:
```python
scheduler = optim.lr_scheduler.ReduceLROnPlateau(
    optimizer, mode='min', factor=0.5, patience=3
)
```
The learning rate is automatically reduced when validation loss plateaus, allowing fine-tuning in later epochs.

### Training Metrics
The model is evaluated using two key metrics:  
**Loss**: Cross-entropy loss measuring prediction accuracy  
**Perplexity**: `exp(loss)`, representing the effective "branching factor" of the model's predictions. Lower perplexity means more confident, accurate predictions.

Typical training results:
```
Epoch 50 | Train Loss: 2.1234 (PPL: 8.36) |
          Val Loss: 2.3456 (PPL: 10.44) | LR: 0.000125
```
A perplexity of ~10 means the model is effectively choosing from about 10 plausible next chords at each step—a reasonable level of uncertainty that allows for creative variation while maintaining stylistic coherence.

### Model Checkpoint
The final model is saved as a PyTorch checkpoint containing:
```python
{
    "model_state_dict": model.state_dict(),
    "vocab": train_dataset.vocab,
    "hyperparameters": {
        "embed_size": 64,
        "hidden_size": 128,
        "num_layers": 2
    },
    "best_val_loss": 2.3456
}
```
This checkpoint contains everything needed to reconstruct the model and perform inference.

## Stage 3: Export to C++ Inference Engine
The final stage is perhaps the most technically challenging: deploying the trained PyTorch model inside a real-time audio plugin. Audio plugins operate under strict constraints—they must process audio in small buffers (typically 512 samples) with minimal latency, and they cannot rely on heavy dependencies like PyTorch.

The solution is to convert the PyTorch model into a pure JSON format that can be loaded by a custom C++ inference engine embedded in the plugin

### Export Process
```python
def export_to_json(model_path, output_path, decimals=4):
    checkpoint = torch.load(model_path, map_location='cpu')
    export_data = {
        "metadata": {
            "vocab_size": len(vocab),
            "embed_size": 64,
            "hidden_size": 128,
            "num_layers": 2
        },
        "vocab": vocab,
        "index_to_token": {i: t for t, i in vocab.items()},
        "weights": {}
    }
    for key, value in state_dict.items():
        # Round to 4 decimals to reduce file size
        value = value.double()
        scale = 10**decimals
        value = torch.round(value * scale) / scale
        export_data["weights"][key] = value.tolist()
```
**Key Transformations:**
1. **Weight Extraction**: All PyTorch tensors (embedding weights, LSTM gates, fully connected layer) are extracted and converted to nested Python lists.
2. **Precision Reduction**: Weights are rounded to 4 decimal places (`decimals=4`). This reduces file size by ~40% with negligible impact on prediction quality. The double-precision conversion before rounding prevents float32 artifacts.
3. **Vocabulary Mapping**: Both `token → index` and `index → token` mappings are included for bidirectional lookup during inference.

### The Exported JSON Structure
```json
{
  "metadata": {
    "vocab_size": 342,
    "embed_size": 64,
    "hidden_size": 128,
    "num_layers": 2
  },
  "vocab": {
    "I": 0,
    "V": 1,
    "IV": 2,
    ...
  },
  "weights": {
    "embedding.weight": [[0.1234, -0.5678, ...], ...],
    "lstm.weight_ih_l0": [...],
    "lstm.weight_hh_l0": [...],
    "lstm.bias_ih_l0": [...],
    "lstm.bias_hh_l0": [...],
    "lstm.weight_ih_l1": [...],
    "lstm.weight_hh_l1": [...],
    "lstm.bias_ih_l1": [...],
    "lstm.bias_hh_l1": [...],
    "fc.weight": [...],
    "fc.bias": [...]
  }
}
```

### C++ Inference Implementation
The plugin's inference engine implements the LSTM forward pass using only standard C++ and `std::vector`:

**Key Features:**
1. **No External Dependencies**: The entire inference engine uses only STL containers and basic math operations. No PyTorch, TensorFlow, or ONNX runtime required.
2. **LSTM Cell Implementation**: Manual implementation of LSTM gates (input, forget, output, cell state) using the exported weights:
```cpp
// Simplified LSTM forward pass
for (int t = 0; t < seq_length; t++) {
    // Input gate: σ(W_ii * x + b_ii + W_hi * h + b_hi)
    // Forget gate: σ(W_if * x + b_if + W_hf * h + b_hf)
    // Cell gate: tanh(W_ig * x + b_ig + W_hg * h + b_hg)
    // Output gate: σ(W_io * x + b_io + W_ho * h + b_ho)
    // Cell state: f * c + i * g
    // Hidden state: o * tanh(c)
}
```
3. **Temperature Sampling**: The inference engine supports temperature-controlled sampling for creative control:
```cpp
// Apply temperature to logits before softmax
for (auto& logit : logits) {
    logit /= temperature;
}
// Higher temperature = more surprising chords
// Lower temperature = more predictable progressions
```
4. **Constraint System**: The engine can enforce musical constraints like starting with a specific chord (e.g., "I") or preventing immediate repetition.

### Performance Characteristics
The exported model is remarkably efficient:
- **Model Size**: ~2-5 MB (depending on vocabulary size)
- **Inference Time**: <1ms per chord prediction on modern CPUs
- **Memory Footprint**: ~10 MB loaded in RAM

This makes it suitable for real-time use in audio plugins, where predictions must happen instantaneously as users interact with the interface.

## From Tokens to Music: Voice Leading
The model outputs abstract Roman numeral tokens like `V6_1.0`, but to hear the music, these must be converted to concrete MIDI notes. This is handled by the voice-leading engine, which implements a [beam search](https://en.wikipedia.org/wiki/Beam_search) algorithm to find optimal four-part (SATB) voicings using heuristics.

### The "Path of the Bass"
A critical design principle: **the model composes the bass line, not just chord roots**. By learning inversions as distinct tokens, the model makes explicit bass-line decisions:
- `V` → Root position (scale degree 5 in bass)
- `V6` → First inversion (scale degree 7 in bass)
- `V43` → Second inversion seventh chord (scale degree 2 in bass)

The voice-leading engine strictly enforces these inversions:
```python
# ENFORCE INVERSION: Bass voice must match the chord's bass note
bass_pc = rn.bass().pitchClass
bass_candidates = [n for n in voice_options[3] if n % 12 == bass_pc]
```

### Optimization via Beam Search
The voicing algorithm uses beam search to find the optimal path through the chord sequence, minimizing a cost function that penalizes:
- **Parallel 5ths and 8ves**: Hard constraint (cost = 99999)
- **Voice crossing**: Severe penalty (cost = 9999)
- **Large melodic leaps**: Penalty proportional to interval size
- **Lack of common tones**: Bonus for voice leading smoothness
- **Contrary motion**: Bonus for bass vs. soprano moving in opposite directions

```python
def calculate_cost(prev_voicing, curr_voicing):
    cost = 0.0
    # Check for parallel perfect intervals
    for i, j in voice_pairs:
        if is_parallel_perfect(prev, curr, i, j):
            return 99999.0  # Reject
    # Reward smooth voice leading
    for v1, v2 in zip(prev_voicing, curr_voicing):
        if v1 == v2:  # Common tone
            cost -= 2.0
        cost += abs(v2 - v1)  # Penalize movement
    return cost
```
This produces voicings that sound natural and follow traditional voice-leading principles, even though the model never explicitly learned these rules—they emerge from the optimization process.

## The Complete Pipeline in Action
Let's trace a single chord through the entire pipeline:
1. **Extraction**: A V6 chord in Bach's chorale BWV 1 is analyzed:
   - Detected key: G major
   - Chord: D major in first inversion (D-F#-A with F# in bass)
   - Token: `V6_1.0`
2. **Training**: The model learns that `V6` often follows `I` and precedes `I`:
   - Context: `[..., I_2.0, V6_1.0, I_1.0, ...]`
   - The LSTM's hidden state encodes "we're approaching a cadence"
3. **Inference**: During generation, the model predicts `V6` with probability 0.23:
   - Input context: `[I_2.0, IV_1.0, ...]`
   - Temperature sampling selects `V6_1.0`
4. **Export**: The C++ engine looks up token index 47 → `V6`
5. **Voice Leading**: The voicing engine realizes `V6` in G major:
   - Bass: F#3 (the third of the chord)
   - Tenor: D4
   - Alto: A4
   - Soprano: D5
   - Cost: 12.3 (smooth voice leading from previous chord)
6. **Output**: MIDI notes [54, 62, 69, 74] are sent to the synthesizer

## Lessons Learned
Building this pipeline revealed several key insights:

### 1. Simplification is Essential
Early versions captured every detail of the original scores—figured bass symbols, chromatic alterations, complex suspensions. This created a vocabulary of thousands of tokens, leading to severe overfitting. The simplified token system (200-500 tokens) strikes the right balance between expressiveness and generalization.

### 2. Inversions are Musical Decisions
Treating inversions as distinct tokens was initially controversial—why not let the voicing engine decide? But inversions are compositional choices that affect harmonic function, not just voice-leading details. A `V6` chord has a different character than a `V` chord, and the model needs to learn when each is appropriate.

### 3. Strong Beat Filtering is Critical
Capturing every vertical sonority produced noisy, unmusical training data. The strong beat rule dramatically improved model quality by focusing on structurally significant harmonies.

### 4. Lightweight Deployment is Possible
With careful engineering, sophisticated neural networks can run in real-time environments without heavy dependencies. The key is separating training (use powerful frameworks) from inference (implement only what's needed).

## Future Directions
The current pipeline opens several exciting research directions:
- **Hierarchical Models**: Capturing phrase-level structure and large-scale tonal plans
- **Style Transfer**: Interpolating between different composer styles
- **User Conditioning**: Allowing users to guide generation with constraints or examples
- **Polyphonic Generation**: Generating independent melodic lines, not just chords

## Conclusion

Modeling harmony is a bridge between music theory and machine learning, between centuries of compositional practice and modern AI techniques. By carefully designing each stage of the pipeline—from extraction that preserves musical meaning, through training that captures long-range dependencies, to deployment that runs in real-time—LucidHarmony demonstrates that AI can be a creative partner in music composition.

The system doesn't replace musical knowledge; it encodes it. The model learned from Bach, Palestrina, and Monteverdi, distilling their harmonic language into a compact neural network. When you use LucidHarmony to generate a chord progression, you're tapping into centuries of musical wisdom, translated into the language of tensors and gradients.

**Tags:** #machine-learning #music-theory #lstm #harmony #ai-composition #audio-plugins