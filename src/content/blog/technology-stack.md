---
title: "The LucidHarmony Tech Stack: Modeling, Plugin, and Website"
description: "A categorized inventory of the core technologies behind LucidHarmony."
date: "2025-12-17"
readTime: "10 min read"
tags: ["tech","architecture","plugin","machine-learning","web","rust"]
---

*Published: December 17, 2025 · 10 min read*

LucidHarmony is built as a full pipeline: we **train transformer models offline**, run **real-time inference and domain logic inside a hybrid JUCE + Rust plugin**, and support it all with a **static website + infrastructure** for shipping updates and documentation.

This post is a living inventory of the technologies we use across the three layers.

## Modeling & Data Pipeline (Offline)

### Programming language & runtime

- **Python** — the primary language for dataset extraction and training.
  - https://www.python.org/

### Symbolic music + analysis

- **music21** — corpus access, score parsing, and harmonic / Roman numeral analysis.
  - https://www.music21.org/

### Machine learning

- **Transformer (attention-based sequence model)** — the primary architecture for learning harmonic progressions (from v1.3.0 onward). Replaced the earlier LSTM approach for richer, more expressive output.
  - https://en.wikipedia.org/wiki/Transformer_(deep_learning_architecture)

- **PyTorch** — training and export tooling.
  - https://pytorch.org/

- **ONNX** — models are exported from PyTorch to ONNX format for cross-platform inference.
  - https://onnx.ai/

- **Temperature sampling** — controls randomness during generation.
  - https://en.wikipedia.org/wiki/Softmax_function#Temperature

- **Top-K sampling** — restricts sampling to the K most likely tokens.
  - https://huggingface.co/blog/how-to-generate

### Music representation

- **Roman numeral tokens** — functional harmony representation (e.g. `I`, `V6`, `ii°`, etc.).
  - https://en.wikipedia.org/wiki/Roman_numeral_analysis

- **Quantized harmonic rhythm** — extracting chords on strong beats (e.g. quarter‑note grid) to suppress passing-tone “chatter”.

- **Precomputed music-theory metadata** — packed JSON tables for chord tones, spelling, NCT, and voice-leading aids (computed offline, looked up at runtime).

## Plugin (Real‑Time)

### Languages & standards

- **C++17** — JUCE plugin shell, editor, host glue, packaging integration.
  - https://isocpp.org/

- **Rust** (stable, edition 2021) — domain library: generation orchestration, logits, metadata engines, ONNX session, MIDI event construction, follow-mode compute, preset JSON.
  - https://www.rust-lang.org/

### Architecture

- **Hybrid shell + domain** — the host-facing plugin remains JUCE; non-UI domain logic runs in a Rust shared library behind a stable C ABI and thin C++ façades. Product stays shippable while the “brain” moves languages.
  - See: [Shipping Continuously: Moving a JUCE Plugin's Brain to Rust](/blog/blog-hybrid-rust-migration)

### Frameworks

- **JUCE** — plugin framework (UI, audio/MIDI plumbing, file export, formats).
  - https://juce.com/

- **Cargo / Cargo workspace** — builds the domain library; CMake invokes Cargo and links the resulting shared library into the plugin.
  - https://doc.rust-lang.org/cargo/

### Plugin formats / DAW integration

- **Audio Units (AU)** — macOS
  - https://developer.apple.com/documentation/audiounit

- **VST3** — macOS, Windows, Linux
  - https://steinbergmedia.github.io/vst3_doc/

- **CLAP** — macOS, Windows, Linux
  - https://cleveraudio.org/

### Inference runtime

- **ONNX Runtime** — transformer inference for chord-token generation. Invoked from the Rust domain library (via the `ort` crate). Packaging still embeds or statically links platform ORT binaries as needed (shared dylibs on macOS/Linux; static libs on Windows to avoid DLL conflicts).
  - https://onnxruntime.ai/
  - https://github.com/pykeio/ort

- **Softmax + sampling** — generation uses softmax probabilities, temperature scaling, and top-K style filtering.
  - https://en.wikipedia.org/wiki/Softmax_function

### Voicing / musical constraints

- **Beam search / Viterbi-style path search** — used to select voiced 4‑part realizations over time.
  - https://en.wikipedia.org/wiki/Beam_search
  - https://en.wikipedia.org/wiki/Viterbi_algorithm

- **Constraint-based voice leading heuristics** — avoid parallels, encourage stepwise motion, reward common tones, etc.

- **Non-chord tones (NCT)** — optional ornamental motion between structural chords, driven by precomputed metadata and bias rules.

### Interaction modes

- **Generate / continue / alternatives** — sequence generation and exploration from the model + constraints.
- **Follow mode (“Harmony Follows You”)** — live MIDI input drives harmony selection; pure compute in the domain library, host threading in the shell.
- **Infinite / tape-style workflows** — ongoing generation and capture for improvisation and sketching.

### MIDI

- **MIDI file generation** — exports single-track and multi-track MIDI, with time signature meta events.
  - https://www.midi.org/specifications

- **Drag-and-drop MIDI UX** — DAW-friendly workflow to get generated harmonies into your project quickly.

### Licensing & distribution

- **Gumroad license API** — product license validation from the plugin shell (network client remains C++/JUCE-side).
- **Presets** — user/factory preset JSON handled in the domain library with shell UI.

## Website (lucidmusician.com)

### Framework

- **Astro** — static site generator. All pages are pre-rendered HTML at build time with zero client-side JavaScript by default.
  - https://astro.build/

### Styling

- **Tailwind CSS 4**
  - https://tailwindcss.com/

- **Tailwind Typography** (prose styling for markdown content)
  - https://github.com/tailwindlabs/tailwindcss-typography

### Content

- **Astro Content Collections** — blog posts and docs pages are authored in Markdown with typed frontmatter schemas.
  - https://docs.astro.build/en/guides/content-collections/

- **@astrojs/sitemap** — auto-generated sitemap at build time.
  - https://docs.astro.build/en/guides/integrations-guide/sitemap/

### Performance

- **lite-youtube-embed** — lightweight YouTube facade that loads the real player only on click.
  - https://github.com/nicoulaj/lite-youtube-embed

### Infrastructure / deployment

#### IaC

- **AWS CDK (TypeScript)**
  - https://aws.amazon.com/cdk/

#### Hosting + CDN

- **Amazon S3** (static assets)
  - https://aws.amazon.com/s3/

- **Amazon CloudFront** (CDN)
  - https://aws.amazon.com/cloudfront/

#### DNS / certificates

- **Amazon Route 53**
  - https://aws.amazon.com/route53/

- **AWS Certificate Manager (ACM)**
  - https://aws.amazon.com/certificate-manager/

## Build, CI & packaging

### Local build

- **CMake + Ninja** — configure and build the plugin; Cargo is required on `PATH` so the domain library builds as part of the same graph.
- **Catch2** — C++ integration / parity tests.
- **Cargo test** — Rust domain unit tests.

### Continuous integration

GitHub Actions release workflows (dispatch-driven) cover:

- **Linux** x86_64 (GitHub-hosted) and arm64 (self-hosted)
- **macOS** arm64 (self-hosted; codesign, pkgbuild, notarize, staple)
- **Windows** x64 (self-hosted; Inno Setup installer, Azure Trusted Signing when configured)

All three install a **Rust stable toolchain** and cache Cargo artifacts. See [Building an Audio Plugin with GitHub Actions](/blog/github-actions-macos-linux-build) for the current shape of those pipelines.

### Release packaging

- **macOS** — signed AU / VST3 / CLAP component packages combined into a notarized product `.pkg` in CI (hardened runtime, Developer ID Application + Installer).
- **Windows** — VST3 + CLAP via Inno Setup installer and zip artifacts.
- **Linux** — zip of VST3/CLAP artefacts per architecture.

## Related reading

- [Shipping Continuously: Moving a JUCE Plugin's Brain to Rust](/blog/blog-hybrid-rust-migration)
- [C++ vs Rust: Domain Brains and Framework Bodies](/blog/cpp-vs-rust-domain-and-shell)
- [Modeling Harmonies: From Scores of the Masters to Real-Time AI](/blog/modeling-harmonies)
- [It's 2026 and DLL Hell is Still a Thing](/blog/blog-onnxruntime-windows-audio-plugin)
- [Building an Audio Plugin with GitHub Actions](/blog/github-actions-macos-linux-build)
- [Harmonic Generators for DAWs: State of the Union](/blog/harmonic-generator-plugins-comparison)

**Updated**
- 2026-07-12 — Reflected hybrid Rust domain architecture and current product stack (v1.4).
- 2026-07-12 — Clarified inference path (ONNX via domain library) and packaging/CI responsibilities.
- 2026-07-12 — Linked C++ vs Rust domain/shell comparison.
