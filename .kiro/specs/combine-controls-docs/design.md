# Combine Controls Docs Bugfix Design

## Overview

The Controls Overview section in `public/content/docs.md` lists 22 numbered controls when there should be 20. Two pairs of closely related controls—Time Signature (#4) / Note Length (#5), and Richness (#7) / Extension Bias Toggles (#8)—are listed as separate numbered items but should each be combined into a single entry. After merging these pairs, all subsequent control numbers across the AI Generator, MIDI Export, and Voicing section tables must be renumbered to produce a correct sequence of 1–20.

## Glossary

- **Bug_Condition (C)**: The condition where control numbering in the Controls Overview tables is incorrect—two pairs of controls are listed separately instead of combined, causing the total count to be 22 instead of 20 and all subsequent numbers to be offset.
- **Property (P)**: The desired state where Time Signature/Note Length are merged as control #4, Richness/Extension Bias Toggles are merged as control #6, and all controls are numbered 1–20 sequentially across all three tables.
- **Preservation**: All control description text, all sections outside Controls Overview, and the complete set of 8 voicing controls and 2 MIDI export controls must remain unchanged in content (only numbering and grouping changes).
- **Controls Overview**: The section in `docs.md` containing three markdown tables (AI Generator, MIDI Export, Voicing) that enumerate all numbered plugin controls.
- **AI Generator Section table**: The first numbered control table listing controls #1–#12 (currently #1–#12, should become #1–#10 after fix).
- **MIDI Export table**: The second numbered control table listing drag MIDI controls (currently #13–#14, should become #11–#12).
- **Voicing Section table**: The third numbered control table listing voicing controls (currently #15–#22, should become #13–#20).

## Bug Details

### Bug Condition

The bug manifests when viewing the Controls Overview section in `docs.md`. Two pairs of controls that should be combined into single entries are listed as separate numbered rows, inflating the total count from 20 to 22 and causing all subsequent control numbers to be offset by 2.

**Formal Specification:**
```
FUNCTION isBugCondition(controlEntry)
  INPUT: controlEntry of type MarkdownTableRow
  OUTPUT: boolean

  // Pair 1: Time Signature and Note Length are separate rows
  RETURN (controlEntry.number == 4 AND controlEntry.name == "Time Signature"
          AND nextRow.number == 5 AND nextRow.name == "Note Length"
          AND theyAreSeparateRows)
  // Pair 2: Richness and Extension Bias Toggles are separate rows
  OR     (controlEntry.number == 7 AND controlEntry.name == "Richness"
          AND nextRow.number == 8 AND nextRow.name == "Extension Bias Toggles"
          AND theyAreSeparateRows)
  // Any control numbered higher than it should be due to the overcounting
  OR     (controlEntry.number > correctNumber(controlEntry.name))
END FUNCTION
```

### Examples

- **Time Signature / Note Length (current)**: Listed as two rows—#4 "Time Signature" and #5 "Note Length". Expected: single row #4 "Time Signature & Note Length" with merged description.
- **Richness / Extension Bias Toggles (current)**: Listed as two rows—#7 "Richness" and #8 "Extension Bias Toggles". Expected: single row #6 "Richness & Extension Bias" with merged description.
- **Drag MIDI (Single) (current)**: Numbered #13. Expected: #11 (offset corrected by −2).
- **Avoid Parallel (current)**: Numbered #15. Expected: #13 (offset corrected by −2).
- **Reset Voicing (current)**: Numbered #22. Expected: #20 (offset corrected by −2).

## Expected Behavior

### Preservation Requirements

**Unchanged Behaviors:**
- All individual control description text must remain intact (only numbering and row grouping changes).
- All 8 voicing controls (Avoid Parallel, Contrary Motion, Stepwise Motion, Open Chords, Common Tones, Center Voices, Extend MIDI, Reset Voicing) must continue to appear with their existing descriptions.
- Both MIDI Export controls (Drag MIDI Single and Multi) must continue to appear with their existing descriptions.
- All sections outside the Controls Overview (Installation, Setting Up the Plugin, Getting Started, Voicing Controls detail section, Harmonic Explorer, Common Workflows, Troubleshooting, Tips & Best Practices, Support, etc.) must remain completely unchanged.

**Scope:**
All content that does NOT involve the numbered control tables in the Controls Overview section should be completely unaffected by this fix. This includes:
- Prose paragraphs within the Controls Overview section (e.g., the introductory text, the image references, the MIDI Metadata note)
- All markdown tables outside the Controls Overview (e.g., the Voicing Parameters table in the "Voicing Controls" section)
- All other documentation sections

## Hypothesized Root Cause

Based on the bug description, the issues are straightforward documentation errors:

1. **Separate Listing of Time Signature and Note Length**: These two controls were documented as independent numbered items (#4 and #5) when they should be a single combined entry (#4) since they represent closely related rhythm/timing configuration.

2. **Separate Listing of Richness and Extension Bias Toggles**: Extension Bias Toggles (#8) are a sub-component of the Richness control (#7) and should be documented as a single combined entry (#6) since the toggles only activate when Richness is above Simple.

3. **Cascading Numbering Error**: Because two extra rows exist in the AI Generator table, every subsequent control number in the MIDI Export and Voicing tables is offset by +2 (e.g., Drag MIDI Single is #13 instead of #11, Avoid Parallel is #15 instead of #13, etc.).

4. **Total Count Inflation**: The total numbered control count is 22 instead of the correct 20.

## Correctness Properties

Property 1: Bug Condition - Combined Controls and Correct Numbering

_For any_ control entry in the Controls Overview tables where the bug condition holds (a pair that should be combined, or a number that is offset), the fixed document SHALL contain the merged row with combined description text and the correct sequential number, producing exactly 20 numbered controls total across all three tables.

**Validates: Requirements 2.1, 2.2, 2.3, 2.4**

Property 2: Preservation - Unchanged Content and Structure

_For any_ content in the document that is NOT part of the numbered control entries affected by the bug (description text, non-Controls-Overview sections, MIDI Export descriptions, Voicing control descriptions), the fixed document SHALL contain exactly the same content as the original document, preserving all descriptions, sections, images, and formatting.

**Validates: Requirements 3.1, 3.2, 3.3, 3.4**

## Fix Implementation

### Changes Required

Assuming our root cause analysis is correct:

**File**: `public/content/docs.md`

**Section**: Controls Overview → AI Generator Section table

**Specific Changes**:

1. **Merge Time Signature and Note Length into control #4**: Replace the two separate rows (#4 Time Signature and #5 Note Length) with a single row #4 "Time Signature & Note Length". The merged description should combine both: the time signature options (4/4, 3/4, 2/4, 6/8, 12/8, 5/4, 7/8) and the note length options (1/8, 1/4, 1/2, 1, 2, 4, 8, 16 bars per chord).

2. **Renumber Predictability**: Change from #6 to #5.

3. **Merge Richness and Extension Bias Toggles into control #6**: Replace the two separate rows (#7 Richness and #8 Extension Bias Toggles) with a single row #6 "Richness & Extension Bias". The merged description should combine both: the richness levels (Simple through Very Rich) and the extension bias toggles (7ths, 9ths, Aug 6ths, Others) that appear when Richness is above Simple.

4. **Renumber remaining AI Generator controls**: Bars becomes #7, Infinite Mode becomes #8, Generate Button becomes #9, Undo/Redo becomes #10.

**Section**: Controls Overview → MIDI Export table

5. **Renumber MIDI Export controls**: Drag MIDI (Single) becomes #11, Drag MIDI (Multi) becomes #12.

**Section**: Controls Overview → Voicing Section table

6. **Renumber all Voicing controls**: Avoid Parallel becomes #13, Contrary Motion #14, Stepwise Motion #15, Open Chords #16, Common Tones #17, Center Voices #18, Extend MIDI #19, Reset Voicing #20.

## Testing Strategy

### Validation Approach

The testing strategy follows a two-phase approach: first, surface counterexamples that demonstrate the bug on unfixed content, then verify the fix works correctly and preserves existing content.

### Exploratory Bug Condition Checking

**Goal**: Surface counterexamples that demonstrate the bug BEFORE implementing the fix. Confirm or refute the root cause analysis.

**Test Plan**: Parse the markdown tables in the Controls Overview section and check control numbering, row counts, and control names. Run these checks on the UNFIXED document to observe the incorrect state.

**Test Cases**:
1. **Separate Time Signature / Note Length Test**: Verify that rows #4 and #5 exist as separate entries (will confirm bug on unfixed doc)
2. **Separate Richness / Extension Bias Test**: Verify that rows #7 and #8 exist as separate entries (will confirm bug on unfixed doc)
3. **Total Count Test**: Count all numbered controls across all three tables and verify the total is 22 (will confirm bug on unfixed doc)
4. **MIDI Export Offset Test**: Verify Drag MIDI (Single) is numbered #13 instead of #11 (will confirm bug on unfixed doc)
5. **Voicing Offset Test**: Verify Reset Voicing is numbered #22 instead of #20 (will confirm bug on unfixed doc)

**Expected Counterexamples**:
- Time Signature and Note Length appear as separate numbered rows
- Richness and Extension Bias Toggles appear as separate numbered rows
- Total control count is 22 instead of 20
- All controls after the first merged pair are numbered +2 higher than correct

### Fix Checking

**Goal**: Verify that for all control entries where the bug condition holds, the fixed document produces the expected merged rows and correct numbering.

**Pseudocode:**
```
FOR ALL controlEntry WHERE isBugCondition(controlEntry) DO
  result := parseFixedDocument(controlEntry)
  ASSERT expectedNumbering(result)
  ASSERT expectedMergedContent(result)
  ASSERT totalControlCount == 20
END FOR
```

### Preservation Checking

**Goal**: Verify that for all content where the bug condition does NOT hold, the fixed document contains the same content as the original.

**Pseudocode:**
```
FOR ALL content WHERE NOT isBugCondition(content) DO
  ASSERT originalDocument(content) == fixedDocument(content)
END FOR
```

**Testing Approach**: Property-based testing is recommended for preservation checking because:
- It can generate random section selections and verify content equality
- It catches accidental edits to unrelated sections
- It provides strong guarantees that only the intended changes were made

**Test Plan**: Capture the full content of the unfixed document, then after the fix, compare all non-affected sections line-by-line.

**Test Cases**:
1. **Description Text Preservation**: Verify that all control description text (the Description column content) is preserved in the fixed document, either verbatim in unchanged rows or combined in merged rows
2. **Voicing Controls Preservation**: Verify all 8 voicing controls still appear with their original descriptions
3. **MIDI Export Preservation**: Verify both MIDI export controls still appear with their original descriptions
4. **Non-Overview Sections Preservation**: Verify all sections outside Controls Overview are byte-identical to the original

### Unit Tests

- Parse each of the three tables and verify correct row count (AI Generator: 10, MIDI Export: 2, Voicing: 8)
- Verify sequential numbering 1–20 across all tables with no gaps or duplicates
- Verify merged rows contain content from both original rows
- Verify no control names are missing from the fixed document

### Property-Based Tests

- Generate random control name lookups and verify each control appears exactly once with correct number
- Generate random line selections from non-Controls-Overview sections and verify they match the original document
- Test that the total count of numbered controls is always exactly 20 regardless of which table is parsed

### Integration Tests

- Render the full markdown document and verify all three tables parse correctly
- Verify the document structure (heading hierarchy, image references, links) is intact after the fix
- Verify the Voicing Controls detail section (separate from Controls Overview) is completely unchanged
