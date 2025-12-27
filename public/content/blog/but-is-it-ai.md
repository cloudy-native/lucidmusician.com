# How is this AI?

*Published: December 17, 2025 • 14 min read*

When people say “AI” they often mean “a model that writes plausible sequences.” In practice, that could mean anything from a 2‑gram Markov chain to a GPT‑style Transformer. They’re all **probabilistic sequence models**, but they differ radically in:

- what conditional independence assumptions they make,
- how much context they can *effectively* use,
- how they’re trained,
- and how they’re decoded at inference time.

If you *don’t* have a math background, you can still follow along. The mental model you need is simple:

- **A model reads what you’ve already written**.
- **It assigns “next-step odds” to many possible next tokens** (a token can be a word, syllable, MIDI event, chord symbol, etc.).
- **A decoding strategy chooses one token** from those odds.

The rest of this article is a tour of *three ways to build that “next-step odds” machine*, from simple to powerful.

### A tiny glossary

- **Token**: the unit the model works with. In text it might be a word piece; in music it might be a chord symbol, a note-on event, a duration, or a “bar line.”
- **Context**: the tokens the model is allowed to look at when predicting the next token.
- **Context window**: the maximum context length a model can use at once.
- **Model**: produces a ranked list / odds for “what comes next.”
- **Decoding**: the rule you use to pick the next token from those odds.

## The common core: “predict the next token”

All three approaches (Markov chains, LSTMs, GPT) share the same outer loop:

- read the tokens so far
- score what could come next
- pick one
- append it
- repeat

Here’s that loop as a diagram:

![Common raining loop](/images/training.png)

So when people argue about whether something is “real AI,” they’re often mixing up two separate things:

- **The model**: how it computes those next-token scores.
- **The decoding**: how you turn scores into an actual output sequence.

If you like tables, here’s the whole article summarized up front:

| Family | What it “remembers” | Strengths | Typical failure modes |
| --- | --- | --- | --- |
| Markov / n‑gram | A fixed-size recent window | Simple, fast, works well for local grammar | Forgets long-range structure; sparse data issues |
| LSTM | A learned rolling memory | Good at style and medium-range patterns; efficient at inference | Memory bottleneck; can drift; training can be finicky |
| Transformer / GPT | Learned attention over many prior tokens | Strong long-range structure; scales well with data/compute | Expensive; context-window limits; can be confidently wrong |

## Markov chains and n‑gram language models

### The Markov idea: “only the recent past matters”

A Markov chain is the simplest story you can tell about sequences:

- **Look back a little** (often just 1 token, or a small fixed window).
- **Pick what usually comes next**.

In language terms, an **n‑gram** model looks at the last `n-1` tokens.

- a 2‑gram (bigram) looks at the previous token
- a 3‑gram (trigram) looks at the previous two tokens

This “fixed window” is both the superpower and the limitation:

- it’s fast and easy to understand
- but it has a hard memory cutoff

If the “reason” a token should appear depends on something that happened 30 tokens ago, a 5‑gram simply can’t see it.

One helpful way to picture a Markov model is as a map of “common next steps.” If you’re generating chord symbols, your map might strongly connect:

- `C` -> `F`
- `C` -> `Am`
- `G7` -> `C`

In the simplest form (a first-order Markov chain), you’re literally moving along a graph of transitions:

![Chord graph](/images/chord-graph.png)

### Training by counting (with a reality check)

Training an n‑gram model is basically **counting**.

You scan your dataset and build a table like:

- after “Cmaj7” you saw “Fmaj7” 120 times
- after “Cmaj7” you saw “Am7” 80 times
- after “Cmaj7” you saw “Db7” 2 times

Then at generation time, you turn those counts into “odds” and sample.

The practical problem is that real data is sparse:

- many reasonable sequences never appear in your dataset
- a lot of contexts appear only once

So n‑gram systems usually add “smoothing/backoff” tricks that say, roughly:

- “If I’ve never seen this exact context, fall back to a shorter context.”

That’s why Markov/n‑gram models can feel *surprisingly* coherent for short stretches:

- they’re great at producing things that look like the training data *locally*
- but they don’t have a mechanism for global intention

### Why n‑grams are not “dumb,” but are limited

n‑grams can be surprisingly strong for certain symbolic tasks (including some music tokenizations) when:

- local syntax dominates (short-range dependencies), and
- the vocabulary is small.

But they struggle when you need:

- long-range structure,
- hierarchical patterns,
- global constraints,
- “themes” that recur after long spans.

Reference:

- Markov chains: https://en.wikipedia.org/wiki/Markov_chain
- n‑gram LMs: https://en.wikipedia.org/wiki/N-gram

## LSTMs: learned state as a compressed summary of the past

### The upgrade over n‑grams: a learned “memory”

An LSTM is part of a family called **recurrent neural networks** (RNNs). The big conceptual jump is this:

- instead of a hard cutoff (“only the last 4 tokens matter”)
- the model carries forward a **rolling summary** of everything it has seen

You can picture it like reading a story while keeping notes.

- At each new sentence, you update your notes.
- When you predict what happens next, you use those notes.

That “notes” object is a bunch of numbers inside the model (a learned memory).

Two important implications:

- there is **no hard cutoff** like an n‑gram window
- but there *is* a **bottleneck**: the notes have fixed size

### Why “plain memory” is tricky (and what LSTM fixes)

If you try to learn long-range patterns with a simple RNN, the training signal has a habit of fading away as you look further back in time.

You don’t need calculus to understand the vibe:

- learning depends on many small step-by-step influences
- multiplying a lot of small influences often becomes *tiny*

So the model becomes great at “recent context” and forgetful about “things from long ago.”

LSTMs were designed as a practical fix.

### LSTM in one sentence: controlled remembering

An LSTM adds a more explicit memory mechanism with “gates” that behave like dials:

- **forget**: what should I erase?
- **write**: what new thing should I store?
- **show**: what part of my memory should influence the next-token choice?

If you want a visual intuition, it’s closer to a tiny state machine than to a simple sliding window:

![LST flowchart](/images/lstm-flow.png)

Historically, LSTMs were the workhorse for sequence generation for years (text, MIDI, audio feature sequences) because they hit a nice practical point:

- decent long-range behavior *without* the quadratic attention cost
- efficient “one step at a time” decoding

But they can still drift over long generations: if the internal memory loses the plot, there’s no easy way to “re-scan” the entire earlier context.

### Training and decoding (still the same outer loop)

From the outside, LSTMs still do the same thing as n‑grams:

- training: learn to assign high odds to the “correct next token” in your dataset
- generation: turn those odds into actual tokens using a decoding strategy (greedy, sampling, top‑p, etc.)

Reference:

- LSTM: https://en.wikipedia.org/wiki/Long_short-term_memory

## GPT/Transformers: attention over all previous tokens

### Decoder-only Transformers

GPT-style models are *decoder-only Transformers* trained to predict the next token, just like the other approaches.

The difference is how they use context.

- LSTM: compress the past into a single “memory” vector
- Transformer: keep representations for many past tokens and **learn where to look**

### Self-attention (the core operator)

Self-attention is easiest to understand as a “spotlight.”

When generating the next token, the model can look back over the earlier tokens and decide:

- which earlier token(s) matter most right now?
- how should I combine them?

It does this *for every layer* and learns the “looking” behavior from data.

For a high-school-math mental model:

- every previous token gets a **relevance score**
- those scores become **weights** that add up to 1
- the model takes a **weighted average** of information from the past

Here’s a sketch of the idea:

![Self-attention](/images/token-odds.png)

Two practical notes that complete the picture:

- **Position matters**: the model needs a way to tell “this token was 3 steps ago” vs “300 steps ago.” Transformers add a positional signal so order isn’t lost.
- **Context windows are real limits**: a Transformer can only attend over the tokens it’s given. Outside the context window, it can’t “see” anything unless you re-provide it (or use retrieval).

### Why Transformers scale differently than LSTMs

- **Context access**:
  - n‑gram: a fixed small window
  - LSTM: theoretically long, but filtered through a single memory bottleneck
  - Transformer: can directly reference any earlier token within its context window

- **Why that matters**:
  - Transformers can learn patterns like “echo something from earlier” or “match a structure introduced 200 tokens ago” more naturally.
  - They also train very efficiently on modern hardware because many operations can happen in parallel.

### KV caching at inference

Autoregressive decoding with Transformers typically uses a key/value cache so each next token step does not recompute attention over the full prefix from scratch.

### What “GPT” adds beyond architecture

“GPT” is a bundle of:

- decoder-only Transformer
- large-scale training data
- next-token prediction objective
- careful optimization, regularization, and scaling
- decoding heuristics (temperature, top‑p, repetition penalties, etc.)

In modern usage, “GPT-like” systems often add a few more ingredients that people feel as “intelligence,” even though the core training objective is still next-token prediction:

- **Scale**: bigger models trained on more data tend to pick up more abstract patterns.
- **Instruction tuning**: extra training so the model follows prompts like “Explain this” or “Write in this style.”
- **Preference tuning / RLHF** (or similar): training that pushes outputs toward what humans rate as helpful/safe.
- **Tool use**: the model can call external tools (search, calculators, code execution) and incorporate the results.
- **Retrieval augmentation (RAG)**: fetch relevant docs from a database and include them in the context so the model can quote and ground its answers.

Those additions are a big reason a modern chat model feels different from “a random text generator,” even though the underlying generation mechanism is still: predict-next-token, repeatedly.

References:

- Attention Is All You Need: https://arxiv.org/abs/1706.03762
- GPT-2 paper: https://openai.com/research/language-unsupervised

## Decoding ≠ training (and why this matters for “AI” claims)

This is the part that trips people up.

Two systems can share the *same* trained model and still produce wildly different output, because decoding is an extra decision layer.

- **Training** teaches the model to produce sensible “next-token odds.”
- **Decoding** decides how bold, safe, repetitive, or diverse the final output is.

Even a strong model can generate junk if you decode poorly (too greedy, too random, no repetition controls, etc.).

In other words:

- training is “how the model learns what seems plausible”
- decoding is “how adventurous you want the output to be”

Common decoding strategies:

- **Greedy**: fast, deterministic, can be repetitive
- **Beam search**: approximates the MAP sequence
  - good for constrained objectives, but can reduce diversity
- **Sampling** (temperature, top‑K, top‑p): increases diversity

Reference:

- Beam search: https://en.wikipedia.org/wiki/Beam_search

## How this maps to music generation

Symbolic music is unforgiving: a single invalid token can break structure.

Also: music often has **multi-scale structure**:

- local: voice-leading, chord-to-chord motion
- medium: phrase shapes, cadences
- global: form, motif return, tension/release arcs

- **n‑grams** capture local grammar (e.g., common chord-to-chord transitions), but cannot enforce global constraints.
- **LSTMs** learn “style” well and can work with compact models and small vocabularies.
- **Transformers** are extremely strong at long-range structure but are typically heavier to deploy inside real-time plugin constraints.

A practical pattern is a hybrid:

- use an autoregressive model (LSTM or Transformer) for *what happens next*,
- then apply a separate structured search/constraint system for *how to realize it* (e.g., voice leading), which may use beam search for a completely different reason than text decoding.

This is why you’ll sometimes see “AI music” systems that combine:

- a learned generator (n‑gram/LSTM/Transformer)
- plus explicit musical rules or a scoring function

It’s not cheating; it’s engineering.

## So… is it AI?

If “AI” means “systems that learn statistical structure from data and generalize,” then:

- n‑grams are already “AI” in that sense.
- LSTMs and Transformers are *more expressive* function classes trained the same maximum-likelihood way.

If “AI” means “human-level reasoning,” that’s a different claim entirely, and it does not follow from next-token prediction alone.

If you want a simple way to complete the picture:

- Markov chains answer: “What tends to follow what, locally?”
- LSTMs answer: “What’s a useful compressed memory of the past?”
- Transformers/GPT answer: “Where should I look in the past, right now, and how should I combine it?”

## Related reading

- [Modeling Harmonies: From Scores of the Masters to Real-Time AI](/blog/modeling-harmonies)
- [The LucidHarmony Tech Stack: Modeling, Plugin, and Website](/blog/technology-stack)
