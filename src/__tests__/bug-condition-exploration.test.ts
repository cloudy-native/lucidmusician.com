import { describe, it, expect } from "vitest";
import * as fc from "fast-check";
import { readFileSync } from "fs";
import { resolve } from "path";

/**
 * Bug Condition Exploration Test
 *
 * Property 1: Bug Condition - Separate Controls and Incorrect Numbering
 *
 * This test encodes the EXPECTED (correct) behavior for the Controls Overview
 * tables in docs.md. It MUST FAIL on unfixed code — failure confirms the bug exists.
 *
 * DO NOT fix the test or the code when it fails.
 */

// --- Helpers ---

interface ControlRow {
  number: number;
  name: string;
  description: string;
}

function readDocsContent(): string {
  const docsPath = resolve(__dirname, "../../public/content/docs.md");
  return readFileSync(docsPath, "utf-8");
}

function parseControlTable(markdown: string, sectionHeading: string): ControlRow[] {
  const lines = markdown.split("\n");
  const rows: ControlRow[] = [];

  let inSection = false;
  let tableStarted = false;
  let headerRowsSeen = 0;

  for (const line of lines) {
    // Detect section heading (### level)
    if (line.startsWith("### ") && line.includes(sectionHeading)) {
      inSection = true;
      tableStarted = false;
      headerRowsSeen = 0;
      continue;
    }

    // Exit section on next heading of same or higher level
    if (inSection && /^#{1,3}\s/.test(line) && !line.includes(sectionHeading)) {
      break;
    }

    if (!inSection) continue;

    // Detect table rows (lines starting with |)
    if (line.trim().startsWith("|")) {
      headerRowsSeen++;
      // Skip header row and separator row
      if (headerRowsSeen <= 2) continue;

      tableStarted = true;
      const cells = line
        .split("|")
        .map((c) => c.trim())
        .filter((c) => c.length > 0);

      if (cells.length >= 3) {
        const numMatch = cells[0].replace(/\*/g, "").trim();
        const num = parseInt(numMatch, 10);
        if (!isNaN(num)) {
          rows.push({
            number: num,
            name: cells[1].replace(/\*/g, "").trim(),
            description: cells[2],
          });
        }
      }
    } else if (tableStarted && line.trim() !== "") {
      // Non-table line after table started means table ended
      break;
    }
  }

  return rows;
}

// --- Tests ---

describe("Bug Condition Exploration: Controls Overview Numbering", () => {
  const docsContent = readDocsContent();
  const aiGeneratorRows = parseControlTable(docsContent, "AI Generator Section");
  const midiExportRows = parseControlTable(docsContent, "MIDI Export");
  const voicingSectionRows = parseControlTable(docsContent, "Voicing Section");
  const allRows = [...aiGeneratorRows, ...midiExportRows, ...voicingSectionRows];

  it("should have AI Generator table with exactly 10 rows", () => {
    expect(aiGeneratorRows).toHaveLength(10);
  });

  it("should have MIDI Export table with exactly 2 rows", () => {
    expect(midiExportRows).toHaveLength(2);
  });

  it("should have Voicing Section table with exactly 8 rows", () => {
    expect(voicingSectionRows).toHaveLength(8);
  });

  it("should have exactly 20 total numbered controls across all tables", () => {
    expect(allRows).toHaveLength(20);
  });

  it('should have control #4 named "Time Signature & Note Length" (single merged row)', () => {
    const control4 = aiGeneratorRows.find((r) => r.number === 4);
    expect(control4).toBeDefined();
    expect(control4!.name).toBe("Time Signature & Note Length");

    // There should be no control #5 named "Note Length" as a separate row
    const separateNoteLength = aiGeneratorRows.find(
      (r) => r.name === "Note Length"
    );
    expect(separateNoteLength).toBeUndefined();
  });

  it('should have control #6 named "Richness & Extension Bias" (single merged row)', () => {
    const control6 = aiGeneratorRows.find((r) => r.number === 6);
    expect(control6).toBeDefined();
    expect(control6!.name).toBe("Richness & Extension Bias");

    // There should be no separate "Extension Bias Toggles" row
    const separateExtBias = aiGeneratorRows.find(
      (r) => r.name === "Extension Bias Toggles"
    );
    expect(separateExtBias).toBeUndefined();
  });

  it("should number Drag MIDI (Single) as #11 and Drag MIDI (Multi) as #12", () => {
    const dragSingle = midiExportRows.find((r) =>
      r.name.includes("Drag MIDI (Single)")
    );
    const dragMulti = midiExportRows.find((r) =>
      r.name.includes("Drag MIDI (Multi)")
    );

    expect(dragSingle).toBeDefined();
    expect(dragSingle!.number).toBe(11);

    expect(dragMulti).toBeDefined();
    expect(dragMulti!.number).toBe(12);
  });

  it("should number Avoid Parallel as #13 and Reset Voicing as #20", () => {
    const avoidParallel = voicingSectionRows.find((r) =>
      r.name.includes("Avoid Parallel")
    );
    const resetVoicing = voicingSectionRows.find((r) =>
      r.name.includes("Reset Voicing")
    );

    expect(avoidParallel).toBeDefined();
    expect(avoidParallel!.number).toBe(13);

    expect(resetVoicing).toBeDefined();
    expect(resetVoicing!.number).toBe(20);
  });

  it("should have sequential numbering 1–20 with no gaps or duplicates", () => {
    const numbers = allRows.map((r) => r.number).sort((a, b) => a - b);
    const expected = Array.from({ length: 20 }, (_, i) => i + 1);
    expect(numbers).toEqual(expected);
  });

  // Property-based test: pick any control by index and verify its number matches position
  it("property: every control's number matches its sequential position (1-indexed)", () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: allRows.length - 1 }),
        (index) => {
          const row = allRows[index];
          // Controls should be numbered sequentially starting from 1
          expect(row.number).toBe(index + 1);
        }
      ),
      { numRuns: 100 }
    );
  });

  // Property-based test: no two controls share the same number
  it("property: no two controls share the same number", () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: allRows.length - 2 }),
        fc.integer({ min: 0, max: allRows.length - 2 }),
        (i, j) => {
          if (i !== j) {
            expect(allRows[i].number).not.toBe(allRows[j].number);
          }
        }
      ),
      { numRuns: 200 }
    );
  });
});
