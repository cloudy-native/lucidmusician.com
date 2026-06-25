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
    question: "MIDI drag and drop isn't working. What should I try?",
    answer:
      "Drag to the arrangement/timeline view on a MIDI or Instrument track, not the mixer or an audio track. Some DAWs require a modifier key while dragging. If drag feels unresponsive, try generating a shorter progression first to confirm the workflow.",
  },
  {
    question: "The Generate button does nothing. How do I fix it?",
    answer:
      "Make sure a key is selected, the Bars slider is set to a reasonable value (4–32), and an AI model is selected. Try resetting to defaults: C Major, I chord, Bach model, 8 bars, Balanced predictability. Check your DAW console for error messages.",
  },
  {
    question: "Generated progressions sound wrong or too random. How do I get better results?",
    answer:
      "Lower Predictability toward Familiar or Very Familiar, lower Richness to Simple for basic triads, try the Bach model for more tonal results, and generate multiple options — each click produces a different progression. Also check your key, mode, and voicing settings.",
  },
  {
    question: "How does LucidHarmony licensing work?",
    answer:
      "Purchase through Gumroad ($10 during the current 50% off promotion, regular price $20). Enter your license key in the About tab. The plugin works offline, installs on multiple computers, and unlicensed use shows a friendly reminder without blocking features.",
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