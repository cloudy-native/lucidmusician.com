---
title: "The LucidHarmony Tech Stack: Modeling, Plugin, and Website"
description: "A categorized inventory of the core technologies behind LucidHarmony."
date: "2025-12-17"
readTime: "10 min read"
tags: ["tech","architecture","plugin","machine-learning","web"]
---

*Published: December 17, 2025 • 10 min read*

LucidHarmony is built as a full pipeline: we **train transformer models offline**, run **real-time inference inside a JUCE audio plugin via ONNX Runtime**, and support it all with a **static website + infrastructure** for shipping updates and documentation.

This post is a living inventory of the technologies we use across the three layers.

## Modeling & Data Pipeline (Offline)

### Programming language & runtime

- **Python** — the primary language for dataset extraction and training.
  - https://www.python.org/

### Symbolic music + analysis

- **music21** — corpus access, score parsing, and harmonic / Roman numeral analysis.
  - https://www.music21.org/

### Machine learning

- **Transformer (attention-based sequence model)** — the primary architecture for learning harmonic progressions as of v1.3.0. Replaced the earlier LSTM approach for richer, more expressive output.
  - https://en.wikipedia.org/wiki/Transformer_(deep_learning_architecture)

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

## Plugin (Real‑Time)

### Languages & standards

- **C++17** — core implementation language.
  - https://isocpp.org/

### Frameworks

- **JUCE** — plugin framework (UI, audio/MIDI plumbing, file export).
  - https://juce.com/

### Plugin formats / DAW integration

- **Audio Units (AU)**
  - https://developer.apple.com/documentation/audiounit

- **VST3**
  - https://steinbergmedia.github.io/vst3_doc/

- **CLAP**
  - https://cleveraudio.org/

### Inference runtime

- **ONNX Runtime** — the plugin loads trained models exported to ONNX format and runs inference via the ONNX Runtime C++ API. This replaced a custom LSTM implementation in v1.3.0.
  - https://onnxruntime.ai/

- **Softmax + sampling** — generation uses softmax probabilities, temperature scaling, and top-K style filtering.
  - https://en.wikipedia.org/wiki/Softmax_function

### Voicing / musical constraints

- **Beam search / Viterbi-style path search** — used to select voiced 4‑part realizations over time.
  - https://en.wikipedia.org/wiki/Beam_search
  - https://en.wikipedia.org/wiki/Viterbi_algorithm

- **Constraint-based voice leading heuristics** — avoid parallels, encourage stepwise motion, reward common tones, etc.

### MIDI

- **MIDI file generation** — exports single-track and multi-track MIDI, with time signature meta events.
  - https://www.midi.org/specifications

- **Drag-and-drop MIDI UX** — DAW-friendly workflow to get generated harmonies into your project quickly.

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

## Release Packaging (macOS AU)

For macOS distribution, we automate AU installer creation with a small Bash script:

- `scripts/package_au_pkg.sh`

At a high level it:

- **Stages the built `.component`** into a temporary directory (`mktemp`, `ditto`).
- **Code-signs the component** (hardened runtime optional) using `codesign`, then verifies the signature.
  - https://developer.apple.com/documentation/security/notarizing_macos_software_before_distribution
- **Builds an installer package** using Apple’s packaging tools:
  - `pkgbuild` (component package)
  - `productbuild` (final signed installer)
  - https://developer.apple.com/documentation/installerproducts
- **Notarizes** the resulting `.pkg` with `xcrun notarytool submit --wait`.
  - https://developer.apple.com/documentation/security/notarizing_macos_software_before_distribution/customizing_the_notarization_workflow
- **Staples** the notarization ticket to the `.pkg` with `xcrun stapler staple`.

## Related reading

- [Modeling Harmonies: From Scores of the Masters to Real-Time AI](/blog/modeling-harmonies)

- [Harmonic Generators for DAWs: State of the Union](/blog/survey)
