# Implementation Plan

- [x] 1. Write bug condition exploration test
  - **Property 1: Bug Condition** - Separate Controls and Incorrect Numbering
  - **CRITICAL**: This test MUST FAIL on unfixed code - failure confirms the bug exists
  - **DO NOT attempt to fix the test or the code when it fails**
  - **NOTE**: This test encodes the expected behavior - it will validate the fix when it passes after implementation
  - **GOAL**: Surface counterexamples that demonstrate the bug exists in `public/content/docs.md`
  - **Scoped PBT Approach**: Scope the property to the concrete failing cases in the Controls Overview tables
  - Parse the three Controls Overview markdown tables (AI Generator, MIDI Export, Voicing Section) from `public/content/docs.md`
  - Test that control #4 is a single row named "Time Signature & Note Length" (from Bug Condition: currently two separate rows #4 "Time Signature" and #5 "Note Length")
  - Test that control #6 is a single row named "Richness & Extension Bias" (from Bug Condition: currently two separate rows #7 "Richness" and #8 "Extension Bias Toggles")
  - Test that the total count of numbered controls across all three tables equals exactly 20 (currently 22)
  - Test that AI Generator table has exactly 10 rows, MIDI Export has 2 rows, Voicing has 8 rows
  - Test sequential numbering 1–20 with no gaps or duplicates across all tables
  - Test that Drag MIDI (Single) is #11 and Drag MIDI (Multi) is #12 (currently #13 and #14)
  - Test that Avoid Parallel is #13 and Reset Voicing is #20 (currently #15 and #22)
  - Run test on UNFIXED code
  - **EXPECTED OUTCOME**: Test FAILS (this is correct - it proves the bug exists)
  - Document counterexamples found: Time Signature/Note Length are separate rows, Richness/Extension Bias Toggles are separate rows, total count is 22, MIDI Export and Voicing numbers are offset by +2
  - Mark task complete when test is written, run, and failure is documented
  - _Requirements: 1.1, 1.2, 1.3, 1.4_

- [x] 2. Write preservation property tests (BEFORE implementing fix)
  - **Property 2: Preservation** - Unchanged Content and Structure
  - **IMPORTANT**: Follow observation-first methodology
  - Observe: All control description text in the AI Generator, MIDI Export, and Voicing tables on UNFIXED code
  - Observe: All 8 voicing control names and descriptions (Avoid Parallel, Contrary Motion, Stepwise Motion, Open Chords, Common Tones, Center Voices, Extend MIDI, Reset Voicing) on UNFIXED code
  - Observe: Both MIDI Export control names and descriptions (Drag MIDI Single, Drag MIDI Multi) on UNFIXED code
  - Observe: All sections outside Controls Overview (Installation, Setting Up the Plugin, Getting Started, Voicing Controls detail section, Harmonic Explorer, Common Workflows, Troubleshooting, Tips & Best Practices, Support, etc.) on UNFIXED code
  - Write property-based test: for all non-Controls-Overview sections, content is byte-identical between original and fixed document
  - Write property-based test: for all control descriptions in the Voicing table, description text is preserved verbatim (only number changes)
  - Write property-based test: for all control descriptions in the MIDI Export table, description text is preserved verbatim (only number changes)
  - Write property-based test: the Voicing Parameters table in the "Voicing Controls" section (separate from Controls Overview) is completely unchanged
  - Write property-based test: all prose paragraphs, image references, and MIDI Metadata note within Controls Overview are unchanged
  - Verify tests pass on UNFIXED code
  - **EXPECTED OUTCOME**: Tests PASS (this confirms baseline behavior to preserve)
  - Mark task complete when tests are written, run, and passing on unfixed code
  - _Requirements: 3.1, 3.2, 3.3, 3.4_

- [x] 3. Fix for combined controls numbering in Controls Overview

  - [x] 3.1 Merge Time Signature and Note Length into a single control #4
    - In the AI Generator Section table in `public/content/docs.md`, replace the two separate rows for #4 "Time Signature" and #5 "Note Length" with a single row #4 "Time Signature & Note Length"
    - The merged description should combine both: time signature options (4/4, 3/4, 2/4, 6/8, 12/8, 5/4, 7/8) and note length options (1/8, 1/4, 1/2, 1, 2, 4, 8, 16 bars per chord)
    - _Bug_Condition: isBugCondition(controlEntry) where controlEntry.number == 4 AND nextRow.number == 5 AND they are separate rows for Time Signature and Note Length_
    - _Expected_Behavior: Single row #4 "Time Signature & Note Length" with merged description_
    - _Preservation: All description content from both original rows must be present in the merged description_
    - _Requirements: 2.1_

  - [x] 3.2 Renumber Predictability from #6 to #5
    - Change the Predictability control number from #6 to #5 in the AI Generator Section table
    - _Requirements: 2.1_

  - [x] 3.3 Merge Richness and Extension Bias Toggles into a single control #6
    - Replace the two separate rows for #7 "Richness" and #8 "Extension Bias Toggles" with a single row #6 "Richness & Extension Bias"
    - The merged description should combine both: richness levels (Simple through Very Rich) and extension bias toggles (7ths, 9ths, Aug 6ths, Others) that appear when Richness is above Simple
    - _Bug_Condition: isBugCondition(controlEntry) where controlEntry.number == 7 AND nextRow.number == 8 AND they are separate rows for Richness and Extension Bias Toggles_
    - _Expected_Behavior: Single row #6 "Richness & Extension Bias" with merged description_
    - _Preservation: All description content from both original rows must be present in the merged description_
    - _Requirements: 2.2_

  - [x] 3.4 Renumber remaining AI Generator controls
    - Bars: change from #9 to #7
    - Infinite Mode: change from #10 to #8
    - Generate Button: change from #11 to #9
    - Undo/Redo: change from #12 to #10
    - _Requirements: 2.1, 2.2_

  - [x] 3.5 Renumber MIDI Export controls
    - Drag MIDI (Single): change from #13 to #11
    - Drag MIDI (Multi): change from #14 to #12
    - _Expected_Behavior: MIDI Export controls numbered #11 and #12 reflecting corrected AI Generator count of 10_
    - _Requirements: 2.3_

  - [x] 3.6 Renumber Voicing Section controls
    - Avoid Parallel: change from #15 to #13
    - Contrary Motion: change from #16 to #14
    - Stepwise Motion: change from #17 to #15
    - Open Chords: change from #18 to #16
    - Common Tones: change from #19 to #17
    - Center Voices: change from #20 to #18
    - Extend MIDI: change from #21 to #19
    - Reset Voicing: change from #22 to #20
    - _Expected_Behavior: Voicing controls numbered #13 through #20, total of 20 numbered controls across all tables_
    - _Requirements: 2.4_

  - [x] 3.7 Verify bug condition exploration test now passes
    - **Property 1: Expected Behavior** - Combined Controls and Correct Numbering
    - **IMPORTANT**: Re-run the SAME test from task 1 - do NOT write a new test
    - The test from task 1 encodes the expected behavior: merged rows, correct numbering 1–20, correct table row counts
    - When this test passes, it confirms the expected behavior is satisfied
    - Run bug condition exploration test from step 1
    - **EXPECTED OUTCOME**: Test PASSES (confirms bug is fixed)
    - _Requirements: 2.1, 2.2, 2.3, 2.4_

  - [x] 3.8 Verify preservation tests still pass
    - **Property 2: Preservation** - Unchanged Content and Structure
    - **IMPORTANT**: Re-run the SAME tests from task 2 - do NOT write new tests
    - Run preservation property tests from step 2
    - **EXPECTED OUTCOME**: Tests PASS (confirms no regressions)
    - Confirm all description text, non-Overview sections, and document structure are unchanged

- [x] 4. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.
