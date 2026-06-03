---
title: "Roadmap"
description: "See what's coming next for LucidHarmony. Planned features and improvements."
---

# LucidHarmony Product Roadmap

## Version Overview

| Version | Theme | Status |
|---------|-------|--------|
| 1.3.x | NCT voicer, editor polish, bug fixes | In progress |
| 1.4 | Interactive editing and guided generation | Planned |
| 1.5 | Phrase-level intelligence | Planned |
| 2.0 | Multi-model and live performance | Planned |
| 3.0 | New frontiers | Exploratory |

---

## v1.3.x — NCT Voicer and Editor Polish

Stabilise the current feature set, fix known bugs, and ship the NCT voicer.

| # | Feature | Effort | Status | Source |
|---|---------|--------|--------|--------|
| 1 | NCT voicer: data loading, pitch realization, timing, MIDI export | Large | In progress | spec: nct-voicer |
| 2 | NCT logit biasing in beam search | Small | Done | spec: nct-voicer |
| 3 | Editor UX bug fixes (post-delete selection, empty-tape bubble, Reset label) | Small | Specified | spec: editor-ux |
| 4 | Classifier voicing rules audible verification (aug6, Neapolitan, consonant) | Small | Needs testing | STATE_OF_PLAY |
| 5 | Token expansion in training pipeline (full figured bass notation) | Medium | Planned | TOKEN_EXPANSION_TRAINING |
| 6 | Additional composer models | Medium | Ongoing | Customer feedback |

---

## v1.4 — Interactive Editing and Guided Generation

Make the chord tape a fully interactive editing surface and add harmonic constraint painting.

| # | Feature | Effort | Status | Source |
|---|---------|--------|--------|--------|
| 1 | Chord tape editor: select, replace, insert, delete, rearrange, context menu | Large | Specified | spec: chord-tape-editor |
| 2 | Guided generation: pin harmonic functions to positions, AI fills the rest | Large | Specified | spec: guided-generation |
| 3 | Harmonic graph explorer: multi-depth branching tree with audition and commit | Large | Specified | spec: harmonic-graph-explorer |
| 4 | Function-biased beam search (tokens grouped by function for O(1) filtering) | Medium | Planned | STATE_OF_PLAY |
| 5 | Fast indices metadata v4 (prerequisite for function-biased beam search) | Low | Planned | STATE_OF_PLAY |
| 6 | UI scaling: dropdown 50–200%, drag-to-resize, font scaling, persistence | Medium | Planned | UI_SCALING_PLAN |

---

## v1.5 — Phrase-Level Intelligence

Give the generator awareness of musical form: cadences, tension arcs, and position within a phrase.

| # | Feature | Effort | Status | Source |
|---|---------|--------|--------|--------|
| 1 | Cadence-aware generation: place cadence markers (PAC, Plag, HC, DC, IAC), bias generation toward cadence targets | Large | Specified | spec: cadence-aware-generation |
| 2 | Harmonic tension curve: drawable curve that modulates temperature, complexity, and function bias per position | Large | Specified | spec: harmonic-tension-curve |
| 3 | Global position awareness: model considers overall arc, avoids premature resolution | Medium | Not specified | Customer feedback |

---

## v2.0 — Multi-Model and Live Performance

Blend composer styles in real time and stream chords live during DAW playback.

| # | Feature | Effort | Status | Source |
|---|---------|--------|--------|--------|
| 1 | Cross-model blending: load up to 4 models, weighted logit interpolation, blend mixer UI | Large | Specified | spec: cross-model-blending |
| 2 | Infinite mode: real-time MIDI streaming, DAW transport sync, scrolling tape, capture/export | Large | Planned (7 phases) | infinite-mode-plan |
| 3 | Granular block size / corpus quoting: retrieval-based generation using building blocks from training corpus | Large | Not specified | Customer feedback |

---

## v3.0 — New Frontiers (Exploratory)

Major expansions beyond the current product scope.

| # | Feature | Effort | Status | Source |
|---|---------|--------|--------|--------|
| 1 | Melody generation | Very large | Not specified | Customer feedback |
| 2 | Per-monitor DPI awareness and responsive breakpoints | Medium | Not specified | UI_SCALING_PLAN |
| 3 | Accessibility: high contrast, large text, keyboard navigation | Medium | Not specified | UI_SCALING_PLAN |

---

## Confirmed Dead Ends

These have been evaluated and rejected.

- Bloom filter for token lookup (already O(log n) at 2800 tokens)
- Cached voicing solutions (beam search is fast enough)
- Harmonic rhythm patterns / phrase templates (out of scope)
- Style-specific constraints in metadata (better expressed as UI parameters)
- Percentage probability display in constellation (harmonic role is more useful)

---

## Sources

- `.kiro/specs/` — Formal requirement and design specs
- `docs/STATE_OF_PLAY.md` — Session handoff document with completed work and remaining tasks
- `docs/infinite-mode-plan.md` — Phased infinite mode implementation plan
- `docs/UI_SCALING_PLAN.md` — UI scaling implementation plan
- `docs/NCT_VOICER_SPEC.md` — NCT voicer integration spec
- `docs/TOKEN_EXPANSION_TRAINING.md` — Training pipeline modernisation plan
- `docs/ludmil-feature-ideas.md` — Customer feature ideas
