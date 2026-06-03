---
title: "Release Notes"
description: "Latest updates and changelog for LucidHarmony."
---

# LucidHarmony: Release Notes

## 1.2.5: April 27, 2026

_Always improving the AI model, chord sequence editing, and a new lick of paint_

| Feature | Description |
| --- | --- |
| _AI Model improvements._ | We extract chords with more fidelity when non-chord tones (passing notes, suspensions, and so on) and present. |
| _Harmony editor_ | You can now drag chords around in the chord sequence, delete them, insert new ones, and use the Harmony Explorer to change chords. |
| _UI tweaks._ | We designed a different look and updated UI components to use it. |
| _Bug elves hard at work._ | We got a lot of feedback about bugs including things that were completely broken to minor typos. We believe we fixed everything except that annoying CLAP graphics issue, which prevents users from entering a license key. We just can't reproduce it! You have our profuse apologies. (You know who you are.)|

## 1.2.4: April 12, 2026 

_Enhanced harmonic richness tools & chord identification by harmonic role_

| Feature | Description |
|---------|-------------|
| _The **Richness** dial has been enhanced._ | Now you can specify which extended chords you want the richness bias to generate more of. |
| _We have added annotations to generated chords._ | The role of the chord and inversion in the scale is identified by color and descriptive tooltip. |
| _Harmonic extraction improvements._ | The way figured basses are extracted from the source MIDI has been improved. This lets us use more accurate harmonic modeling. The AI models have been retrained on the enhanced harmonic analysis. You can see the benefits in generated sequences because stepwise bass lines are significantly more fluid. |
| _Voice leading improvements._ | We built in more music theory about chord voicing. This means that the roles of notes in a chord are used more effectively in voice leading. |
| _Chord notation is more consistent._ | We devised a method of _chord aliasing_, which lets us use simpler chord names in four-part harmony. This makes the chord tape less cluttered. |
| _No automatic harmony generation._ | We removed the option to regenerate the sequence on DAW transport play. Now, all actions—like changing the starting chord—highlight the **Generate** button. It's always up to you when you want to create a new sequence. |

Known issues:
- There is a redraw bug in the CLAP version that prevents you entering your license key. Don't worry: Nothing stops working.

## 1.2.3: March 31, 2026

_Windows support & quality-of-life improvements_

- Added Windows support
- LucidHarmony no longer clears chords when you change settings
- 100 settings and chords in undo/redo history
- The single randomness setting has now been split out to 2 separate controls that let you increase likelihood of rarer chord combinations and the presence of extended chords independently
- Other small UX improvements

## 1.2.2: March 24, 2026

_Closed Beta Release_

- Windows support

## 1.2.1: March 17, 2026

_Fixed a bug preventing Ableton Live from loading the plugin_

- The plugin is now correctly signed and should load in all versions of Ableton Live

## 1.2.0: March 10, 2026

_Infinite mode & major/minor AI improvements_

- New "Infinite mode"
  - Just press play, sit back, and listen to an endless stream of harmony
  - Configured the same way you do with the generated sequences
  - You can stop and drag the entire sequence to a track at any time
- Better AI model support for major/minor modes
  - The model is trained to more faithfully follow mode harmonies
- Lots of bug fixes and improvements

## 1.1.0: February 26, 2026

_Improved chord generation_

- Top-to-bottom rewrite of how notes are generated from the AI model
- Replaced tons of special cases and logic with a more robust approach using extensive off-line music theory data
- We now use exactly the same music theory for both chord extraction and generation, so the code is only in one place
- As a consequence, harmonies are cleaner and rules consistent
- We hope you'll agree it's a big win for voicing leading

## 1.0.6: February 11, 2026

_License keys_

- License key registration and checking
- Custom remote API AWS stack for Gumroad license key registrations and checking
- Updated UI for license key, including a tiny nag, which will not stop the app from running

## 1.0.5: February 2, 2026

_Internal improvements_

- Internal refactoring to improve code quality
- Rework of build process to use GitHub Actions

## 1.0.4: January 14, 2026

_DAW citizenship improvements_

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
