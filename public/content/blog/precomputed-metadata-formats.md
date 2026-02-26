# Precomputed Music-Theory Metadata: Packed JSON Formats for Fast, Reliable Harmony

Audio software often wants sophisticated harmonic intelligence—Roman numerals, chord spelling, chord reduction, and voice-leading—yet it must remain fast, deterministic, and easy to validate. A practical way to achieve that is **precomputation**: compute music-theory facts offline using a trusted theory engine, then ship compact lookup tables that runtime code can load quickly and rely on.

This post explains a set of **packed JSON formats** designed for that approach: how they’re used, why they beat hard-coded rules, and the trade-offs involved.

---

## The core idea: compute once, look up forever

Instead of implementing a Roman-numeral parser, chord-spelling rules, and reduction heuristics directly in production code, you:

- compute authoritative results offline
- pack them into compact JSON structures
- load them once at startup
- do fast lookups during UI rendering and playback

At runtime, your logic becomes “apply metadata” rather than “derive theory.”

---

## How it’s used (conceptual data flow)

A typical flow looks like this:

```text
offline generator (music theory engine)
  -> packed JSON assets
     -> embedded or shipped with the app
        -> parsed at startup into in-memory caches
           -> O(1)-ish lookups during:
              - UI chord spelling
              - chord-tone selection / reduction
              - voice-leading scoring (tendency tones)
              - MIDI marker text (if applicable)
```

This keeps runtime code lean and predictable, and pushes complex theory to the offline toolchain where it can be tested thoroughly.

---

## Shared design choices across the formats

These formats share a few principles that matter a lot in practice:

- **Versioning**
  - `v` is a small integer that allows schema evolution.
- **String interning**
  - Repeated strings are stored once in arrays and referenced by index:
    - `t`: token strings (normalized Roman tokens)
    - `k`: key strings (for spelled-by-key tables)
    - `s`: shared symbol strings (display strings)
- **Array-packed records**
  - Dense arrays like `[ti, rr, rb, pm]` avoid repeating JSON object keys thousands of times.
- **Bitmasks where possible**
  - Pitch-class sets fit naturally into a 12-bit integer mask.

These choices reduce asset size and parsing overhead without requiring a custom binary format.

---

## Roman token normalization (important runtime contract)

Many systems normalize tokens by stripping suffixes after `_`:

- Input token: `V65_1/4`
- Normalized token: `V65`

The packed tables should therefore use **normalized tokens** as their keys, so lookups are stable and deterministic.

---

## Format 1: chord-tone “truth” (`RomanNotesTruth`)

### Purpose

This format is the authoritative mapping from a Roman token to:

- chord **relative root** pitch class
- chord **relative bass** pitch class
- chord-tone **pitch class set** (relative to the key tonic)

### Packed JSON shape

```json
{
  "v": 1,
  "t": ["I", "V7", "V65", "i"],
  "M": [
    [0, 0, 0, 145],
    [1, 7, 7, 2341],
    [2, 7, 11, 2341]
  ],
  "m": [
    [3, 0, 0, 137]
  ]
}
```

### Entry meaning

Each entry is:

`[ti, rr, rb, pm]`

- `ti`: token index into `t`
- `rr`: relative root pitch class `0..11`
- `rb`: relative bass pitch class `0..11`
- `pm`: 12-bit pitch-class mask (bit `b` means rel pitch class `b` is present)

### Why the pitch-class mask is a win

- **Order-free**: no ambiguity about ordering of pitch classes.
- **Compact**: one integer vs an array.
- **Fast invariants**:
  - “mask contains root/bass”
  - subset checks
  - union/intersection operations

---

## Format 2: spelled chord symbols by key (`RomanChordSymbolsByKey`)

### Purpose

Return a high-quality **display chord symbol string** for a given:

- mode (major/minor)
- key (e.g., `C`, `Eb`, `F#`)
- Roman token

This is mainly for UI and export contexts where enharmonic spelling matters.

### Packed JSON shape

```json
{
  "v": 1,
  "t": ["I", "V65", "i"],
  "k": ["C", "Db", "A"],
  "s": ["C", "G7/B", "Am", "Ab"],
  "R": [
    [0, 0, 0, 0],
    [0, 0, 1, 1],
    [0, 1, 0, 3],
    [1, 2, 2, 2]
  ]
}
```

### Record meaning

Each record is:

`[mi, ki, ti, si]`

- `mi`: mode index (`0` major, `1` minor)
- `ki`: key index into `k`
- `ti`: token index into `t`
- `si`: symbol index into `s`

Lookup returns `s[si]`.

### Interesting nuance: real harmonic vocabularies are messy

A “major-mode record” can legitimately reference a token that is only present in the minor “truth” format (and vice versa), due to borrowed/chromatic usage. That’s not a defect—just a reminder that “mode” is contextual, and consistency checks should reflect musical reality.

---

## Format 3: chord-tone reduction hints (`RomanChordReduceHints`)

### Purpose

SATB-style voicing typically wants **≤ 4 pitch classes**, but many Roman chords contain more than four. This format provides compact, token-specific guidance for what to keep and what to drop.

### Packed JSON shape

```json
{
  "v": 1,
  "t": ["V7"],
  "M": [
    [0, 2176, 2080, 4, [7, 11, 5, 2]]
  ],
  "m": [
    [0, 2176, 2080, 4, [7, 11, 5, 2]]
  ]
}
```

### Entry meaning

`[ti, g, e, o, p]`

- `ti`: token index
- `g`: guide-tone mask (12-bit)
- `e`: essential-tone mask (12-bit)
- `o`: omit mask (12-bit)
- `p`: priority list of relative pitch classes (high priority first)

### Runtime usage (typical)

When a chord is too dense:

- keep bass (from the truth format)
- prefer tones in `e`/`g`
- fill remaining voices by `p` order
- avoid tones indicated by `o` when possible

### Why this beats hard-coded heuristics

- It localizes musical decisions to data.
- Fixing a single chord class doesn’t require adding branching logic.
- It aligns runtime voicing with whatever the offline theory engine considers “essential.”

---

## Format 4: tendency tone resolutions (`RomanTendencyResolutions`)

### Purpose

Encode preferred resolutions for tendency tones (leading tone, chordal 7th, suspensions, etc.) so voice-leading can be biased toward smoother motion.

### Packed JSON shape

```json
{
  "v": 1,
  "t": ["V7"],
  "M": [
    [0, [11, 0, 255], [5, 4, 204]]
  ],
  "m": [
    [0, [11, 0, 255], [5, 4, 204]]
  ]
}
```

### Entry meaning

`[ti, ...triples]`

Each triple is:

`[fromRelPc, toRelPc, strength_u8]`

Where:

- `strength_u8` is `1..255` (often interpreted as `strength = strength_u8 / 255.0`)

### Subtle but important: `fromRelPc` may not be a chord tone

Because this can encode suspensions/approach tones, `fromRelPc` is not guaranteed to appear in the chord-tone mask of the associated token. That’s musically useful: voice-leading often involves non-chord tones resolving into chord tones.

---

## Benefits of precomputation (and not hard-coding)

- **Correctness**
  - You can rely on an established theory engine for spelling and chord interpretation.
- **Determinism**
  - Lookups remove runtime ambiguity and edge-case parsing behavior.
- **Performance**
  - Parsing once at startup is far cheaper than repeated runtime inference.
- **Maintainability**
  - Musical changes become data regeneration, not invasive code edits.
- **Testability**
  - Data is easy to validate: bounds, uniqueness, cross-format invariants, and golden fixtures.

---

## Trade-offs and costs

- **More build-time complexity**
  - You need a generator and validation tests.
- **Schema evolution**
  - Once shipped, you must treat formats as APIs:
    - versioning
    - backward compatibility (or migration)
- **Debugging shifts**
  - Many failures become “data issues” (missing records, unexpected tokens), not “logic bugs.”

---

## Space-saving considerations (why not just use “normal JSON”?)

A naive JSON format might repeat huge amounts of text:

```json
{ "token": "V65", "key": "C", "symbol": "G7/B" }
```

Packed formats avoid that overhead via:

- interning (`t`, `k`, `s`)
- bitmasks for pitch-class sets
- array-packed records

Could a binary format be smaller? Yes. But packed JSON has two major advantages:

- it’s still inspectable
- it’s easy to validate with standard tooling

That’s often the right trade during active development.

---

## Self-consistency: what to validate

The most useful invariants are the ones runtime relies on:

- `v` is supported
- required top-level keys exist and have correct types
- indices are in range (`ti`, `ki`, `si`)
- token lists are unique and non-empty
- records are unique per lookup key (e.g., `(mode, key, token)`)
- masks are within `0..(2^12 - 1)`

It’s also important to treat musical nuance carefully:

- a symbol lookup record’s `mode` does not necessarily imply the token exists in the chord-tone truth format in that same mode
- tendency tone `fromRelPc` may be a suspension/approach tone rather than a chord tone

Validation should enforce real runtime requirements without banning musically valid data.

---

## Ease of parsing vs. time/space

There’s a spectrum:

- verbose JSON objects (easiest to inspect, largest)
- packed JSON (still inspectable, much smaller)
- custom binary (smallest and fastest, hardest to debug)

Packed JSON is often a strong middle ground: you pay a one-time startup parse and get fast, deterministic lookups thereafter.
