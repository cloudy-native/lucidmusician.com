export interface FaqItem {
  question: string;
  answer: string;
}

export const supportFaqs: FaqItem[] = [
  {
    question: "Why doesn't LucidHarmony appear in my DAW?",
    answer:
      "Verify the plugin is installed in the correct folder for your format (AU, VST3, or CLAP), then rescan plugins in your DAW. On macOS, check System Settings → Privacy & Security if Gatekeeper blocked the plugin. On Windows, confirm your DAW's VST3/CLAP scan path includes the install directory and try rescanning.",
  },
  {
    question: "Why is LucidHarmony silent / producing no sound?",
    answer:
      "LucidHarmony is a MIDI effect — it generates MIDI, not audio. Route its output to a software instrument track, verify the instrument is armed and not muted, click Generate to create a progression, then press play in your DAW.",
  },
  {
    question: "Play does nothing / I see “Muted by track MIDI.” What’s going on?",
    answer:
      "LucidHarmony is a MIDI effect: Generate, then press play on an empty instrument track (no MIDI region, don’t play the keyboard). Audition mutes only when a MIDI note-on is on that track. Host clock and all-notes-off do not mute. Remove or mute the region to hear LucidHarmony again.",
  },
  {
    question: "I dragged MIDI to a track. Play still drives LucidHarmony / how do I hear the DAW region?",
    answer:
      "After a successful MIDI drag, Play uses the DAW region. The tape banner reads “MIDI is on a DAW track.” Click the banner to audition LucidHarmony again (“Auditioning LucidHarmony”); click once more to go back to the DAW MIDI. Generate does not switch this. Keep LucidHarmony on one track and drop MIDI onto a second instrument track; mute the unused instrument if you only want one source.",
  },
  {
    question: "MIDI drag and drop isn't working. What should I try?",
    answer:
      "Drag to the arrangement/timeline view on a MIDI or Instrument track, not the mixer or an audio track. Some DAWs require a modifier key while dragging. If drag feels unresponsive, try generating a shorter progression first to confirm the workflow.",
  },
  {
    question: "Harmonic Explorer looks crowded / I only wanted the next chord.",
    answer:
      "Each bubble is a destination root, not every inversion. Hover a bubble to hear it and to fan inversions along that ray; click to commit the top quality. Diatonic (default) hides borrowed and chromatic options. Show more reveals extra roots. Select a tape chord to replace it, or leave the end of the tape selected to add the next chord.",
  },
  {
    question: "The Generate button does nothing. How do I fix it?",
    answer:
      "Stay in Create (not Follow Me). Pick a model. Bars 4–32 is a finite progression; 33 is Infinite. Try C major, Bach, 8 bars. If Generate is highlighted, the chord tape is empty or settings changed since the last generation — click it again.",
  },
  {
    question: "Why don't I hear ornaments?",
    answer:
      "Ornaments defaults to 0% (none). Raise it on Intuitive or Advanced. On Advanced, only checked types are used: Suspension starts on; Passing, Neighbor, and Anticipation start off. The toggles do nothing while Ornaments is 0%. Create playback includes them. Follow Me live output is chord tones only — drag MIDI after you play to hear the ornaments. Keep tones is voice leading, not the ornament control. Hold notes only sustains a pitch that continues into the next chord.",
  },
  {
    question: "Generated progressions sound wrong or too random. How do I get better results?",
    answer:
      "Lower Predictability toward Familiar or Very Familiar, lower Richness to Simple for basic triads, try the Bach model for more tonal results, and generate multiple options — each click produces a different progression. Also check your key, mode, and voicing settings.",
  },
  {
    question: "How does LucidHarmony licensing work?",
    answer:
      "Purchase through Gumroad ($10 during the current 50% off promotion, regular price $20). Enter your license key in the About tab. The plugin works offline, installs on multiple computers, and unlicensed use shows a friendly reminder without blocking features. A license check may run at startup; it never disables the plugin.",
  },
  {
    question: "My license key isn't being accepted. What should I do?",
    answer:
      "Copy and paste the key directly from your Gumroad email to avoid typos, ensure there are no extra spaces, verify your internet connection for the first validation, and wait a few minutes if you purchased recently. Contact support with your Gumroad order number if the issue persists.",
  },
  {
    question: "macOS says LucidHarmony can't be opened because Apple cannot check it. What do I do?",
    answer:
      "This is Gatekeeper blocking the plugin. Go to System Settings → Privacy & Security → General, look for a message about LucidHarmony being blocked, click Allow Anyway, then rescan plugins in your DAW. Official releases are code-signed and notarized.",
  },
];