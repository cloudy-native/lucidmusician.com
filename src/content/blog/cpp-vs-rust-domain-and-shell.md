---
title: "C++ vs Rust: Domain Brains and Framework Bodies"
description: "A blunt comparison of C++ and Rust for real products—especially JUCE plugins with thick domain logic, multi-threaded features, and messy native builds."
date: "2026-07-12"
readTime: "16 min read"
tags: ["rust", "c++", "architecture", "build-systems", "concurrency", "plugin"]
---

*Published: July 12, 2026 · 16 min read*

The internet is full of C++ vs Rust essays that score points on memory safety, compile times, and ideology. This one is written from a different seat: we ship a real-time MIDI harmony plugin. The **shell**—host formats, editor, parameters, packaging—is JUCE and C++. The **brain**—generation, metadata, logits, ONNX orchestration, MIDI event construction, follow-mode compute—is increasingly Rust.

We are not here to crown a universal winner. We are here to name, without euphemism, **why certain features and bugs have been painful in C++**, what Rust actually buys for *our* shape of code, and why **build and dependency management** often matter as much as the type system.

If you want the migration playbook (strangler phases, C ABI, always-shippable main), that lives in [Shipping Continuously: Moving a JUCE Plugin's Brain to Rust](/blog/blog-hybrid-rust-migration). This post is the comparative argument underneath that choice.

---

## The angle that matters for us

Most comparisons assume you are choosing a language for a **greenfield** binary. We are not. We are choosing languages for **layers**:

| Layer | Job | Default language |
|--------|-----|------------------|
| **Shell** | AU/VST3/CLAP, process callback, APVTS, editor, installers, notarization | C++ / JUCE |
| **Domain** | Pure-ish music logic, model I/O, structured data, tests without a DAW | Rust |
| **Glue** | Stable C ABI, packaging dylibs next to the plugin | Both, deliberately boring |

That split is not fashion. It is a response to a recurring pattern:

> **Our hardest bugs were rarely “the algorithm is wrong.”**  
> They were “the algorithm is right on three threads, wrong on the fourth, and the UI still shows last week’s settings.”

C++ is excellent at talking to hosts and drawing UIs through a mature framework. It is a harsh place to grow a multi-threaded, state-heavy **domain** without relentless discipline—discipline that the language does not enforce by default.

Rust flips that default for the domain. It does not magically fix product design. It changes which mistakes are *cheap* to make.

---

## What people mean when they say “C++ is hard”

They often mean different things. We mean these, specifically.

### 1. Shared mutable state is the product

A modern plugin is not a pure function from MIDI in to MIDI out. It is:

- an **audio/MIDI callback** that must not block  
- a **message/UI thread** that mutates parameters and layout  
- **worker threads** for ONNX, infinite generation, follow-mode jobs  
- **export paths** that re-enter generation while playback continues  
- **history/undo** that wants snapshots of everything  

In C++, all of that is “just” `std::vector`, raw or smart pointers, atomics if you remember them, and a mutex if you invent the right one. The type system will not stop you from:

- reading `lastGeneratedSequence` on the UI while a worker resizes it  
- calling into an ONNX session from export while infinite mode holds it  
- keeping a raw pointer to a playback snapshot that another path frees  
- wiring a Follow engine that **never receives** `updateSettings()` because nothing in the type graph forces the call  

We have lived variants of all of those. Hundreds of unit tests can pass while integration seams are on fire—because tests often serialize what production interleaves.

Rust does not eliminate concurrency bugs. It makes **shared mutable state** the expensive, explicit choice (`Mutex`, channels, interior mutability with intent) instead of the silent default of “member fields, hope the threads behave.”

For domain objects that *should* be owned by one place and passed as values or messages, that default is transformative. For audio-thread realtime code with custom lock-free designs, you still need expertise in any language—including `unsafe` Rust. We are not claiming borrow-checker cosplay replaces DSP discipline.

### 2. Features fail at the seams, not in the math

Recent hard features in our world:

**Follow mode (“harmony follows you”).**  
The pure selection problem is already non-trivial. The *product* problem is worse: settings must flow from parameters → engine → worker jobs → results → tape/sequence → UI, under live MIDI, without racing export or infinite mode. In C++, missing one call site (settings never applied) is a silent product bug. The compiler is happy. Users are not.

**Mode soup.**  
Create vs Follow, infinite mode, bar-length thresholds that also mean “infinite”—three signals that mean overlapping things. C++ will let you add the fourth bool. Rust will too, if you design bad enums—but idiomatic Rust pushes you toward **sum types** and exhaustive matches so “what mode are we in?” is one question with a finite answer set.

**NCT (non-chord tones) and MIDI parity.**  
Help text says one thing, processor mask defaults say another, playback splices differently from export. That is not an AI problem. That is **cross-layer semantic drift**: strings, bitmasks, timelines, and voicing indices that are all “int-ish” in C++ and only related in the author’s head.

**Voice leading + generation orchestration.**  
Large C++ translation units full of vectors-of-vectors, optional metadata warm-up, and incidental side effects (“roman tables loaded because generation ran once”) produce bugs that look like model failures and are actually **fixture and lifecycle** failures.

These are exactly the problems where **algebraic data types, ownership, and forced exhaustiveness** earn rent. They are also the problems where a language that treats “stringly-typed state” as normal will keep billing you forever.

### 3. C++ complexity is optional until it isn’t

Modern C++ is powerful: move semantics, `unique_ptr` / `shared_ptr`, concepts, ranges, coroutines. The cost is that **every codebase invents a dialect**.

- Which types are movable? Which are copyable by accident?  
- Is this reference a borrowed view into a vector about to reallocate?  
- Is `const` a real invariant or a polite suggestion on a logical `mutable` cache?  
- Did someone store a `juce::String` as a global and win the static initialization lottery on Clang while losing on MSVC?

We hit the last one for real: nontrivial global constructors, undefined init order, crashes at DLL load—fine on one toolchain, dead on another. That is not “developers are bad at C++.” That is **C++ offering enough rope to hang a shipping plugin**.

Rust’s learning curve is front-loaded and social-media-famous. C++’s learning curve is **infinite and back-loaded**: you can be productive for years and still discover a new way to get undefined behavior from a “small” change.

### 4. Undefined behavior is a product risk, not a theoretical one

Use-after-free, data races, null dereference of a failed API load, out-of-bounds on a token index—C++ can make these **time bombs**. They appear under load, under a specific DAW, under Release but not Debug, under Windows but not macOS.

Rust’s pitch is not “no bugs.” It is “a large class of bugs becomes compile errors or explicit `unsafe` islands.” For a commercial plugin, that class includes many of the bugs that destroy trust: random host crashes, “failed plugins” lists, heisenbugs on beta machines you cannot SSH into.

---

## What Rust is actually good at (for our domain)

### Ownership that matches the domain

Chord sequences, vocab tables, loaded metadata, ONNX sessions, scratch logits—these want **clear owners**. Rust’s model (move by default, borrow to use, share only with ceremony) maps cleanly onto “this engine owns the session; callers may not outlive this buffer.”

In C++, the same design is a style guide. In Rust, it is the path of least resistance.

### Pure functions and testability

Temperature curves, logit masks, pitch-class sets, cost functions, JSON table queries—these do not need JUCE. In Rust they become modules with `cargo test` feedback in seconds. In a JUCE-heavy C++ tree, “unit test” often means linking half the plugin and negotiating BinaryData, message threads, and Catch2 fixtures.

Faster pure tests do not replace host smoke tests. They do mean you can fix a mask bug without launching Logic.

### Enums and errors as design tools

`Result`, `Option`, and enums-with-data make illegal states harder to represent. C++ has `std::optional`, `std::variant`, and exceptions—or error codes, or `bool` out-params, or “empty string means missing.” Teams mix all of them. Rust’s culture is more uniform: **failure is a value**, and callers are nudged to handle it.

### Concurrency defaults

Channels and owned messages encourage “compute there, publish a result here” instead of “mutate the processor’s vectors from five call stacks.” When we split follow-mode **compute** toward Rust and leave workers/atomics in C++ for the shell, that is the design we want: pure work on one side, integration hazards isolated on the other.

### A package story for native dependencies (with caveats)

Pulling ONNX Runtime through a maintained crate with explicit features (download binaries, TLS, copy dylibs) is not frictionless—native ML runtimes never are—but it is **one dependency graph with versions in a lockfile**. Compare that to hand-rolled CPM URLs, static lib soup, CRT flags, and “it works on my runner.”

---

## Where C++ still wins (and we are not pretending otherwise)

### Ecosystem gravity: JUCE and the DAW world

Professional plugin development is still largely a **C++ story**. JUCE (and similar frameworks) give you:

- AU / VST3 / CLAP wiring  
- parameter attachments and host automation  
- editors, file choosers, drag-and-drop MIDI  
- years of host-specific scar tissue  

Rust plugin frameworks exist and are improving. They are not yet a free substitute if you need first-class AU and a large existing editor. Pretending otherwise is how rewrites die.

### Interfacing with the platform as it is

Code signing, notarization, installers, Objective-C++ corners, Windows delay-load, Apple bundle layouts—these are messy in every language. C++ + shell scripts + CI YAML is a known mess. Rust does not delete Gatekeeper.

### Realtime audio culture and examples

The literature, forum posts, and “how do I not allocate in processBlock” lore are still denser in C++. You *can* do correct realtime code in Rust; you will find more colleagues who have war stories in C++.

### When the problem is the framework, not the language

A bug in layout math, LookAndFeel, or APVTS attachment wiring is a **JUCE** problem. Moving it to Rust does not help. Knowing which layer owns the pain is half of engineering maturity.

---

## Build systems: the comparison nobody romanticizes

This is where general-purpose internet takes become personal very quickly.

### C++: a coalition of tools, not a toolchain

A realistic native plugin build looks like:

- **CMake** (or Meson/Bazel/…) as the orchestrator  
- **Ninja** or MSBuild as the workhorse  
- **vcpkg / Conan / CPM.cmake / git submodules / hand URLs** for dependencies  
- **Compiler-specific flags** (`/MT` vs `/MD`, libc++, deployment targets, architectures)  
- **Post-build scripts** to copy dylibs, fix `rpath`, embed frameworks, strip symbols  
- **CI matrices** that re-encode all of the above for three OSes  

None of this is impossible. All of it is **project-specific knowledge**. Onboarding a developer means teaching your *dialect* of CMake, not “how C++ builds.”

The JetBrains *State of C++* surveys keep rediscovering the same thing: developers spend real time **making the build work** across platforms. Flexibility is the feature and the tax.

### Rust: cargo is opinionated, and that is the point

Cargo is not just a build system. It is:

- dependency resolution + **lockfile**  
- unit/integration tests  
- feature flags  
- cross-crate documentation  
- a norm of “clone, `cargo test`, go”  

`rustup` pins toolchains. Editions manage language evolution without the “which C++ standard is this file?” fog.

The cost: you live inside Cargo’s model. Unusual layouts, custom link lines, and “please produce a dylib that CMake can find” require learning Cargo’s escape hatches. For domain libraries, that trade is usually excellent. For “I need to match JUCE’s exact plugin bundle dance,” Cargo alone is not enough—you still want CMake (or similar) at the **product** edge.

### Hybrid builds: honest about the complexity

Our shape is:

```text
CMake
  ├─ JUCE / plugin targets
  ├─ C++ façades + tests (Catch2)
  ├─ platform ORT packaging (static on Windows, shared elsewhere)
  └─ invoke Cargo → domain cdylib
       └─ copy Rust + ORT runtime libs next to plugin / tests
```

That is **more moving parts** than a pure C++ plugin. We accept it because:

1. Domain iteration gets Cargo’s loop.  
2. Product packaging keeps CMake’s control.  
3. The alternative—growing all domain complexity in C++ forever—was costing more in bugs than the hybrid costs in glue.

If someone sells you “Rust deletes build complexity” for a notarized multi-format audio plugin, they are selling a demo, not a product.

### Dependencies: crates.io vs the C++ bazaar

| Concern | Typical C++ | Typical Rust |
|---------|-------------|--------------|
| Add a library | Find a source, pick a package manager (or none), teach CMake to find it | `cargo add`, lockfile updates |
| Version conflicts | Every project’s adventure | Resolver + SemVer norms (imperfect, better defaults) |
| Transitive native libs | Your problem in five dimensions | Still your problem, but features/links are declared in-tree |
| Reproducible CI | Cache CPM, toolchains, ORT zips by hand | Cache `~/.cargo` + target dir; still cache native blobs |
| Binary artifacts (ORT) | Static vs shared, CRT, delay-load, DLL hell | `download-binaries`, copy-dylibs, or system libs—still packaging work |

ONNX Runtime is the stress test. On Windows we learned that **DLL search order and host scanning** can sink a product; static linking was the blunt instrument that worked. On macOS/Linux, shared libraries and `@rpath` / `RPATH` are the civilized path—until a second copy of the library appears. Language choice does not remove native reality; it changes how you **declare** the dependency and how often the declaration matches what CI builds.

See also: [It's 2026 and DLL Hell is Still a Thing](/blog/blog-onnxruntime-windows-audio-plugin) and [Building an Audio Plugin with GitHub Actions](/blog/github-actions-macos-linux-build).

---

## Compile times, headers, and the shape of change

C++ compile times suffer from **textual inclusion**. A generous header pulls half the world into every translation unit. Modules help in theory; many plugin trees are still header soup + PCH folklore.

Rust compiles **crates** with a clearer dependency DAG. Incremental `cargo check` on a domain crate is often faster feedback than rebuilding a JUCE target after touching a widely included header. Full clean builds of either stack can still ruin an afternoon—especially with ORT and universal fantasies.

The practical difference for us: **domain refactors** moved toward the side where changing a pure function does not force the editor to relink the known universe.

---

## Performance: stop treating it as the main axis

Both languages can be fast. For our workloads (ONNX forward, beam search, JSON metadata, MIDI event lists), **algorithm and allocation policy** dominate language mystique.

Where Rust helps performance *indirectly*:

- fewer defensive copies “just in case the pointer is about to dangle”  
- less undefined behavior that only shows up under `-O2`  
- clearer ownership that makes pooling and reuse intentional  

Where C++ can still win:

- zero-friction calls into existing optimized libraries  
- fewer FFI boundary copies when everything is already C++  
- mature compiler + profiler workflows in some shops  

We did not move domain logic to Rust because benchmarks shamed C++. We moved it because **correct, testable, concurrent domain code** was too expensive to keep growing in the shell’s language by default.

---

## Why recent features felt harder in C++ (a direct answer)

Putting the above on one ledger:

1. **Cross-thread product state** without ownership in the type system → races and “impossible” crashes.  
2. **Multi-signal mode design** with booleans and floats → UI, processor, and engine disagree.  
3. **Stringly and intly APIs** (tokens, masks, parameter IDs) → semantic drift between help text, defaults, playback, and export.  
4. **Incidental lifecycle** (metadata warm-up as a side effect of another path) → flaky tests and “model is wrong” ghosts.  
5. **Framework gravity** — easy to put domain logic in the processor “just for now,” then discover five threads use it.  
6. **Build/dependency fog** — ONNX, CRT, packaging, and CI steal weeks that should have been product.  
7. **UB and init-order hazards** — platform-specific load crashes that unit tests never see.  
8. **Call-site discipline** — critical methods that exist but are never called; C++ cannot make “must wire this” local.

Rust is not a personality transplant for the team. It is a **forcing function** for the domain: own your data, make states explicit, test pure logic without a host, declare dependencies in one graph.

C++ remains the right hammer for the shell we actually ship.

---

## General-purpose takeaway (if you are not writing plugins)

If your program is:

- **Framework-bound** at the edges (GUI, game engine, mobile SDK, kernel module APIs), and  
- **Logic-heavy** in the middle (rules, pipelines, parsers, ML glue, sync protocols),  

then “C++ vs Rust” is the wrong question. The better question is:

> **Which language should own the middle so the edges stay boring?**

Answers we trust:

- Prefer **Rust** for long-lived domain cores you will refactor under concurrency and correctness pressure.  
- Prefer **C++** (or whatever the framework mandates) for the integration surface you cannot replace this quarter.  
- Prefer a **thin, stable ABI** over clever cross-language object models.  
- Invest in **builds** as product code: lockfiles, pinned toolchains, explicit native artifact policy, CI that mirrors release packaging.  
- Do not rewrite the UI to feel modern while the brain is still a thread-unsafe ball of members.

---

## What we are not saying

- That C++ is obsolete.  
- That safe Rust means you can ignore realtime rules.  
- That Cargo replaces notarization, installers, or DAW testing.  
- That every bug we hit was “because C++.” Some were design. Design is language-agnostic—and still easier to express with better types.

We **are** saying that for a thick musical domain next to a JUCE shell, **C++’s default power without default safety** has been the amplifier of our worst feature work—and Rust’s defaults are a better match for that middle layer.

---

*If you take one sentence with you: use C++ where the ecosystem is the product; use Rust where incorrect shared state is the product risk; treat the build graph as seriously as either language.*
