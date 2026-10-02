---
title: "Documentation"
description: "Complete documentation for LucidHarmony, the AI-powered chord progression generator for ambient music and film scoring."
---


## Instant gratification

Empty instrument track. LucidHarmony in the MIDI FX slot (Logic Pro) or before the instrument in other DAWs. **No existing MIDI in track** because LucidHarmony won't override what's already playing. The plugin defaults are fine: Bach, key of C.

1. Click **Generate**.
2. Press **Play**.

You should hear four-part harmony on your instrument. If you see **Muted by track MIDI**, a MIDI **note-on** is on that track — mute or remove the region, or don’t play the keyboard until you want Follow Me. Host clock and all-notes-off do not mute.

![Generate then play](/images/instant-gratification.png)

*Plugin Defaults.*

### A more flexible workflow is easy

Drag MIDI onto a DAW track. Play then uses **that DAW region**, not LucidHarmony. 

:::tip
The tape banner reads **MIDI is on a DAW track**. Click the banner to **audition LucidHarmony** again; click **Auditioning LucidHarmony** to go back to the DAW MIDI. Generate does not switch this.
:::

Typical setup: keep LucidHarmony on one track to generate; drag MIDI onto a **second** instrument track. Mute the LucidHarmony track’s instrument if you only want the exported region.

Then wander. The rest of this page is for when you get curious.

---

**LucidHarmony** is an AI-powered chord progression generator and harmonic editor for your DAW. Each model is a transformer trained on harmonic analysis of one composer — Bach, Beethoven, Palestrina, Monteverdi, Corelli, or the Trecento — and it returns a progression immediately.

### LucidHarmony is for _all_ kinds of music

While our AI models are trained on historical master composers, these foundational harmonic principles underpin all modern music — from contemporary pop and ambient to cinematic and experimental genres. LucidHarmony lets you dial in exactly how adventurous you want to be, with controls to embrace modern, unexpected harmonies and extended chords like 7ths, 9ths, and sus chords. Start with timeless foundations, then push into uncharted territory.

---

## Why LucidHarmony?

Depending on your instrument, your first chord sequence with the default settings may sound like a choir. That's no accident, because a lot of the foundation for modern music is from the choral works of Bach and other masters. We understand if you're skeptical at first, but we encourage you to give it a try.

Then start to generate sequences with longer chords that let lush pads play out. Suddenly you're writing the foundation for ambient soundscapes.

### Platform Availability

Available for **Mac** (Apple Silicon, macOS 13.3+; Intel remains on v1.2.x), **Windows** (x64, installer or ZIP), and **Linux** (64-bit). Formats: **AU, VST3, and CLAP**. There is no AUv3 build.

### Tested DAWs

Works with any DAW that supports VST3, AU, or CLAP. Tested with Logic Pro, Ableton Live, and Reaper.

If you find a DAW that doesn't work, please [submit a support ticket](https://lucidmusician.zohodesk.com/portal/en/newticket).

---

## Controls Overview

Here is your quick start and highlights of the controls. More details as we go along.

![Intuitive tab](/images/ui-intuitive-tab.png)

*The Intuitive Tab.*

![Preset bar](/images/ui-presets.png)

*UI Preset Bar.*

LucidHarmony's interface has four tabs: **Intuitive**, **Advanced**, **Harmonic Explorer**, and **About**. **Create** vs **Follow Me** is the mode switcher on the generator. Presets sit above the tabs.

- **Intuitive** — Predictability, richness, Bars, and four voicing knobs: **Smooth**, **Open**, **Centered**, and **Ornaments**. Start chord, meter, chord length, extension toggles, Ensemble, and ornament type filters are hidden here. Ensemble stays Choir (SATB).
- **Advanced** — Full generator (key, start chord, model, meter, chord length, bars, Infinite, 7ths/9ths) plus Ensemble, the separate voicing dials, **Ornaments**, and type toggles. Suspension is on by default; Passing, Neighbor, and Anticipation start off.

![Advanced tab](/images/ui-advanced-tab.png)

*The Advanced Tab.*

### AI Generator Section

**Key** — Tonal center. The menu is C, C#/Db, D, D#/Eb, E, F, F#/Gb, G, G#/Ab, A, A#/Bb, and B, each in Major or Minor.

**Start Chord** — First chord of a new Generate, in two dropdowns. The Roman numeral list always includes both I–VII and i–vii. The Variant dropdown lists the inversions and extensions that model knows (root position, 1st inversion, 7th, maj7, dim, aug, sus4, add9, and others in its vocabulary).

**AI Model** — Bach, Beethoven, Palestrina, Monteverdi, Corelli, or Trecento. Each has a distinct harmonic dialect, described in Getting Started.

**Meter & Chord length** — Meter sets the time signature of the generated MIDI. Options: 4/4, 3/4, 2/4, 6/8, 12/8, 5/4, 7/8. Chord length is how many bars each chord on the tape lasts. Options: 1/8, 1/4, 1/2, 1, 2, 4, 8, 16. Shorter values for fast-moving progressions, longer values for ambient pads. Playback and MIDI drag include every chord at that length. Lengthening the chords makes a longer file; it does not drop chords to stay inside Bars.

**Predictability** — Red dial controlling how familiar or surprising the progressions feel. Five levels: Very Familiar, Familiar, Balanced, Surprising, Very Surprising.

**Richness** — Red dial controlling chord extensions. Five levels: Simple, Some Color, Colorful, Rich, Very Rich. Higher levels bias 7ths, 9ths, and other extended chords. Two toggles, **7ths** and **9ths**, sit next to the dial. When Richness is above Simple, only a checked family is favored. Unchecked is off. At Simple the toggles do nothing.

**Bars** — How many bars a new Generate fills. Changing Bars, or the chord length, does not remove chords already on the tape.

**Infinite Mode** — Toggle (or Bars at 33) for continuous streaming. Generate still starts the stream; press play in the DAW to hear it.

![Infinite mode](/images/ui-infinite.png)

*Infinite mode*

**Generate Button** — Click to create a new chord progression based on your settings. Highlighted when the chord tape is empty, including the first time you open the plugin, or when settings have changed since the last generation. You can click this as many times as you want.

**Undo/Redo** — Step backward or forward through your generation history.

### MIDI Export

**Drag MIDI** — Drag this to export every chord on the tape, all four voices on a single MIDI track. Each chord lasts the current chord length. Useful for choir, pad, or piano sounds. Disabled in Follow Me.

**Drag Multi** — Drag this to export each voice on a separate MIDI track. Same chords and lengths as Drag MIDI. Useful when each part gets its own instrument. Disabled in Follow Me.

**MIDI Metadata:** Exported MIDI files include chord symbol text markers (MIDI meta event type 6) and cue points (type 7) at each chord change. These appear as markers in DAWs that support MIDI meta events, making it easy to see chord names in your arrangement.

### Voicing Section

Intuitive and Advanced share one voicing. Switching tabs does not change the sound. The full list is in [Voicing Controls](#voicing-controls).

**Intuitive**

**Smooth** — How connected the four parts feel. One knob sets Avoid Parallel, Contrary Motion, Stepwise Motion, and Keep tones to the same value. If those differ on Advanced, Smooth shows their average.

**Open** — Tight stacked chords versus wide spacing. Same control as Open Chords.

**Centered** — How strongly each part stays in the middle of its range. Same control as Center Voices.

**Ornaments** — Density of non-chord tones between chords. Same control as Advanced. Type filters live on Advanced. Default is 0% (none).

**Advanced**

**Ensemble** — Instrument ranges for the four parts: Choir (SATB), string quartet, brass, pad stack, boys choir, women (SSAA), or woodwind quartet. Open Chords is still spacing inside those ranges. Hidden on Intuitive (Choir SATB). Multi-track MIDI drag uses matching part names (Soprano…Bass, Violin I…Cello, Treble I…Alto II, Flute…Bassoon, and so on).

**Avoid Parallel** — Reduces parallel fifths and octaves between voices.

**Contrary Motion** — Rewards outer voices moving in opposite directions.

**Stepwise Motion** — Prefers smaller leaps between successive chords.

**Open Chords** — Preferred spacing of the four voices. Higher values favor wider, more open voicings.

**Keep tones** — Rewards keeping a shared chord tone in the same voice across a change. Voice leading only. It does not sustain the MIDI note. That is Hold notes.

**Center Voices** — Keeps each part nearer the middle of its Ensemble range.

**Ornaments** — 0% is none (the default). Mid values match the density in the training corpus. Higher doubles ornaments. Only checked types are inserted. Suspension starts on; Passing, Neighbor, and Anticipation start off. Unchecked is off. The toggles are inactive while Ornaments is zero. Suspension is the left column; the other three stack on the right.

**Hold notes** — Sits under the voicing card, with the MIDI drag buttons. On by default. When a pitch continues into the next chord, the MIDI note sustains in playback and in export. Independent of Keep tones.

**Reset voicing** — Restores the defaults: Ensemble to Choir (SATB), the voice-leading dials to 50%, Ornaments to 0%, Suspension as the only ornament type, and Hold notes on.

### Utility Controls

**Clear tape** — Clears the chord tape. In Create, the tape is reseeded with your Start Chord when one is set. In Follow Me, it also clears the follow context so you can start a new phrase.

**Chord Tape** — Generated chords appear here. Click to select, right-click to edit, drag to rearrange. On an empty track, Play auditions from LucidHarmony. After you drag MIDI out, Play uses the DAW region until you click the tape banner to toggle. See [Chord Tape Editing](#chord-tape-editing) and [After you drag MIDI onto a track](#after-you-drag-midi-onto-a-track).

---

## Installation

### System Requirements

**macOS** requires **13.3** or later and **Apple Silicon**. Intel Mac users stay on **v1.2.x**. Formats: AU, VST3, CLAP.

**Windows** requires Windows 10 or later (64-bit) with a VST3- or CLAP-compatible DAW.

**Linux** requires a 64-bit distribution with Intel or AMD processor and a VST3- or CLAP-compatible DAW.

### Download

Visit [lucidmusician.com](https://lucidmusician.com) and click the Gumroad link to download the latest version for your platform. You will get an email with download details and can download as many times as needed. No installation limits — install on multiple computers.

### Installation Steps

**macOS**

1. Download the `.pkg` file for macOS
2. Run the installer — double-click the downloaded package
3. Follow the installation wizard — plugins install automatically to:
   - AU: `/Library/Audio/Plug-Ins/Components/`
   - VST3: `/Library/Audio/Plug-Ins/VST3/`
   - CLAP: `/Library/Audio/Plug-Ins/CLAP/`
4. Rescan plugins in your DAW:
   - **Logic Pro**: Preferences → Plug-in Manager → Reset & Rescan
   - **Ableton Live**: Preferences → Plug-ins → Rescan
   - **Reaper**: Preferences → Plug-ins → VST → Re-scan

**Windows**

**Option 1: EXE Installer (Recommended)**

1. Download the `.exe` installer for Windows
2. Run the installer — double-click the downloaded file
3. Choose installation location (default recommended):
   - VST3: `C:\Program Files\Common Files\VST3\`
   - CLAP: `C:\Program Files\Common Files\CLAP\`
4. Rescan plugins in your DAW:
   - **FL Studio**: Options → Manage Plugins → Find Plugins
   - **Cubase**: Studio → VST Plug-in Manager → Update Plug-in Information
   - **Reaper**: Preferences → Plug-ins → VST → Re-scan

**Option 2: ZIP Archive (Portable)**

1. Download the `.zip` file for Windows
2. Extract the archive to a temporary location
3. Copy the plugin files to your VST3 directory:
   - **CLAP**: Copy the `CLAP` folder contents to `C:\Program Files\Common Files\CLAP\`
   - **VST3**: Copy the `VST3\LucidHarmony.vst3` folder to `C:\Program Files\Common Files\VST3\`
4. Rescan plugins in your DAW (same as above)

**Linux**

1. Download the `.tar.gz` file for Linux
2. Extract the archive to a temporary directory
3. Copy plugin files to your plugin directories:
   - VST3: `~/.vst3/`
   - CLAP: `~/.clap/`
4. Rescan plugins in your DAW:
   - **Ardour**: Preferences → Plug-ins → Rescan
   - **Reaper**: Preferences → Plug-ins → VST → Re-scan

### Licensing

LucidHarmony uses a simple, hassle-free licensing system. The full price is $20 (currently 50% off at $10) with a 30-day money-back guarantee. You'll get your license key when you download — just enter it in the plugin interface. **If you don't enter a license key, the plugin will show a friendly nag, but we will never block or disable any features or functionality.** You can install as many times as you like without restriction.

Works offline once installed. The plugin may check the license when it starts; that never blocks features.

---

## Setting Up the Plugin

LucidHarmony is a **MIDI FX plugin** that generates MIDI data only — it does not produce audio directly. You need to route the generated MIDI to a software instrument (synth, piano, strings, etc.) to hear sound.

### Logic Pro

Logic Pro makes this easy by allowing both MIDI FX and instruments on the same track.

1. Create a new Software Instrument track
2. Add your desired instrument (e.g., Alchemy, ES2, or any third-party synth)
3. In the MIDI FX slot (above the instrument), add LucidHarmony
4. LucidHarmony will now generate MIDI that flows directly into your instrument

![Logic Pro MIDI FX setup](/images/setup-logic-pro.png)

*Using LucidHarmony and an instrument in the same track*

**Why this works:** Logic Pro's track architecture allows MIDI FX to sit in the signal chain before the instrument, so the generated MIDI automatically routes to the instrument below it.

:::info
If you're using LucidHarmony as a MIDI FX on a track with an instrument, don't drag MIDI to that same track. Having two MIDI sources (LucidHarmony generating + dragged MIDI clips) on one track creates conflicts. LucidHarmony will warn you if it detects this. **Best practice:** Keep LucidHarmony on a track without an instrument assigned, then drag MIDI to a separate dedicated instrument track. Like this.
:::

![Logic Pro separate tracks](/images/logic-separate-tracks.png)

So a better alternative (a favorite of many users) is to assign LucidHarmony to a track _without_ an instrument and drag MIDI to your instrument track. Dragging MIDI feels instant in LucidHarmony, even with 100+ AI-generated chords because LucidHarmony takes < 1ms to generate the next chord. We worked super hard on that.

### Ableton Live

Ableton Live uses a routing approach with separate MIDI and instrument tracks.

1. Create a new MIDI track for LucidHarmony
2. Add LucidHarmony to the MIDI track (it will appear in the device chain)
3. Create a second MIDI track for your instrument
4. Add your desired instrument to the second track (e.g., Wavetable, Analog, or any plugin)
5. On the LucidHarmony track, set **MIDI To** to the instrument track
6. Set the instrument track's **Monitor** to "In"
7. Arm the LucidHarmony track for recording

![Ableton Live MIDI routing setup](/images/ableton-setup.png)

**Why this works:** Ableton's routing system sends MIDI from one track to another. The LucidHarmony track generates MIDI and routes it to the instrument track, which produces the audio.

### Reaper

Reaper offers flexible routing similar to Ableton but with its own approach.

1. Create a new track for LucidHarmony
2. Add LucidHarmony as a VST instrument (even though it's MIDI-only)
3. Create a second track for your instrument
4. Add your desired instrument to the second track
5. On the LucidHarmony track, click the **Route** button
6. Add a send to the instrument track
7. Set the send to **MIDI** (not audio)
8. On the instrument track, set **Record: input (MIDI)** to receive from the LucidHarmony track

![Reaper MIDI routing setup](/images/reaper-setup.png)

**Why this works:** Reaper's routing matrix lets you send MIDI from any track to any other track. The LucidHarmony track sends MIDI to the instrument track, which renders the audio.

### Quick Tips for All DAWs

- **Use the right instrument:** LucidHarmony generates 4-part harmony, so choir, pad, piano, and string sounds work particularly well
- **Monitor settings:** Make sure your instrument track is set to monitor input so you hear the MIDI as it's generated
- **Recording:** You can record the MIDI output from LucidHarmony directly into your DAW for further editing
- **Multiple instances:** You can run multiple instances of LucidHarmony, each feeding different instruments for layered textures

---

## Getting Started: Your First Chord Progression

LucidHarmony's AI does the heavy lifting — you just need to set a few simple parameters and click Generate. No music theory knowledge required.

:::note
We'll show the _Intuitive_ tab to get you started. Change to _Advanced_ to see all available options.
:::

### Step 1: Set Your Key

![Click Generate](/images/set-key.png)

The key determines the tonal center of your progression. Start with something familiar:

- **Key**: Choose a key (C, C#/Db, D, D#/Eb, and so on) and Major or Minor
- **Start Chord** (Advanced tab): Where a new Generate begins. The Roman numeral menu always lists I–VII and i–vii. The Variant menu lists inversions and extensions that model knows. Different models know different chord types.

**Why this matters:** The key ensures all generated chords work together harmonically. You can't go wrong — any key will produce musical results. But it won't be the key you're looking for. 

:::note
If the progression is in the wrong key, choose another key. The same Roman numerals are voiced again in the new key. Changing Major or Minor also keeps those numerals and revoices them. It does not write a new progression. Click Generate when you want the model to choose chords for the new mode.
:::

### Step 2: Configure Generation Settings

![Click Generate](/images/generation-settings.png)

- **AI Model**: Select from our collection of harmonic models trained on master composers
  - **Bach**: Four-part harmony with strong voice leading and functional progressions. Structured progressions with a clear tonal direction
  - **Beethoven**: Classical and early Romantic harmony. Bold contrasts, dramatic modulations, and motivic development
  - **Palestrina**: Smooth modal counterpoint with gentle dissonance and flowing lines. Serene progressions with a modal flavor
  - **Monteverdi**: Expressive chromaticism and dramatic shifts between major and minor
  - **Corelli**: Clear tonal progressions with elegant sequences and refined cadences
  - **Trecento**: Medieval sonorities with parallel motion and archaic cadences
- **Meter** (Advanced tab): Time signature for the generated MIDI (default 4/4). Options: 4/4, 3/4, 2/4, 6/8, 12/8, 5/4, and 7/8.
- **Chord length** (Advanced tab): How many bars each chord lasts (1/8, 1/4, 1/2, 1, 2, 4, 8, 16). Try 1 bar at 120 BPM for quicker changes, or 4–8 bars for ambient at 80 BPM.
- **Predictability**: Controls how surprising or familiar the progression feels
  - Very Familiar: Safe, expected chord movements
  - Familiar: Mostly expected with occasional interest
  - Balanced: Mix of familiar and interesting (recommended for first use)
  - Surprising: Adventurous, less predictable progressions
  - Very Surprising: Highly adventurous, unexpected progressions
- Harmonic **Richness**: Controls chord complexity
  - Simple: Basic triads only
  - Some Color: Occasional extensions
  - Colorful: Some common extension
  - Rich: Frequent extended harmonies
  - Very Rich: Complex, densely extended chords

  In the advanced tab, you can control which common extended chords you want to include with the toggles. Higher richness settings bias the selected extended chords.

- **Bars**: Start with 8 bars (you can always generate more later), or jump straight to infinite mode for endless chords.

:::note
Infinite is Bars at 33. Generate starts the stream, and the tape keeps extending while the DAW plays. A MIDI drag exports the chords on the tape at that moment.
:::

:::tip
Start with Balanced **predictability** and Colorful **richness**. You can always regenerate with different settings as many times as you like.
:::

### Step 3: Generate Your First Progression

Click the **Generate** button and watch the magic happen!

![Click Generate](/images/click-generate.png)

**What you'll see:** Chord names in Roman numeral notation (I, IV, V, etc.), chord symbols in your chosen key (C, F, G, etc.), and a visual representation of the progression.

**Don't like it?** Click Generate again! Each click produces a completely new progression. The AI picks randomly from likely next chords in the selected model. Our custom _transformer_ AI model always picks from a pool of likely next chords, so each generation is fresh and unpredictable.

### Step 4: Listen to Your Progression

Press **Play** in your DAW (there is no separate plugin transport). On an empty instrument track, LucidHarmony sends the four-part MIDI and the tape follows the playhead. You’ll hear voice-led SATB on whatever instrument is on that track.

If the tape says **Muted by track MIDI**, a note-on is arriving on the track — mute/remove the region or stop playing the keyboard.

### Step 5: Export to Your Instrument Track

Drag MIDI into the arrangement (usually a **second** instrument track):

1. **Drag MIDI**: All 4 voices on one track — useful for:
   - Choir sounds
   - Pad synths
   - Piano
   - String sections

![Drag single MIDI](/images/drag-single-midi.png)

2. **Drag Multi**: Each voice on a separate track — useful for:
   - Independent instrument assignments
   - Bass + melody + harmony splits
   - Advanced mixing and processing

![Drag multi MIDI](/images/drag-multi-midi.png)

:::tip
The exported MIDI includes chord symbol markers at each chord change, visible as text markers in DAWs that support them.
:::

After a successful drag, Play uses the **DAW region**. The tape banner **MIDI is on a DAW track** — click it to audition LucidHarmony again, click again to return to the DAW MIDI. See [After you drag MIDI onto a track](#after-you-drag-midi-onto-a-track).

---

## Follow Me

Follow Me is a feature added in version 1.4 that listens to notes you play and appends chords to the tape that fit those pitches, using the current key, model, and start chord.

Play a monophonic line; each note-on selects a chord using advanced, efficient prediction (no audio dropouts). The chord tape fills as you play. Live Follow output is chord tones only. While Follow Me is on, Generate reads **Listening...** and does not run, and **Drag MIDI** and **Drag Multi** are off. Switch back to Create to audition the tape with ornaments, or to drag the MIDI.

![Follow Me](/images/ui-follow-me.png)

*Follow me mode*

Here, an ascending scale of C major was played and the chord tape filled automatically. Ornaments were raised, then Create was selected and the MIDI was dragged. The export shows a suspension. Follow Me's live output stays chord tones.

## Presets

Factory and user presets capture generator and voicing style (model, predictability, richness, voicing, ornaments, Infinite, and bars). They do **not** overwrite your session key, major/minor, chord length, or start chord. Factory examples include Infinite Ambient and **Modal Drift** (Monteverdi, more open and wandering).

![Presets](/images/ui-presets.png)

*Factory and user presets*

## Infinite Mode

Infinite Mode is designed for creating very long MIDI sequences — perfect for ambient music, evolving soundscapes, or background harmony that plays while you work on other parts of your track. With low BPM and long notes, you can create sequences up to 30 minutes: Ideal for ambient.

### How It Works

When you enable **Infinite Mode**, LucidHarmony generates very long evolving chord progressions. You can use it in two ways:

**1. Generate Long Sequences**  
Click Generate with Infinite Mode enabled to create extended progressions. Each generation recreates the entire sequence with fresh harmonic content. Don't worry about regenerating multiple times — LucidHarmony's custom AI is extremely fast: creating 100 chords takes about 1/10th of a second.

**2. Live Background Harmony**  
Add LucidHarmony to an instrument track, enable Infinite, click Generate, then press play. It streams new chords while you work. Leave the track free of MIDI note-ons if you want to hear LucidHarmony's own output.

### Best Use Cases

- **Ambient pads** with long, sustained chords (try 4-8 bar note lengths)
- **Evolving soundscapes** that change gradually over time
- **Background harmony** that plays while you focus on melody or rhythm
- **Exploration and discovery**—let it run and capture interesting moments

**Pro tip:** Infinite Mode works beautifully with high Keep tones and Stepwise Motion for smooth, meditative progressions. Or go the opposite direction with low Keep tones and high Contrary Motion for more adventurous, shifting harmonies. Turn Ornaments up if you want passing tones and suspensions in the stream.

---

## Undo/Redo

LucidHarmony maintains a complete history of up to **100 undo steps**, saving both your chord progressions and all configuration settings. This means you can freely experiment with different generations, voicing parameters, and settings — then step backward through your entire creative process.

**How to use:**
- **Undo**: Cmd+Z (Mac) / Ctrl+Z (Windows and Linux), or click Undo. The plugin help shows the shortcut for your OS.
- **Redo**: Cmd+Shift+Z (Mac) / Ctrl+Shift+Z or Ctrl+Y (Windows and Linux), or click Redo.

Each undo step captures everything: the generated chords, key, AI model, predictability, richness, voicing settings, and more. You can compare different generations side-by-side by undoing and redoing, or recover a progression you accidentally regenerated over.

**Pro tip:** Generate 5-10 progressions in a row, then use undo to step back through them and pick your favorite. It's faster than trying to remember which one you liked best.

---

## Understanding the Interface

### Main Tabs

LucidHarmony has four tabs: **Intuitive** (simple generator + voicing), **Advanced** (full controls including start chord), **Harmonic Explorer** (next-chord map on the circle of fifths), and **About** (version and license). Switch **Create** vs **Follow Me** on the generator; they are not separate tabs.

### The Two-Stage Workflow

LucidHarmony separates **generation** from **voicing**—a powerful approach that gives you maximum control:

**Stage 1: Generate the Progression** — Focus on harmonic content (which chords, in what order). The AI handles music theory and progression logic. Experiment freely — generation is instant.

**Stage 2: Voice the Chords** — Transform the same progression into different textures. Adjust voice leading, spacing, and range. One progression, infinite sonic possibilities.

**Why this matters:** You can find the perfect chord progression, then voice it 10 different ways for different sections of your track. Or use the same voicing settings across multiple progressions for consistency.

### Harmonic Function Color Legend

The chord display uses color-coding to indicate each chord's harmonic function:

- 🔵 **Tonic (blue)**: Stable, restful chords — I, vi, iii
- 🟣 **Predominant (purple)**: Approach chords that build momentum — ii, IV, ♭VII
- 🔴 **Dominant (amber-red)**: Tension chords that resolve to tonic — V, vii°

This color scheme helps you visually identify the harmonic rhythm and tension-resolution patterns in your progressions at a glance. Hover over the colored dots in the legend bar for tooltips.

The color saturation reflects chord complexity: simple triads appear more muted, while extended chords (7ths, 9ths, augmented 6ths) appear more vivid. Borrowed or chromatic chords have a slightly different lightness to help them stand out.

![Harmonic Function Legend](/images/harmonic-function.png)

### Rich Chord Tooltips

Hover over any chord in the tape to see detailed information:

- **Harmonic role**: Tonic, Predominant, Dominant, or Chromatic
- **Modifier tags**: Secondary, borrowed, chromatic, augmented 6th, seventh, ninth, Neapolitan
- **Contextual description**: How the chord relates to its neighbors (e.g., "Classic dominant to tonic resolution")

These tooltips help you understand the harmonic function of each chord without needing to know music theory. They also appear in the Harmonic Explorer when hovering over a destination.

### Hover Help

LucidHarmony includes a contextual help panel that displays information about any control you hover over. Move your mouse over any knob, slider, button, or dropdown to see a brief description of what it does. This is a quick way to learn the interface without leaving the plugin.

---

## Music Theory Primer

You don't need to know music theory to use LucidHarmony. The plugin can take on a lot of that work. A few terms still help, and this section explains the ones you will see.

### Keys and Modes

A **key** is the tonal home base of your music. It determines which notes and chords sound settled together. LucidHarmony supports all 12 keys. The menu shows C, C#/Db, D, D#/Eb, E, F, F#/Gb, G, G#/Ab, A, A#/Bb, and B, each in two **modes**:

- **Major**: Bright, happy, resolved. Think of the sound of a simple C-E-G chord.
- **Minor**: Darker, more emotional, sometimes melancholy. Think of A-C-E.

The key and mode together define the palette of chords the AI draws from. Changing the key transposes everything but keeps the same harmonic relationships. Changing the mode transforms the character entirely.

### Roman Numeral Notation

LucidHarmony displays chords as **Roman numerals** (I, ii, V, etc.) rather than note names (C, Dm, G). This is standard music theory notation that describes a chord's role in the key, not its absolute pitch.

- **I** (Tonic) — Home base, stability. Example in C Major: C major
- **ii** (Supertonic) — Gentle motion, leads to V. Example in C Major: D minor
- **iii** (Mediant) — Soft color, related to I. Example in C Major: E minor
- **IV** (Subdominant) — Warmth, approach chord. Example in C Major: F major
- **V** (Dominant) — Tension, wants to resolve to I. Example in C Major: G major
- **vi** (Submediant) — Emotional, relative minor. Example in C Major: A minor
- **vii°** (Leading tone) — Strong pull toward I. Example in C Major: B diminished

Uppercase numerals (I, IV, V) indicate major chords. Lowercase (ii, iii, vi) indicate minor chords. This is why the same progression (say, I-IV-V-I) works in any key: the relationships stay the same.

### Inversions and Extensions

Chords can be rearranged and extended:

- **Inversions** change which note is in the bass. A "I6" chord puts the third in the bass instead of the root, creating a lighter sound. "I64" puts the fifth in the bass.
- **Seventh chords** (V7, ii7) add a fourth note for richer color. These are the "7ths" toggle in the Richness section.
- **Ninth chords** add a fifth note for even more complexity.
- **Augmented sixth chords** (It6, Fr6, Ger6) are chromatic chords with a distinctive, intense sound used to approach cadences.

The **Variant** dropdown in the Start Chord selector shows all the inversions and extensions available for each Roman numeral in the current model's vocabulary.

### Harmonic Function

Every chord serves a role in the harmonic story. LucidHarmony groups chords into three main functions, shown by color in the chord tape:

- **Tonic (blue)**: Rest and resolution. The "home" chords (I, vi, iii). Music feels settled here.
- **Predominant (purple)**: Momentum and approach. These chords (ii, IV) build energy and lead toward tension.
- **Dominant (amber-red)**: Tension and expectation. These chords (V, vii°) create a strong pull back to tonic.

A typical harmonic phrase moves: Tonic → Predominant → Dominant → Tonic. This tension-and-release cycle is the engine of Western harmony, and it's what makes generated progressions feel musical rather than random.

### Voice Leading

**Voice leading** is the art of moving individual notes smoothly from one chord to the next. Instead of jumping all four notes to new positions at each chord change, good voice leading keeps common tones, moves by small steps, and avoids awkward parallel motion.

LucidHarmony writes four voices and applies voice-leading rules to connect them. On Advanced, Avoid Parallel, Contrary Motion, Stepwise Motion, Open Chords, Keep tones, and Center Voices set those rules. Ornaments adds notes between the chords. Ensemble chooses each part's range. The same progression can sound completely different with different settings.

### Cadences

A **cadence** is a harmonic punctuation mark at the end of a phrase. The most common types:

- **Perfect cadence** (V → I): The strongest ending, like a period at the end of a sentence.
- **Plagal cadence** (IV → I): The "Amen" cadence, softer and more hymn-like.
- **Half cadence** (* → V): An open ending, like a comma. The phrase pauses but doesn't resolve.
- **Deceptive cadence** (V → vi): A surprise twist where the expected resolution is replaced.

You'll hear these naturally in LucidHarmony's output. The AI has learned cadential patterns from the training data, so phrases tend to end with satisfying harmonic resolutions.

---

## How the AI Works

:::note
You don't need these details to use the plugin. They explain how the model produces harmony, and how the controls change the result.
:::

LucidHarmony's AI is not a generic large language model like ChatGPT: It is specialized to the language of harmony. Each composer model is a purpose-built neural network trained exclusively on harmonic analysis data from that composer's works.

### Training Data

Each model is trained on chord progressions extracted from real compositions using computational musicology tools. The training data is Roman numeral analysis, not audio or MIDI. This means the AI learns harmonic relationships and tendencies, not melodies or rhythms.

- **Bach** — 371 chorale harmonizations (Riemenschneider collection) *(342 chord types)*
- **Beethoven** — Classical and early Romantic harmony *(696 chord types)*
- **Palestrina** — Sacred vocal works and masses *(717 chord types)*
- **Monteverdi** — Madrigals and early opera *(155 chord types)*
- **Corelli** — Trio sonatas and concerti grossi *(273 chord types)*
- **Trecento** — 14th-century Italian secular music (Landini and others) *(605 chord types)*

Those counts are the chord types in each shipped model. Palestrina has the largest vocabulary. Monteverdi has the smallest.

### The Neural Network

Each model is a _transformer_ neural network that predicts the next chord given the preceding context. The architecture:

1. **Input**: The current chord is converted to a numerical token
2. **Embedding**: The token is mapped to a learned vector representation that captures harmonic meaning
3. **Attention**: The transformer looks across the chords already chosen, so the next chord can depend on the whole phrase
4. **Output**: A probability distribution over all possible next chords

When you click Generate, the model runs this prediction loop repeatedly: pick a chord, feed it back in, predict the next one, and so on. The Predictability dial controls how the model samples from its probability distribution. Lower values pick the most likely chords; higher values allow more surprising choices.

### Two-Stage Pipeline

LucidHarmony separates chord generation from voicing into two independent stages:

**Stage 1: Chord Generation** — The AI model produces a sequence of Roman numeral tokens (e.g., I → IV → V → I). This is purely about harmonic content: which chords, in what order. The model has no concept of pitch, register, or voice assignment.

**Stage 2: Voice Leading** — A separate algorithm takes the Roman numeral sequence and realizes it as four MIDI parts. Default ranges are choir SATB; Advanced **Ensemble** can switch to string quartet, brass, a high pad stack, boys choir, women SSAA, or woodwind quartet. The voicing dials control how the parts connect; Ensemble only changes which MIDI window each part uses.

This separation is what makes LucidHarmony flexible. You can generate one progression and voice it many different ways, or use the same voicing settings across different progressions for consistency.

### The Richness and Predictability Controls

These two dials shape the AI's output in complementary ways:

**Predictability** controls the sampling temperature. At "Very Familiar," the model almost always picks its top prediction, producing conventional progressions. At "Very Surprising," it samples more broadly from the probability distribution, allowing rare and unexpected chords.

**Richness** biases the model toward or away from extended chords. At "Simple," the model favors basic triads. At "Very Rich," it boosts the probability of seventh chords, ninth chords, and other extensions. Two toggles, **7ths** and **9ths**, choose which of those families to favor when Richness is above Simple.

Together, these controls let you navigate a space from "simple and predictable" (hymn-like) to "complex and surprising" (jazz-influenced or experimental).

---

## Voicing Controls

Voicing transforms the feel of the harmony. You can tweak voicing heuristics independently to dial in more (or less) traditional music theory.

![Adjust Voicing](/images/adjust-voicing.png)

### Intuitive knobs

These four knobs are the same parameters as Advanced. They do not store a separate voicing.

- **Smooth** — Sets Avoid Parallel, Contrary Motion, Stepwise Motion, and Keep tones to one value. Higher is more connected: smaller steps, contrary outer voices, kept common tones, fewer parallel fifths and octaves. If you set those four differently on Advanced, Smooth shows their average. Default 50%.
- **Open** — Open Chords. Tight stacks versus wide spacing. Default 50%.
- **Centered** — Center Voices. How strongly each part stays in the middle of its range. Default 50%.
- **Ornaments** — Same density control as Advanced. Type filters stay on Advanced. Default 0%.

### Advanced parameters

- **Ensemble** — Choir (SATB), string quartet, brass, pad stack, boys choir, women (SSAA), or woodwind quartet. Sets the MIDI range of each part. Open Chords is still spacing inside that range. Hidden on Intuitive. Boys choir is treble only (Treble I–Alto II, up to C6, bottom G3). Women (SSAA) is the adult treble choir (Soprano I–Alto II), lower than the boys: altos reach D3. Woodwind is flute, oboe, clarinet, and bassoon (concert pitch); the flute reaches A6 and the bassoon reaches Bb1. Multi-track names follow the parts: Soprano…Bass, Violin I…Cello, Trumpet…Tuba, High…Low, Treble I…Alto II, Soprano I…Alto II, Flute…Bassoon.
- **Avoid Parallel** — Reduces parallel fifths and octaves between voices. *(80-95% for strict classical style)*
- **Contrary Motion** — Rewards outer voices moving in opposite directions. *(60-80% for independent parts)*
- **Stepwise Motion** — Prefers small intervals (seconds and thirds) over large leaps. *(80-100% for very smooth voice leading)*
- **Open Chords** — Spacing of the four voices. Higher values favor wider, more open voicings. *(70-100% for a wide texture; 10-30% for tight voicings)*
- **Keep tones** — Rewards keeping a shared chord tone in the same voice. Voice leading only; it does not hold the MIDI note. *(70-90% for a connected line)*
- **Center Voices** — Keeps each part nearer the middle of its Ensemble range. *(60-80% for a balanced range)*

### Ornaments

**Ornaments** is the density of non-chord tones between chord changes: passing tones, neighbors, suspensions, and anticipations. The dial is on both tabs.

| Setting | What you get |
|---------|----------------|
| **0%** (default) | No ornaments |
| **Around 50%** | About the density in the training corpus |
| **Toward 100%** | Up to twice that density |

**Type toggles** (Advanced only). Only checked types are inserted. Unchecked is off. The toggles do nothing while Ornaments is 0%.

| Toggle | Default | Where it sits |
|--------|---------|----------------|
| **Suspension** | On | Left column |
| **Passing** | Off | Right column |
| **Neighbor** | Off | Right column |
| **Anticipation** | Off | Right column |

Most factory presets leave Suspension on and the other types off. Clean Baroque turns every type off. Dense Baroque enables all four. Reset voicing returns to Suspension only and Ornaments at 0%.

Create playback includes the ornaments you will export. Follow Me's live output is still chord tones. Switch back to Create to hear them, or to drag the MIDI. Ornament data is shared by every model. Bach and Corelli are reliable stylistic starting points.

### Hold notes and reset

**Hold notes** (under the voicing card, on by default) sustains a MIDI note into the next chord when the pitch continues, in playback and in export. It is independent of Keep tones. Raise Keep tones to prefer a shared pitch in the same voice. Turn Hold notes on to sustain that pitch in the MIDI.

**Reset voicing** restores the defaults: Ensemble to Choir (SATB), the voice-leading dials to 50%, Ornaments to 0%, Suspension as the only ornament type, and Hold notes on.

### Voicing Examples

Here you can see two distinct voicings of the same harmonic sequence. Don't worry if it's a bit hard to appreciate what's going on from the screenshots — just know that the best way to understand it is to try two variations and listen for the differences. A good parameter to test is **Open Chords**. 

In the DAW:

![Voicing Variations DAW](/images/voicing-variations-daw.png)

As music notation:

![Voicing Variations Staff](/images/voicing-variations-staff.png)

As you configure voicing, _Keep tones_, _Center Voices_, _Stepwise Motion_, and _Contrary Motion_ show up clearly in the DAW view. Ornaments show up as notes between the chord changes.

---

## Harmonic Explorer

:::warning
⚠️ **Experimental Feature:** This is still in active development, and we'd love to hear your thoughts! If you have feedback or ideas, drop us a line at [info@lucidmusician.com](mailto:info@lucidmusician.com). 
:::

Use it to build your own sequences step-by-step with the same AI that powers Generate. In the *Harmonic Explorer* tab, destinations sit on the **circle of fifths** (tonic at 12 o'clock). **Closer to the center is more likely.** Each bubble is one **root**, color-coded by harmonic function (tonic / predominant / dominant), with a single Roman-numeral label.

Inversions and qualities of that root (V, V6, V7, …) stay collapsed until you hover; hover also plays the chord and shows the letter name, probability, and function. Click to commit the top quality, or hover an expanded inversion and click that one.

- **Diatonic** (default) hides borrowed and chromatic options; **All** shows them.
- **Inversions: Collapsed / Expanded** keeps rays stacked when you want every quality visible.
- **Show more** reveals roots beyond the eight most likely.
- The tape chooses the action: select a chord to **replace**, a gap to **insert**, or the end of the progression to **add next**. The map is the future; the tape is the history.

If you know theory, you can see that a V after IV is a strong choice. If you don't, hover and click. The suggestions stay inside the model's vocabulary.

---

## Chord Tape Editing

The chord tape is fully interactive. You can select, replace, insert, delete, duplicate, and rearrange chords directly in the tape without regenerating the entire progression. All edits are undoable.

### Selecting Chords

Click any chord in the tape to select it. The selected chord is highlighted with a distinct border. When the Harmonic Explorer tab is active, selecting a chord updates the explorer to show AI-suggested alternatives for that position.

Use the **Left** and **Right arrow keys** to move the selection through the progression. The tape scrolls to keep the selected chord visible.

Press **Escape** to clear the selection.

### Right-Click Context Menu

Right-click any chord to open the editing context menu:

- **Replace with...** — Opens the Harmonic Explorer with alternatives for this position. Click a destination to replace the chord.
- **Insert Before** — Opens the Harmonic Explorer to insert a new chord before this position.
- **Insert After** — Opens the Harmonic Explorer to insert a new chord after this position.
- **Delete** — Removes this chord from the progression. Selection moves to the chord on the left so you can delete several in a row. The first chord cannot be deleted.
- **Duplicate** — Inserts a copy of this chord immediately after it.

### Drag to Rearrange

Click and drag a chord to move it to a different position in the tape. A drop indicator shows where the chord will land. Release to complete the move.

### Keyboard Shortcuts

- **Left/Right Arrow** — Move selection
- **Delete / Backspace** — Delete selected chord (not the first); selection moves to the chord on the left
- **Escape** — Clear selection

### Editing with the Harmonic Explorer

The Harmonic Explorer and chord tape work together. When you select "Replace with..." or "Insert Before/After" from the context menu, the Harmonic Explorer tab activates and shows AI-suggested destinations based on the surrounding context. Click a bubble to apply the change.

The suggestions are context-aware: the AI considers the chords before and after the edit position to recommend harmonically appropriate alternatives.

### Editing During Infinite Mode

When Infinite Mode is active and the DAW transport is playing, editing is restricted to **Replace** only. Insert, delete, duplicate, and rearrange are disabled during playback to avoid disrupting the real-time streaming. Stop the transport to access all editing operations.

### Undo/Redo for Edits

Every edit operation (replace, insert, delete, duplicate, rearrange) is captured in the undo history. Use Cmd+Z (Mac) or Ctrl+Z (Windows/Linux) to step back through edits, and Cmd+Shift+Z (Mac) or Ctrl+Shift+Z / Ctrl+Y (Windows/Linux) to redo.

---

## Common Workflows

### Creating Background Choral Pads

**Settings:** Predictability from Very Familiar to Balanced, Richness from Colorful to Rich, chord length of 2-4 bars for long sustained chords, and 16-32 bars total.

**Voicing:** Keep tones at 80-100%, Stepwise Motion at 60-80%, and Open Chords at 40-60%.

**Pro tip:** Use Infinite Mode for endless evolving pads.

### Ambient & Atmospheric Textures

**Settings:** Predictability from Surprising to Very Surprising, Richness from Rich to Very Rich, chord length of 4-8 bars, with Infinite Mode enabled.

**Voicing:** Keep tones at 20-40%, Open Chords at 70-100%, and Contrary Motion at 60-80%.

### Jazz-Influenced Progressions

**Settings:** AI Model set to Bach or Corelli, Predictability from Balanced to Surprising, and Harmonic Richness from Rich to Very Rich.

**Voicing:** Keep tones at 40-60%, Stepwise Motion at 50-70%, Contrary Motion at 60-80%, and Avoid Parallel at 70-90%.

### Minimalist Loops

**Settings:** Predictability at Very Familiar, Richness from Simple to Some Color, chord length of 1/4 to 1/2 bar, 4-8 bars total, with Infinite Mode enabled.

**Voicing:** Keep tones at 80-100%, Stepwise Motion at 80-100%, and Open Chords at 20-40%.

---

## Troubleshooting

### Plugin Doesn't Appear in DAW

**macOS:**
1. Verify installation location: `/Library/Audio/Plug-Ins/Components/` (AU), `/Library/Audio/Plug-Ins/VST3/` (VST3), or `/Library/Audio/Plug-Ins/CLAP/` (CLAP)
2. Rescan plugins in your DAW
3. Check macOS security settings: System Settings → Privacy & Security
4. Restart your DAW

**Windows:**
1. Verify installation location: `C:\Program Files\Common Files\VST3\`
2. Check VST3 path in your DAW settings
3. Rescan plugins
4. Run DAW as Administrator
5. Check Windows Defender exceptions

### No Sound / Silent Output

LucidHarmony is a MIDI effect: it does **not** need incoming MIDI to play. Generate, then press Play on an **empty** instrument track.

1. Confirm LucidHarmony is before the instrument (MIDI FX / MIDI insert), not an audio insert
2. Verify the instrument track is armed/enabled and not muted
3. Click Generate, then Play — no MIDI region, don’t play the keyboard
4. If you see **Muted by track MIDI**, there is a note-on on that track — mute/remove the region
5. After dragging MIDI out, Play uses the DAW region. Click the tape banner to audition LucidHarmony again

### Crackling or Distorted Audio

1. Increase buffer size in your DAW's audio preferences (try 512 or 1024 samples)
2. Check CPU usage — close other applications
3. Update audio drivers
4. Disable other plugins temporarily to isolate the issue

### "Generate" Button Does Nothing

1. Stay in **Create**. In Follow Me the button reads **Listening...** and does not generate
2. A key and an AI model are always selected; Bars from 4 to 32 is a finite progression, and 33 is Infinite
3. A highlighted Generate button means the tape is empty, or settings changed since the last generation
4. Check your DAW's console or log for errors

### Generated Progressions Sound "Wrong"

1. Adjust Predictability — lower for more familiar, raise for more surprising
2. Try different AI models — each has distinct character
3. Generate more options — click Generate 20-30 times
4. Check your key and mode selection
5. Adjust voicing — same progression can sound very different with different voicing

### Can't Export MIDI to DAW

1. Drag to the arrangement/timeline view, not the mixer
2. Drag to an empty area to create a new MIDI clip (a second instrument track is the usual target)
3. Ensure you're dragging to a MIDI or Instrument track, not an audio track
4. Check DAW compatibility — most DAWs support MIDI drag and drop
5. After a successful drop, Play uses that region. Click the tape banner if you want to hear LucidHarmony again


### After you drag MIDI onto a track

LucidHarmony stops auditioning so the DAW region is what Play drives. If you still hear two parts, or the tape keeps moving after you mute the instrument, the plugin and a region are both sounding. Mute one instrument, or click the tape banner so only one source is live.

### Voices Sound Too Close Together

1. Increase "Open Chords" slider to 70-100%
2. Decrease "Center Voices" slider
3. Use **Drag Multi** and transpose a voice by octaves in your DAW

### Voices Sound Too Spread Out

1. Decrease "Open Chords" slider to 0-30%
2. Increase "Center Voices" slider

### Voice Leading Sounds Jumpy

1. Increase "Stepwise Motion" to 80-100%
2. Increase "Keep tones" to 70-100%
3. Lower "Contrary Motion" if you want more parallel motion

---

## Tips & Best Practices

1. **Generate liberally**—don't settle for the first result. Click Generate 10-20 times
2. **Save everything**—drag progressions to your DAW immediately. You can always delete later
3. **One parameter at a time**—change one setting, regenerate, compare. Learn what each control does
4. **Use Infinite Mode for discovery**—let it play while you work on other parts of your track
5. **Export both Single and Multi**—having both gives you options during arrangement
6. **Experiment with AI models**—each model has a distinct character
7. **Voice the same progression multiple ways**—one harmonic progression can serve multiple sections with different voicings
8. **Start simple**—use 8 bars, Balanced predictability, Colorful richness for first use
9. **Use Undo/Redo** — Cmd+Z (Mac) / Ctrl+Z (Windows and Linux) to compare different generations

---

## Support

If you're experiencing problems not covered here:

1. **Check for updates**—visit [lucidmusician.com](https://lucidmusician.com) for the latest version
2. **Contact support**—[submit a support ticket](https://lucidmusician.zohodesk.com/portal/en/newticket)
   - Include: OS version, DAW name and version, LucidHarmony version, detailed description, screenshots
3. **Email**: support@lucidmusician.com

---

## The Upshot

This is a novel, powerful AI chord generator. Our custom AI model draws on deep knowledge from master composers and centuries of music theory.

The possibilities are endless. Add LucidHarmony to your workflow today!
