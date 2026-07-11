---
title: "Shipping Continuously: Moving a JUCE Plugin's Brain to Rust"
description: "How we migrated LucidHarmony's domain logic from C++ to Rust without pausing releases — a hybrid architecture that keeps shipping while the brain moves languages."
date: "2026-07-05"
readTime: "14 min read"
tags: ["rust", "architecture", "plugin", "c++", "migration"]
---

*Published: July 5, 2026 · 14 min read*

# Shipping continuously: moving a JUCE plugin’s brain to Rust

We build a real-time MIDI harmony plugin. The product is not a toy: host formats, a substantial editor, ONNX models, voice-leading heuristics, follow-mode concurrency, presets, licensing—the whole stack has to keep working every week.

We wanted more of the *domain* in Rust—clearer types, fewer footguns, a path toward a future non-JUCE shell—without pausing releases for a multi-month rewrite. So we did the boring, professional thing: we migrated the brain first and left the face and hands where they were.

This is how that hybrid migration went, what we learned, and why “always shippable” beat “rewrite the world.”


## The constraint that shaped everything

A greenfield “Rust plugin framework only” rewrite would have meant:

- Rebuilding AU / VST3 / CLAP hosting and packaging  
- Rebuilding the entire UI  
- Rewriting inference, MIDI, and concurrency *at the same time*  
- Months without a mergeable main branch  

We refused that trade. The rule was simple:

> **Main always ships.** Domain moves into Rust in thin slices. The editor, host formats, and packaging stay on JUCE until there is a deliberate reason to change them.

That rule eliminated most of the interesting-but-deadly options (full shell swap, UI framework rewrite, “stop the world until parity”).


## What “hybrid” means in practice

Think of the plugin as three layers:

- **Shell** — Formats, process callback glue, parameters, editor chrome. Lives in JUCE / C++.
- **Domain** — Models, logits, metadata, generation, voicing, MIDI event construction, follow compute, preset JSON. Lives in Rust.
- **Boundary** — Stable C ABI + thin C++ façades that used to *be* the domain. A C header + `extern "C"`.

The product still looks like a normal JUCE plugin to the host. Internally, the expensive and fragile logic runs in a Rust dynamic library loaded beside the plugin binary.

We deliberately did **not** start with “replace the GUI” or “replace the plugin framework.” Those are product bets. Migrating domain logic is an engineering bet with a clearer payoff and a safer rollback story.


## Why Rust for this domain (not as religion)

For our codebase, Rust earned its keep in a few concrete ways:

**Ownership at the edges.** Chord sequences, vocab tables, ONNX sessions, and scratch buffers stop being “who frees this, and on which thread?” puzzles when the ownership model is explicit.

**Fearless pure functions.** Temperature scaling, logit masking, pitch-class sets, and voice-leading cost helpers are pure compute. They map cleanly to Rust modules with unit tests that don’t need a DAW.

**A real package story for ML runtime.** Pulling ONNX Runtime through a maintained crate, with explicit feature flags for TLS and binary download, is more boring—and more reproducible—than a one-off CMake treasure hunt per platform.

**A future-proof core.** If we ever leave JUCE for another shell, the domain crate is already the portable product. We paid for portability *without* paying for a shell rewrite on day one.

What we did *not* claim: that Rust would magically fix product design, or that C++ was “bad.” JUCE remains excellent at what it does—host integration and a mature editor stack.


## The migration pattern: strangler, not big bang

We ordered work by **risk × isolation**, easiest leaves first:

1. **Scaffold** — Cargo workspace, library artifact, CMake (or equivalent) build/link, CI cache for the toolchain. Zero behavior change.  
2. **Pure helpers** — Logits, small voice-leading kernels. Dual-run or golden parity tests against the old C++.  
3. **Metadata engines** — Roman numerals, NCT tables, JSON/bytes in, query APIs out.  
4. **ONNX engine** — Session lifecycle and forward passes behind a narrow interface.  
5. **Orchestration** — Full generation / continuation / alternatives pipeline calling the pieces above.  
6. **MIDI emission** — Note event construction in Rust; host `MidiBuffer` / file / drag still JUCE.  
7. **Follow-mode compute** — Pure selection and scoring in Rust; worker threads and atomics can stay C++ for the MVP.  
8. **Presets (optional)** — Serde JSON round-trips; license HTTP stayed C++ on purpose.  
9. **Cleanup** — Thin façades only, docs, declare hybrid MVP done.

Each phase was mergeable. If phase *n* was wrong, phase *n−1* still shipped.

That ordering matters more than any individual crate choice. Pure functions first teach you the FFI and packaging story when the blast radius is still small. ONNX and orchestration come after the boundary is boring.


## The boundary: a C ABI you can live with

Rust and C++ do not share a type system. We treated the boundary like a public API:

- Opaque handles for long-lived objects (engines, sessions, loaded metadata).  
- Explicit create / destroy pairs.  
- POD structs and plain buffers for request/response where possible.  
- Error codes (or length-prefixed status) instead of C++ exceptions across the fence.  
- UTF-8 bytes with clear ownership: “caller frees” or “library frees with this function,” never both.

Conceptually:

```c
typedef struct LhDomainEngine LhDomainEngine;

LhDomainEngine* lh_engine_create(void);
void            lh_engine_destroy(LhDomainEngine*);

int lh_engine_load_model(LhDomainEngine*,
                         const uint8_t* bytes,
                         size_t         len);

int lh_engine_generate(/* engine, inputs… */,
                       /* out buffers… */);
```

On the C++ side, the old class names often remained so the editor and processor barely noticed:

```cpp
class ModelInference {
public:
    // Public surface unchanged for callers…
    GenerationResult generate(const GenerateRequest& req);

private:
    // Implementation is now a handle + FFI calls, not 1k lines of domain logic.
    LhDomainEngine* engine_ = nullptr;
};
```

The psychological trick: **rename nothing at the call site until the last possible moment.** Move behavior under the façade first; renames are a separate PR.


## Linking reality: prefer a cdylib for ML runtimes

Our first instinct was a static library: one big archive, link once, done. That fell over once ONNX Runtime entered the picture—duplicate symbols, protobuf collisions, and “who owns this global” fights between static archives.

We switched to a **dynamic library** for the domain crate:

- Rust builds a `cdylib`.  
- The plugin links against it.  
- Build scripts copy the domain dylib *and* any ORT runtime dylibs next to the plugin bundle.  
- CI and local scripts treat those copies as part of packaging, not as an afterthought.

Static linking can still be right for tiny pure-Rust domains. As soon as you pull a large C++-backed ML runtime, dynamic linkage is often the path of least pain.

Feature flags on the ORT crate also mattered: download prebuilt binaries, native TLS for the download path, and copy dylibs into a known output directory. “It works on my machine” is not a release strategy.


## Parity tests: the only way hybrid stays honest

We kept the existing C++ test harness for integration and added two new habits:

**Rust unit tests** for pure modules—fast, no plugin process, no host.

**Cross-boundary parity tests** that feed the same bytes/inputs into old expectations (or dual implementations during transition) and compare:

- Logit masks and temperature curves  
- Metadata lookups  
- Generated token sequences under fixed RNG seeds  
- MIDI event lists (pitch, velocity, time) within documented tolerances  

A few bugs only showed up when tests assumed IEEE infinity for “masked” logits while the production path used a large negative sentinel. Hybrid migrations surface *latent* inconsistencies; budget time to decide which side was “right” instead of blindly matching the old bug.

Determinism is a feature. Seed everything you can. Follow-mode and UI-adjacent paths will still need host-level smoke tests; don’t pretend unit tests replace a DAW.


## What stayed in C++ on purpose

Leaving things in C++ was not failure; it was scope control.

**Editor and layout** — JUCE components, look-and-feel, tab structure. A GUI rewrite is a product project, not a free side effect of a domain migration.

**Host formats and packaging** — AU in particular is still table stakes for many macOS users. We did not couple domain Rust to a shell that weakens AU.

**Realtime thread policy** — The audio callback still has to be careful. We kept allocation-sensitive paths conservative: prepare work on the worker side, pass results across with existing patterns, avoid “surprise” heap traffic in the callback just because Rust made it easier to write.

**Licensing HTTP** — Network + store integration stayed where it already worked. Preset *JSON* was worth porting; license client was not required for the MVP.

If something was JUCE-shaped or ship-critical and low-algorithm, it stayed put.


## Pain points (so you can skip our scars)

**Asset loading.** Models and metadata often live as embedded binary resources in the plugin. The cleanest boundary is: C++ resolves bytes (or a path), Rust only accepts bytes. Don’t make the domain crate learn your resource compiler.

**Pointer invalidation across FFI.** Building maps of string views into a vector you then reallocate is still a bug in any language. Two-pass “store owned strings, then build maps of indices” saved us more than once.

**Complexity bias / warm metadata.** Orchestration layers that assume “roman metadata is loaded because generation ran” will break alternatives-only paths. Load unified metadata at model load time; don’t rely on incidental side effects.

**Test doubles and distribution tests.** When generation moves languages, statistical tests of alternative distributions need the same metadata warm-up as production. Failures here look like “Rust is wrong” when the real issue is incomplete fixture setup.

**Dylib hell on macOS.** `@rpath`, bundle layout, and “works in the IDE, fails in the host” are packaging problems. Solve them in the build graph early, not the week you ship a release candidate.


## What we got for the effort

- A **shippable hybrid**: domain in Rust, product still a normal JUCE plugin.  
- A **narrow, documented ABI** that future shells can call.  
- **Faster iteration** on pure music logic without spinning a full plugin build for every experiment (cargo test for the core; full suite when the boundary moves).  
- A **honest stop line**: GUI framework and plugin shell are separate decisions, not entangled with “we rewrote inference.”

We did not get a free rewrite of the UI. We did not magically delete concurrency bugs in the worker that still lives in C++. We got a portable brain and a calmer path forward.


## Should you do this?

**Yes, if:**

- You have a thick domain (models, rules, music theory, offline-ish compute) separate from widgets.  
- You must keep shipping on an existing framework.  
- You can invest in packaging and parity tests.  
- You’re willing to leave the editor alone for a while.

**No (or not yet), if:**

- Your “domain” *is* the UI and host glue.  
- You cannot ship a dylib next to the plugin.  
- You need a full shell migration *immediately* for business reasons (then hybrid is a detour—own that).  
- Nobody will maintain the FFI; an abandoned boundary is worse than boring C++.


## What’s next (and what isn’t)

Next product work can stay on the hybrid: fix follow-mode edge cases, polish UI, ship presets—users feel those.

Next *platform* work is optional and ordered carefully:

1. Harden packaging and CI on every target OS.  
2. Optionally experiment with a new UI toolkit in a **lab** window or standalone—not as a forced tab embed.  
3. Revisit a non-JUCE plugin shell only when the audio unit story and GUI stack are deliberate choices, not side effects.

The hybrid migration’s job was to make those later decisions *cheaper*, not to force them.


## Closing

Rewrites fail when they try to replace the product and the architecture in one move. We replaced the architecture of the *domain* and left the product’s face on a mature framework.

Rust is the brain. JUCE is still the body that walks into the DAW. The C ABI is the nervous system between them—and like any nervous system, it should be thin, boring, and well tested.

If you take one idea from our migration, take this: **optimize for continuous shipment, not for purity of stack.** Purity can come later, one layer at a time, when the domain already trusts itself.
