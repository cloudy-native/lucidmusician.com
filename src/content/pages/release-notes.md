---
title: "Release Notes"
description: "Latest updates and changelog for the LucidHarmony MIDI plugin."
---

## Unreleased

- **Interface** — Panels, buttons, and menus share one corner radius and a quiet 1 px stroke. Section labels recede, and the two cards share a bottom edge. Create, Follow Me, and Generate sit under the generator card; drag and Hold notes sit under voicing, with the same gutter between them.
- **Generate** — Highlighted when the chord tape is empty, including the first time you open the plugin.
- **Harmonic Explorer** — Destinations cluster by root on the circle of fifths (tonic at 12 o'clock). Closer to the center is more likely. Hover to hear and expand inversions; click to commit. Diatonic filter (default), inversions collapsed/expanded, and Show more. Tape selection chooses add, replace, or insert. Labels are ASCII-only so they no longer show as `Â·`. Clusters stay off the hub; expanded inversion stacks stay on the map (top 5).
- **Tape delete** — After Delete/Backspace (or context-menu Delete), the chord to the left stays selected so you can delete several without clicking again. The first chord is still protected.
- **Ensemble** (Advanced voicing) — Choir (SATB), string quartet, brass, pad stack, boys choir, women (SSAA), or woodwind quartet. Changes the MIDI range of the four parts. Boys choir is treble SSAA (up to C6, bottom G3). Women (SSAA) sits lower (altos to D3). Woodwind is flute, oboe, clarinet, and bassoon. Open still controls spacing. Hidden on Intuitive. Multi-track MIDI names follow the ensemble.
- **Ornament types** — Suspension is on by default (left column). Passing, Neighbor, and Anticipation start off (right column). Most factory presets use Suspension only. Clean Baroque turns every type off. Dense Baroque enables all four.
- **Chord length** — Playback and MIDI drag keep every chord on the tape. Lengthening chords (for example 1 bar to 4) no longer stops at the Bars setting and leaves the rest of the tape behind. Bars only sets how long a new Generate is.

## 1.4.0: August 2026

_Follow Me, presets, and a faster path from empty track to harmony_

- **Follow Me** — Play a line on your keyboard (or a MIDI track); LucidHarmony commits four-part chords that fit those notes. Tables are precomputed so playback stays light.
- **Intuitive and Advanced** — Intuitive is the simple view (predictability, richness, length, four voicing knobs). **Advanced is the previous Generate tab**, unchanged: start chord, meter, extensions, and the detailed voicing sliders. Harmonic Explorer and About are still their own tabs.
- **Presets** — Factory and user presets store *style* (model, voicing, richness, Infinite). They do not overwrite your key, major/minor, note length, or start chord.
- **Infinite** — Toggle (or Bars at 33) streams new chords while you play. Generate still starts the stream.
- **Non-chord tones** in Create playback — ornaments you hear on the tape match export more closely. Follow Me live output is still chord tones; export after you play to hear NCTs.
- **MIDI drag vs Play** — After you drag MIDI onto a track, Play uses that DAW region (not LucidHarmony). The tape banner **MIDI is on a DAW track**; click it to audition LucidHarmony, click **Auditioning LucidHarmony** to go back to the DAW MIDI.
- **Bugs fixed**
  - Empty track + Play was muted by host all-notes-off / clock. Audition now mutes only on a real MIDI **note-on**. If you still see “Muted by track MIDI,” there is a note on that track — remove or mute the region.
  - After MIDI drag, Play no longer also drives LucidHarmony (double play / tape motion with the instrument muted).
  - Minor-key start chord (`i`) restores as `i`, not `I`.
  - Project save no longer keeps a stale sequence after a second save.
  - Chord-tape highlight clears after delete or replace.
  - Infinite append no longer retriggers notes that are already sounding.

macOS 1.4.0 is **Apple Silicon**, **macOS 13.3+**, formats **AU, VST3, and CLAP** (no AUv3). Intel Macs stay on 1.2.x.

## 1.3.0: June 19, 2026


_Complete rewrite of the AI training and inference & a new non-chord tones feature_

- **Transformer AI architecture** — We kept enhancements to harmonic analysis we made a month or two back, but rewrote the training and inference to use a transformer AI architecture instead of the legacy LSTM. We conducted double-blind tests and can show this is objectively more interesting and pleasing.
- **Non-chord tones** — We enhanced the voicing generator to let you configure non-chord tones in MIDI output. If you use suspension NCT with the Corelli AI model, for example, you might be surprised by how authentic it can feel. We hope you like it.
- **Relentless bug fixing** — We got valuable feedback from you all as always on missing features and broken things. Thanks especially to Frank for some truly outstanding bug reports and beta testing on Windows Reaper.

Known issues:
- In Reaper on Windows, pressing DAW transport with LucidHarmony in an instrument track can cause a crash. We are actively investigating. The solution is to drag MIDI from a dedicated instance of LucidHarmony in a separate track. Apologies for the inconvenience.

## 1.2.5: April 27, 2026

_Always improving the AI model, chord sequence editing, and a new lick of paint_

- **AI Model improvements** — We extract chords with more fidelity when non-chord tones (passing notes, suspensions, and so on) are present.
- **Harmony editor** — You can now drag chords around in the chord sequence, delete them, insert new ones, and use the Harmony Explorer to change chords.
- **UI tweaks** — We designed a different look and updated UI components to use it.
- **Bug elves hard at work** — We got a lot of feedback about bugs including things that were completely broken to minor typos. We believe we fixed everything except that annoying CLAP graphics issue, which prevents users from entering a license key. We just can't reproduce it! You have our profuse apologies. (You know who you are.)

## 1.2.4: April 12, 2026 

_Enhanced harmonic richness tools & chord identification by harmonic role_

- **The Richness dial has been enhanced** — Now you can specify which extended chords you want the richness bias to generate more of.
- **Chord annotations** — The role of the chord and inversion in the scale is identified by color and descriptive tooltip.
- **Harmonic extraction improvements** — The way figured basses are extracted from the source MIDI has been improved. This lets us use more accurate harmonic modeling. The AI models have been retrained on the enhanced harmonic analysis. You can see the benefits in generated sequences because stepwise bass lines are significantly more fluid.
- **Voice leading improvements** — We built in more music theory about chord voicing. This means that the roles of notes in a chord are used more effectively in voice leading.
- **Chord notation is more consistent** — We devised a method of chord aliasing, which lets us use simpler chord names in four-part harmony. This makes the chord tape less cluttered.
- **No automatic harmony generation** — We removed the option to regenerate the sequence on DAW transport play. Now, all actions — like changing the starting chord — highlight the Generate button. It's always up to you when you want to create a new sequence.

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
