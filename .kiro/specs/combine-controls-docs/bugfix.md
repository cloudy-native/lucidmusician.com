# Bugfix Requirements Document

## Introduction

The Controls Overview section in `public/content/docs.md` for the LucidHarmony plugin incorrectly lists 22 numbered controls when there should be 20. Two pairs of closely related controls are listed as separate numbered items but should each be combined into a single numbered control:

1. **Time Signature** (#4) and **Note Length** (#5) should be a single control entry.
2. **Richness** (#7) and **Extension Bias Toggles** (#8) should be a single control entry.

After combining these pairs, all subsequent control numbers in the Controls Overview tables (AI Generator, MIDI Export, and Voicing sections) must be renumbered to produce a correct sequence of 1–20.

## Bug Analysis

### Current Behavior (Defect)

1.1 WHEN viewing the AI Generator Section table THEN the system lists Time Signature as control #4 and Note Length as a separate control #5, even though they represent a single combined control concept.

1.2 WHEN viewing the AI Generator Section table THEN the system lists Richness as control #7 and Extension Bias Toggles as a separate control #8, even though Extension Bias Toggles are a sub-component of the Richness control.

1.3 WHEN viewing the MIDI Export table THEN the system numbers Drag MIDI (Single) as #13 and Drag MIDI (Multi) as #14, which is incorrect because the AI Generator section overcounts by 2.

1.4 WHEN viewing the Voicing Section table THEN the system numbers controls from #15 to #22 (8 items), which is incorrect because the preceding sections overcount by 2, and the total reaches 22 instead of 20.

### Expected Behavior (Correct)

2.1 WHEN viewing the AI Generator Section table THEN the system SHALL list Time Signature and Note Length as a single combined control #4 with both descriptions merged.

2.2 WHEN viewing the AI Generator Section table THEN the system SHALL list Richness and Extension Bias Toggles as a single combined control #6 with both descriptions merged.

2.3 WHEN viewing the MIDI Export table THEN the system SHALL number Drag MIDI (Single) as #11 and Drag MIDI (Multi) as #12, reflecting the corrected count from the AI Generator section (which now has 10 controls).

2.4 WHEN viewing the Voicing Section table THEN the system SHALL number controls from #13 to #20 (8 items: Avoid Parallel, Contrary Motion, Stepwise Motion, Open Chords, Common Tones, Center Voices, Extend MIDI, Reset Voicing), producing a final total of 20 numbered controls.

### Unchanged Behavior (Regression Prevention)

3.1 WHEN viewing any control's description text THEN the system SHALL CONTINUE TO display the same descriptive content for each individual control (only numbering and grouping changes, not descriptions).

3.2 WHEN viewing the Voicing Section table THEN the system SHALL CONTINUE TO list all 8 voicing controls (Avoid Parallel, Contrary Motion, Stepwise Motion, Open Chords, Common Tones, Center Voices, Extend MIDI, Reset Voicing) with their existing descriptions.

3.3 WHEN viewing the MIDI Export table THEN the system SHALL CONTINUE TO list both Drag MIDI (Single) and Drag MIDI (Multi) with their existing descriptions.

3.4 WHEN viewing sections outside the Controls Overview (Installation, Setting Up, Getting Started, Voicing Controls detail section, Harmonic Explorer, etc.) THEN the system SHALL CONTINUE TO display all content unchanged.
