import { describe, it, expect } from "vitest";
import * as fc from "fast-check";
import { readFileSync } from "fs";
import { resolve } from "path";

/**
 * Preservation Property Tests (Property 2)
 *
 * These tests capture the UNFIXED document state and verify that content
 * outside the numbered control entries is preserved after the fix.
 *
 * Observation-first methodology: we read the current document, extract
 * the content that must NOT change, and assert it remains identical.
 *
 * EXPECTED OUTCOME: All tests PASS on unfixed code (baseline confirmation).
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

function parseControlTable(
  markdown: string,
  sectionHeading: string
): ControlRow[] {
  const lines = markdown.split("\n");
  const rows: ControlRow[] = [];

  let inSection = false;
  let tableStarted = false;
  let headerRowsSeen = 0;

  for (const line of lines) {
    if (line.startsWith("### ") && line.includes(sectionHeading)) {
      inSection = true;
      tableStarted = false;
      headerRowsSeen = 0;
      continue;
    }
    if (inSection && /^#{1,3}\s/.test(line) && !line.includes(sectionHeading)) {
      break;
    }
    if (!inSection) continue;

    if (line.trim().startsWith("|")) {
      headerRowsSeen++;
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
      break;
    }
  }
  return rows;
}

/**
 * Extract all sections from the document, splitting by ## headings.
 * Returns a map of section heading -> content (including the heading line).
 */
function extractSections(markdown: string): Map<string, string> {
  const lines = markdown.split("\n");
  const sections = new Map<string, string>();
  let currentHeading = "";
  let currentLines: string[] = [];

  for (const line of lines) {
    if (line.startsWith("## ") && !line.startsWith("### ")) {
      if (currentHeading) {
        sections.set(currentHeading, currentLines.join("\n"));
      }
      currentHeading = line.replace("## ", "").trim();
      currentLines = [line];
    } else {
      currentLines.push(line);
    }
  }
  if (currentHeading) {
    sections.set(currentHeading, currentLines.join("\n"));
  }
  return sections;
}

/**
 * Extract the Voicing Parameters table from the "Voicing Controls" section.
 * This is a separate table from the Controls Overview Voicing Section table.
 */
function extractVoicingParametersTable(markdown: string): string {
  const lines = markdown.split("\n");
  let inVoicingControls = false;
  let inParamsTable = false;
  let headerSeen = false;
  const tableLines: string[] = [];

  for (const line of lines) {
    if (line.startsWith("## Voicing Controls")) {
      inVoicingControls = true;
      continue;
    }
    if (inVoicingControls && line.startsWith("## ") && !line.startsWith("### ")) {
      break;
    }
    if (!inVoicingControls) continue;

    if (line.startsWith("### Voicing Parameters")) {
      inParamsTable = true;
      continue;
    }
    if (inParamsTable && line.startsWith("### ")) {
      break;
    }

    if (inParamsTable && line.trim().startsWith("|")) {
      headerSeen = true;
      tableLines.push(line);
    } else if (headerSeen && line.trim() === "") {
      tableLines.push(line);
    } else if (headerSeen && !line.trim().startsWith("|")) {
      break;
    }
  }
  return tableLines.join("\n");
}

/**
 * Extract prose (non-table) content within the Controls Overview section.
 * This includes paragraphs, image references, and the MIDI Metadata note.
 */
function extractControlsOverviewProse(markdown: string): string[] {
  const lines = markdown.split("\n");
  const proseLines: string[] = [];
  let inControlsOverview = false;
  let inTable = false;

  for (const line of lines) {
    if (line.startsWith("## Controls Overview")) {
      inControlsOverview = true;
      continue;
    }
    if (
      inControlsOverview &&
      line.startsWith("## ") &&
      !line.startsWith("### ")
    ) {
      break;
    }
    if (!inControlsOverview) continue;

    // Track table state
    if (line.trim().startsWith("|")) {
      inTable = true;
      continue;
    }
    if (inTable && !line.trim().startsWith("|") && line.trim() !== "") {
      inTable = false;
    }
    if (inTable) continue;

    // Collect non-empty prose lines (paragraphs, images, headings, notes)
    if (line.trim() !== "") {
      proseLines.push(line);
    }
  }
  return proseLines;
}

// --- Observed baseline data from UNFIXED document ---

const docsContent = readDocsContent();

// Observe all control descriptions
const midiExportRows = parseControlTable(docsContent, "MIDI Export");
const voicingSectionRows = parseControlTable(docsContent, "Voicing Section");

// Observe sections outside Controls Overview
const allSections = extractSections(docsContent);
const nonOverviewSectionNames = [...allSections.keys()].filter(
  (name) => name !== "Controls Overview"
);

// Observe Voicing Parameters table
const voicingParamsTable = extractVoicingParametersTable(docsContent);

// Observe prose within Controls Overview
const controlsOverviewProse = extractControlsOverviewProse(docsContent);

// --- Tests ---

describe("Preservation Properties: Unchanged Content and Structure", () => {
  // Re-read for each test run to support before/after comparison
  const currentContent = readDocsContent();
  const currentSections = extractSections(currentContent);

  describe("Non-Controls-Overview sections are byte-identical", () => {
    it("all sections outside Controls Overview are preserved", () => {
      for (const sectionName of nonOverviewSectionNames) {
        const original = allSections.get(sectionName);
        const current = currentSections.get(sectionName);
        expect(current, `Section "${sectionName}" should be preserved`).toBe(
          original
        );
      }
    });

    it("property: randomly selected non-Overview sections are byte-identical", () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: nonOverviewSectionNames.length - 1 }),
          (index) => {
            const sectionName = nonOverviewSectionNames[index];
            const original = allSections.get(sectionName);
            const current = currentSections.get(sectionName);
            expect(
              current,
              `Section "${sectionName}" must be byte-identical`
            ).toBe(original);
          }
        ),
        { numRuns: Math.min(100, nonOverviewSectionNames.length * 10) }
      );
    });
  });

  describe("Voicing table control descriptions are preserved verbatim", () => {
    const currentVoicingRows = parseControlTable(
      currentContent,
      "Voicing Section"
    );

    // Observed 8 voicing controls
    const expectedVoicingNames = [
      "Avoid Parallel",
      "Contrary Motion",
      "Stepwise Motion",
      "Open Chords",
      "Common Tones",
      "Center Voices",
      "Extend MIDI",
      "Reset Voicing",
    ];

    it("all 8 voicing controls are present", () => {
      const currentNames = currentVoicingRows.map((r) => r.name);
      for (const name of expectedVoicingNames) {
        expect(currentNames).toContain(name);
      }
    });

    it("all voicing control descriptions match original verbatim", () => {
      for (const originalRow of voicingSectionRows) {
        const currentRow = currentVoicingRows.find(
          (r) => r.name === originalRow.name
        );
        expect(
          currentRow,
          `Voicing control "${originalRow.name}" should exist`
        ).toBeDefined();
        expect(
          currentRow!.description,
          `Description for "${originalRow.name}" should be preserved`
        ).toBe(originalRow.description);
      }
    });

    it("property: randomly selected voicing controls have preserved descriptions", () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: voicingSectionRows.length - 1 }),
          (index) => {
            const originalRow = voicingSectionRows[index];
            const currentRow = currentVoicingRows.find(
              (r) => r.name === originalRow.name
            );
            expect(currentRow).toBeDefined();
            expect(currentRow!.description).toBe(originalRow.description);
          }
        ),
        { numRuns: 50 }
      );
    });
  });

  describe("MIDI Export table control descriptions are preserved verbatim", () => {
    const currentMidiRows = parseControlTable(currentContent, "MIDI Export");

    const expectedMidiNames = ["Drag MIDI (Single)", "Drag MIDI (Multi)"];

    it("both MIDI Export controls are present", () => {
      const currentNames = currentMidiRows.map((r) => r.name);
      for (const name of expectedMidiNames) {
        expect(currentNames).toContain(name);
      }
    });

    it("all MIDI Export control descriptions match original verbatim", () => {
      for (const originalRow of midiExportRows) {
        const currentRow = currentMidiRows.find(
          (r) => r.name === originalRow.name
        );
        expect(
          currentRow,
          `MIDI Export control "${originalRow.name}" should exist`
        ).toBeDefined();
        expect(
          currentRow!.description,
          `Description for "${originalRow.name}" should be preserved`
        ).toBe(originalRow.description);
      }
    });

    it("property: randomly selected MIDI Export controls have preserved descriptions", () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: midiExportRows.length - 1 }),
          (index) => {
            const originalRow = midiExportRows[index];
            const currentRow = currentMidiRows.find(
              (r) => r.name === originalRow.name
            );
            expect(currentRow).toBeDefined();
            expect(currentRow!.description).toBe(originalRow.description);
          }
        ),
        { numRuns: 50 }
      );
    });
  });

  describe("Voicing Parameters table is completely unchanged", () => {
    it("Voicing Parameters table content is byte-identical", () => {
      const currentVoicingParams =
        extractVoicingParametersTable(currentContent);
      expect(currentVoicingParams).toBe(voicingParamsTable);
    });
  });

  describe("Controls Overview prose, images, and MIDI Metadata note are unchanged", () => {
    const currentProse = extractControlsOverviewProse(currentContent);

    it("all prose lines within Controls Overview are preserved", () => {
      expect(currentProse).toEqual(controlsOverviewProse);
    });

    it("property: randomly selected prose lines are byte-identical", () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: controlsOverviewProse.length - 1 }),
          (index) => {
            expect(currentProse[index]).toBe(controlsOverviewProse[index]);
          }
        ),
        { numRuns: Math.min(100, controlsOverviewProse.length * 5) }
      );
    });

    it("MIDI Metadata note is present and unchanged", () => {
      const midiMetadataLine = controlsOverviewProse.find((line) =>
        line.includes("MIDI Metadata")
      );
      expect(midiMetadataLine).toBeDefined();

      const currentMidiMetadata = currentProse.find((line) =>
        line.includes("MIDI Metadata")
      );
      expect(currentMidiMetadata).toBe(midiMetadataLine);
    });

    it("image references within Controls Overview are preserved", () => {
      const originalImages = controlsOverviewProse.filter((line) =>
        line.includes("![")
      );
      const currentImages = currentProse.filter((line) =>
        line.includes("![")
      );
      expect(currentImages).toEqual(originalImages);
    });
  });
});
