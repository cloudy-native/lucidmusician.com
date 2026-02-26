# LucidHarmony: Release Notes

![](/images/LH-logo-small-cropped.jpg)

## 1.1.0: February 26, 2026

- Top-to-bottom rewrite of how notes are generated from the AI model
- Replaced tons of special cases and logic with a more robust approach using extensive off-line music theory data
- We now use exactly the same music theory for both chord extraction and generation, so the code is only in one place
- As a consequence, harmonies are cleaner and rules consistent
- We hope you'll agree it's a big win for voicing leading

## 1.0.6: February 11, 2026

- License key registration and checking
- Custom remote API AWS stack for Gumroad license key registrations and checking
- Updated UI for license key, including a tiny nag, which will not stop the app from running

## 1.0.5: February 2, 2026

- Internal refactoring to improve code quality
- Rework of build process to use GitHub Actions

## 1.0.4: January 14, 2026

- Correct MIDI priority so when a track already contains MIDI data, the plugin passes the existing MIDI data to the host
- Refined chord selection to ignore duplicate chords when they are generated from candidates with different note lengths in the training data
- Fixed an issue where generated chords always had length 1

## 1.0.3: December 30, 2025 (public beta)

- Installer refinements
- Cosmetics and minor bug fixes
- Improvements to harmonic sequence generation for the first few chords

## 1.0.2: December 30, 2025 (public beta)

- Finally found and fixed the [X]Maj7/[Y] bug in minor keys
- Duration-aware models are now the default, even when duration is turned off
  - This doesn't affect the actual durations in non-duration mode
- Model resources are bundled rather than installed as separate files
- Internal refactoring to improve code quality
- GitHub Actions for all builds
- MIDI export respects the actual chord sequence length after edits in the Harmonic Explorer
- Clarified guidance on using the audio thread for non-audio tasks
  - Sorry for the detail, but this was A LOT of work 🤣

## 1.0.1: December 27, 2025

- Bug fixes and performance improvements
- Improved chord voicing algorithms
- Better voice leading in harmonic explorer
- Enhanced harmonic progression suggestions
- Updated documentation and examples
- Implemented optional duration-aware models
- Implemented a unified harmonic model over all MIDI files in the corpus

## 1.0.0: December 11, 2025

- First public beta release
- AU only on Mac (Apple Silicon)
- Harmonic analysis and generation for fixed-length chords
- Multiple composers modeled with distinct harmonic styles
- Harmonic Explorer for building custom progressions
- Configurable 4-part harmony generation
- MIDI export capabilities
