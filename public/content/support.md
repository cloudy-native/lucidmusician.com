# LucidHarmony Support

Having trouble? This page covers the most common issues and how to resolve them. If you can't find what you need here, contact us directly.

---

## Getting Help

If your issue isn't covered here:

1. **Check for updates** on Gumroad, the platform we use for distribution. Find your download email and follow the product link. Or log into https://gumroad.com and navigate to your library. Select LucidHarmony. Many issues are resolved in newer versions.
2. **Submit a support ticket** at [lucidmusician.zohodesk.com](https://lucidmusician.zohodesk.com/portal/en/newticket)
3. **Email us** at support@lucidmusician.com . Our offices are in Bangkok, Thailand, so please be patient with our timezone 🙂.

When contacting support, please include:
- Your operating system and version (e.g., macOS 14.2, Windows 11)
- Your DAW name and version (e.g., Logic Pro 11.1, Ableton Live 12)
- LucidHarmony version (shown in the About tab)
- A detailed description of the problem
- Screenshots if possible
- Steps to reproduce the issue

---

## Installation Issues

### Plugin Doesn't Appear in DAW

**macOS:**
1. Verify installation location: `~/Library/Audio/Plug-Ins/Components/` (AU) or `~/Library/Audio/Plug-Ins/VST3/` (VST3) or `~/Library/Audio/Plug-Ins/CLAP/` (CLAP)
2. Rescan plugins in your DAW:
   - **Logic Pro**: Preferences → Plug-in Manager → Reset & Rescan
   - **Ableton Live**: Preferences → Plug-ins → Rescan
   - **Reaper**: Preferences → Plug-ins → VST → Re-scan
3. Check macOS security settings: System Preferences → Security & Privacy → General. If macOS blocked the plugin, you may see a message here with an "Allow" button.
4. Restart your DAW after rescanning

**Windows:**
1. Verify installation location: `C:\Program Files\Common Files\VST3\` (VST3) or `C:\Program Files\Common Files\CLAP\` (CLAP)
2. Check that your DAW's VST3/CLAP scan path includes the above directories
3. Rescan plugins:
   - **FL Studio**: Options → Manage Plugins → Find Plugins
   - **Cubase**: Studio → VST Plug-in Manager → Update Plug-in Information
   - **Reaper**: Preferences → Plug-ins → VST → Re-scan
4. Try running your DAW as Administrator
5. Check Windows Defender or antivirus exceptions. Some security software quarantines new plugin files.

**Linux:**
1. Verify installation location: `~/.vst3/` (VST3) or `~/.clap/` (CLAP)
2. Rescan plugins:
   - **Ardour**: Preferences → Plug-ins → Rescan
   - **Reaper**: Preferences → Plug-ins → VST → Re-scan
3. Check file permissions on the plugin files

### macOS Security Warnings

If macOS shows "LucidHarmony can't be opened because Apple cannot check it for malicious software," this is Gatekeeper blocking an unsigned or notarized app. Our releases are code-signed and notarized, but if you downloaded from an older link or the notarization hasn't propagated:

1. Go to System Preferences → Security & Privacy → General
2. Look for a message about LucidHarmony being blocked
3. Click "Allow Anyway"
4. Rescan plugins in your DAW

---

## Audio and MIDI Issues

### No Sound / Silent Output

LucidHarmony is a MIDI effect. It generates MIDI data, not audio. You need to route its output to a software instrument.

1. Make sure you have a software instrument (synth, piano, strings, etc.) receiving MIDI from LucidHarmony. See the [Setting Up the Plugin](docs.md#setting-up-the-plugin) section in the main docs for DAW-specific routing instructions.
2. Verify the instrument track is armed/enabled and not muted
3. Check that you've generated a progression. Click Generate to create chords.
4. Press play in your DAW to hear the progression

### Crackling or Distorted Audio

LucidHarmony itself uses very little CPU (chord generation takes less than 1ms). Crackling is almost always caused by your instrument plugin or DAW audio settings.

1. Increase buffer size in your DAW's audio preferences (try 512 or 1024 samples)
2. Check CPU usage. Close other applications if needed.
3. Update your audio interface drivers
4. Temporarily disable other plugins to isolate the issue
5. If the problem only occurs during MIDI drag, try exporting to a different track

### MIDI Drag Not Working

1. Drag to the arrangement/timeline view, not the mixer
2. Drag to an empty area on a MIDI or Instrument track to create a new clip
3. Make sure you're not dragging to an audio track
4. Some DAWs require you to hold a modifier key while dragging. Check your DAW's documentation.
5. If dragging feels unresponsive, try generating a shorter progression first (8 bars) to confirm it works

### Stuck Notes

If notes continue playing after stopping transport:

1. Stop and restart transport in your DAW
2. Send an All Notes Off message (most DAWs have a panic button or shortcut)
3. If using Infinite Mode, disable it and stop transport
4. As a last resort, bypass and re-enable the plugin

---

## Generation Issues

### "Generate" Button Does Nothing

1. Make sure a key is selected in the Key dropdown
2. Check that the Bars slider is set to a reasonable value (4-32)
3. Verify an AI model is selected in the AI Model dropdown
4. Check your DAW's console or log for error messages
5. Try resetting to defaults: C Major, I chord, Bach model, 8 bars, Balanced predictability

### Generated Progressions Sound "Wrong" or Random

1. Lower the **Predictability** dial. "Very Familiar" and "Familiar" produce the most conventional progressions.
2. Lower the **Richness** dial. "Simple" uses only basic triads.
3. Try a different AI model. Bach produces the most structured, tonal results. Trecento and Monteverdi are more adventurous.
4. Generate more options. Click Generate 20-30 times. Each click produces a completely different progression.
5. Check your key and mode selection. A progression in C minor will sound very different from C major.
6. Adjust voicing. The same chord progression can sound very different with different voicing settings.

### All Progressions Sound the Same

1. Raise the **Predictability** dial toward "Surprising" or "Very Surprising"
2. Raise the **Richness** dial and enable extension toggles (7ths, 9ths, Aug 6ths)
3. Try a different AI model. Each model has a distinct harmonic character.
4. Change the start chord. Starting on ii or vi instead of I leads to very different progressions.
5. Try minor mode if you've been using major (or vice versa)

---

## Voicing Issues

### Voices Sound Too Close Together

1. Increase the **Open Chords** dial to 70-100%
2. Decrease the **Center Voices** dial
3. Export as Multi-track and manually transpose voices by octaves in your DAW

### Voices Sound Too Spread Out

1. Decrease the **Open Chords** dial to 0-30%
2. Increase the **Center Voices** dial

### Voice Leading Sounds Jumpy

1. Increase **Stepwise Motion** to 80-100%
2. Increase **Common Tones** to 70-100%
3. Lower **Contrary Motion** if you want more parallel motion
4. Enable **Extend MIDI** for smoother note connections

### Voicing Sounds Thin or Hollow

1. Decrease **Open Chords** for tighter spacing
2. Increase **Richness** to add more chord tones
3. Try exporting as Multi-track and layering voices with different instruments

---

## Chord Editing Issues

### Can't Edit Chords During Playback

When Infinite Mode is active and the DAW transport is playing, editing is restricted to **Replace** only. Insert, delete, duplicate, and rearrange are disabled during playback to avoid disrupting the real-time streaming. Stop the transport to access all editing operations.

### Context Menu Doesn't Appear

Right-click (or Ctrl+click on Mac) on a chord in the tape. If the context menu still doesn't appear:

1. Make sure you're clicking directly on a chord box, not the empty space between them
2. Check that a progression has been generated (the tape isn't empty)
3. Try clicking a chord first to select it, then right-clicking

### Harmonic Explorer Shows Wrong Alternatives

The Harmonic Explorer shows alternatives based on the chords surrounding the selected position. If the suggestions seem off:

1. Make sure you've selected the correct chord position in the tape
2. The alternatives depend on the AI model. Different models suggest different chords.
3. Try selecting a different position to see how context changes the suggestions

---

## Licensing

### How Licensing Works

LucidHarmony uses a simple, hassle-free licensing system through Gumroad. Pay what you like with a 30-day money-back guarantee.

- You get your license key when you download
- Enter it in the About tab of the plugin
- **We never block or disable any features.** An unlicensed plugin shows a friendly reminder, but everything works.
- Install on as many computers as you like
- Works offline. We check the license about once a week, but this never blocks functionality.

### License Key Not Accepted

1. Copy and paste the key directly from your Gumroad email to avoid typos
2. Make sure there are no extra spaces before or after the key
3. Check your internet connection. The first validation requires a brief online check.
4. If you purchased recently, wait a few minutes for the transaction to process
5. Contact support with your Gumroad order number if the problem persists

### Lost License Key

1. Check your email for the original Gumroad purchase confirmation
2. Visit [Gumroad](https://gumroad.com) and log in to find your purchases
3. Contact support with your purchase email address and we'll help you recover it

---

## System Requirements

| Platform | Minimum OS | Architectures | Plugin Formats |
|----------|-----------|---------------|----------------|
| **macOS** | 11.0 (Big Sur) | Intel, Apple Silicon (M1/M2/...) | AU, AUv3, VST3, CLAP |
| **Windows** | 10 (64-bit) | Intel/AMD x64, ARM64 | VST3, CLAP |
| **Linux** | 64-bit | Intel/AMD x64, ARM64 | VST3, CLAP |

LucidHarmony uses minimal CPU and memory. Chord generation takes less than 1ms per chord. The plugin runs entirely on CPU with no GPU requirements.

