# The LucidHarmony Tech Stack: Modeling, Plugin, and Website
*Published: December 17, 2025 • 10 min read*

LucidHarmony is built as a full pipeline: we **train models offline**, run **real-time inference inside a JUCE audio plugin**, and support it all with a **website + infrastructure** for shipping updates and documentation.

This post is a living inventory of the technologies we use across the three layers.

## Modeling & Data Pipeline (Offline)

### Programming language & runtime

- **Python** — the primary language for dataset extraction and training.
  - https://www.python.org/

### Symbolic music + analysis

- **music21** — corpus access, score parsing, and harmonic / Roman numeral analysis.
  - https://www.music21.org/

### Machine learning

- **LSTM (Long Short-Term Memory)** — sequence model used to learn harmonic progressions.
  - https://en.wikipedia.org/wiki/Long_short-term_memory

- **Temperature sampling** — controls randomness during generation.
  - https://en.wikipedia.org/wiki/Softmax_function#Temperature

- **Top‑K sampling** — restricts sampling to the K most likely tokens.
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

### Inference runtime (dependency-free)

- **Custom LSTM inference in C++** — the plugin loads model weights from JSON and runs forward passes without external ML runtimes.
  - https://github.com/juce-framework/JUCE (for JSON parsing utilities used by the plugin)

- **Softmax + sampling** — generation uses softmax probabilities, temperature scaling, and top‑K style filtering.
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

### Languages & tooling

- **TypeScript**
  - https://www.typescriptlang.org/

- **React**
  - https://react.dev/

- **Vite** (build tool / dev server)
  - https://vitejs.dev/

### UI + styling

- **HeroUI** (component library)
  - https://www.heroui.com/

- **Tailwind CSS**
  - https://tailwindcss.com/

- **Tailwind Typography** (prose styling)
  - https://github.com/tailwindlabs/tailwindcss-typography

- **Framer Motion** (animation)
  - https://www.framer.com/motion/

- **Lucide** (icons)
  - https://lucide.dev/

### Content rendering

- **react-markdown**
  - https://github.com/remarkjs/react-markdown

- **remark-gfm** (GitHub-flavored Markdown)
  - https://github.com/remarkjs/remark-gfm

- **remark-math** + **KaTeX** (math rendering)
  - https://github.com/remarkjs/remark-math
  - https://katex.org/

- **Mermaid** (diagrams)
  - https://mermaid.js.org/

- **react-router** (client-side routing)
  - https://reactrouter.com/

## Infrastructure / Deployment

### IaC

- **AWS CDK (TypeScript)**
  - https://aws.amazon.com/cdk/

### Hosting + CDN

- **Amazon S3** (static assets)
  - https://aws.amazon.com/s3/

- **Amazon CloudFront** (CDN)
  - https://aws.amazon.com/cloudfront/

### DNS / certificates

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
