---
title: "It's 2026 and DLL Hell is Still a Thing"
description: "How we almost lost the war against Windows DLL hell or how a 13MB DLL nearly destroyed a product."
date: "2025-12-17"
readTime: "14 min read"
tags: ["ai","machine-learning","windows","transformers"]
---

*Published: June 17, 2026 • 14 min read*

---

## The Setup

We ship an AI-powered MIDI effect plugin — VST3 and CLAP formats — built with JUCE and C++23. The AI component uses ONNX Runtime for transformer model inference. On macOS, you embed `libonnxruntime.dylib` in `Contents/Frameworks/`, set an `@rpath`, and move on with your life. It works. It's elegant. It's how Apple intended things to be.

On Windows, we entered a dimension of suffering we were not prepared for.

---

## Act I: The DLL That Couldn't Be Found

The first problem is straightforward. You build your plugin, you get a `.vst3` file (which is actually a DLL), and it depends on `onnxruntime.dll`. Where does the DLL go?

A VST3 plugin on Windows lives inside a bundle structure:

```
LucidHarmony.vst3/
  Contents/
    x86_64-win/
      LucidHarmony.vst3    ← the actual DLL
      onnxruntime.dll      ← you'd think this works
```

Windows DLL search order checks the directory of the loading module first. So placing `onnxruntime.dll` next to your plugin binary should work. And it does — on most machines, in most DAWs.

Until it doesn't.

---

## Act II: Reaper Scans Your DLL As A Plugin

Reaper, bless its heart, recursively scans `.dll` files inside VST3 bundle directories. It finds `onnxruntime.dll`, thinks "that looks like a plugin," tries to instantiate it as a VST, and crashes.

Your actual plugin shows up in Reaper's "failed plugins" list. Not because your plugin is broken — because Reaper tried to load ONNX Runtime as a synthesizer.

We tried renaming the DLL. We tried placing it in a subdirectory. Neither approach is portable across DAWs. Every host has different scanning behavior.

---

## Act III: The Wrong DLL Gets Loaded

Here's where things get properly sinister.

Our development environment (Kiro IDE) ships its own `onnxruntime.dll` — version 1.17.1. It's in Kiro's application directory, which is on the system PATH. Our plugin needs version 1.21.0+ (API version 21).

When the DAW loads our plugin, Windows finds the *already-loaded* 1.17.1 DLL in the process (because the IDE put it there via PATH) and uses it. The API version mismatch means `OrtGetApiBase()->GetApi(21)` returns **nullptr**. Our C++ wrapper dereferences nullptr. Crash.

```
Exception thrown: read access violation.
Ort::GetApi(...) returned nullptr.
```

"But users won't have Kiro installed!" you might say. True. But what about:
- Other AI-powered plugins that ship their own ORT DLL
- Python environments with onnxruntime installed
- Any other application that puts ORT on PATH

The Windows DLL loader gives you *no control* over which version gets loaded if the module name matches. `LoadLibrary("onnxruntime.dll")` will happily return a handle to whatever version is already in the process. You cannot load two DLLs with the same module name into one process on Windows. Period.

---

## Act IV: Delay-Load to the Rescue? No.

The obvious answer: `/DELAYLOAD:onnxruntime.dll`. Don't load the DLL at plugin scan time. Load it later, from our specific path.

```cmake
set_target_properties(onnxruntime::onnxruntime PROPERTIES
    INTERFACE_LINK_OPTIONS "/DELAYLOAD:onnxruntime.dll"
    INTERFACE_LINK_LIBRARIES "delayimp.lib"
)
```

We implemented a custom delay-load notification hook — MSVC's `__pfnDliNotifyHook2`:

```cpp
static FARPROC WINAPI delayLoadHook(unsigned dliNotify, PDelayLoadInfo pdli)
{
    if (dliNotify == dliNotePreLoadLibrary)
    {
        if (_stricmp(pdli->szDll, "onnxruntime.dll") == 0)
        {
            // Load from our plugin's own directory
            HMODULE h = LoadLibraryExW(dllPath, nullptr, LOAD_WITH_ALTERED_SEARCH_PATH);
            if (h) return reinterpret_cast<FARPROC>(h);
        }
    }
    return nullptr;
}

extern "C" const PfnDliHook __pfnDliNotifyHook2 = delayLoadHook;
```

This is the *officially documented* way to control delay-load resolution. It works in isolation. But when the wrong version is already loaded in the process, `LoadLibraryExW` still returns the cached handle to the 1.17.1 DLL. Windows refuses to load a second DLL with the same module name.

We tried `SetDllDirectoryW`. We tried `LOAD_LIBRARY_SEARCH_DLL_LOAD_DIR`. We tried renaming the DLL to `ort_runtime.dll` and changing `/DELAYLOAD` to match. The renamed DLL loads, but ORT's internal bootstrap still calls into functions by the original module name. `GetApi()` returns nullptr.

Every approach fails for the same fundamental reason: **you cannot have two versions of the same DLL in one Windows process.**

---

## Act V: Static Linking

The only solution that actually works: eliminate the DLL entirely.

ONNX Runtime doesn't ship pre-built static libraries. You have to build them yourself. We forked [olilarkin/ort-builder](https://github.com/olilarkin/ort-builder) (a tool created specifically for this purpose by audio plugin developers) and set up a GitHub Actions workflow:

```yaml
- name: Build Release
  run: |
    cd onnxruntime
    python tools/ci_build/build.py \
      --build_dir ../build/Release \
      --config Release \
      --parallel \
      --compile_no_warning_as_error \
      --skip_tests \
      --enable_msvc_static_runtime \
      --cmake_extra_defines onnxruntime_BUILD_SHARED_LIB=OFF \
      --cmake_extra_defines onnxruntime_ENABLE_LTO=OFF \
      --update --build
```

52 minutes later: static `.lib` files. 161MB of them. The output includes the core ORT runtime, protobuf, abseil, re2, flatbuffers, cpuinfo, Eigen, and about 70 abseil sub-libraries.

We host the result as a GitHub Release and download it via CPM during CMake configure:

```cmake
CPMAddPackage(
    NAME onnxruntime_static_win_x64
    VERSION 1.26.0
    URL "https://github.com/your-org/ort-builder/releases/download/v1.26.0-static/onnxruntime-static-win-x64.zip"
    DOWNLOAD_ONLY YES
)
```

The plugin binary grows from ~40MB to ~60MB, but there's no DLL. No DLL conflicts. No DAW scanning issues. No PATH contamination. It just works.

---

## The Other Crashes: Static Initialization Order Fiasco

With the DLL problem solved, the plugin still crashed at offset `0x228` from nullptr. The same crash in Debug, Release, VST3, and CLAP.

The debugger showed the crash in `_initterm` — the MSVC runtime function that runs global constructors before `main` (or in our case, before `DllMain`).

The culprit: `inline const juce::String` globals.

```cpp
// ProcessorIds.h — BEFORE (crashes on MSVC)
namespace IDs
{
inline const juce::String keyScale { "keyScale" };
inline const juce::String harmonyModel { "harmonyModel" };
// ... 20 more
}
```

`juce::String` has a non-trivial constructor that allocates memory. On macOS/Clang, the link order happens to initialize JUCE's internal allocator before these globals. On MSVC/Windows, the order is undefined. If your global `juce::String` runs its constructor before JUCE's memory system is ready, you dereference uninitialized memory.

The fix is dead simple:

```cpp
// ProcessorIds.h — AFTER (no constructors, no init order, no crash)
namespace IDs
{
constexpr const char* keyScale = "keyScale";
constexpr const char* harmonyModel = "harmonyModel";
// ...
}
```

`constexpr const char*` values are compile-time constants. No constructor runs. No allocation. No init order dependency. JUCE's `ParameterID` accepts `const char*` just fine.

For arrays of strings (`juce::StringArray`), where you can't use `constexpr`, use function-local statics:

```cpp
// BEFORE (crashes on MSVC)
inline const juce::StringArray keyChoices {
    "C", "C#/Db", "D", "D#/Eb", "E", "F", ...
};

// AFTER (guaranteed safe initialization)
inline const juce::StringArray& keyChoices()
{
    static const juce::StringArray s {
        "C", "C#/Db", "D", "D#/Eb", "E", "F", ...
    };
    return s;
}
```

Function-local statics are initialized on first call (C++11 guarantee, thread-safe on MSVC since VS2015). By the time your code calls `keyChoices()`, JUCE is fully initialized.

---

## The UTF-8 Surprise

One more crash, this one courtesy of JUCE's `String(const char*)` constructor:

```cpp
static const juce::StringArray s {
    "None", "7", "maj7", "dim (\xC2\xB0)", "aug (+)", ...
};
```

`\xC2\xB0` is the UTF-8 encoding of the degree symbol (°). JUCE's `String(const char*)` validates that all bytes are ASCII (≤ 127). If they're not, it fires a `jassert` — which in Release mode is a no-op, but in Debug mode triggers `__debugbreak()`. In a DAW host, this means a silent crash.

The fix:

```cpp
juce::String(juce::CharPointer_UTF8("dim (\xC2\xB0)"))
```

This is documented behavior, but you'd never find it unless you've memorized `juce_String.cpp` line 327.

---

## The CRT Mismatch

Static linking ORT means you inherit its CRT choice. ORT can be built with:
- `/MD` — dynamic CRT (links against `msvcrt.dll`)
- `/MT` — static CRT (links against `libcmt.lib`)

If your plugin uses `/MT` and ORT was built with `/MD`, the linker screams:

```
error LNK2038: mismatch detected for 'RuntimeLibrary': 
  value 'MD_DynamicRelease' doesn't match value 'MT_StaticRelease'
```

JUCE's recommended flags set `/MT` for Release builds. You must build ORT with `--enable_msvc_static_runtime` to match. This flag propagates to protobuf, gtest, and most dependencies — but abseil has its own build system quirks and may not respect it. We're still fighting this on the test targets.

---

## The ORT_API_MANUAL_INIT Dance

ORT 1.26.0 introduced a linker-level check for `ORT_API_MANUAL_INIT` consistency. The static libs embed a `#pragma detect_mismatch` that enforces your code and the libs agree on whether auto-init is enabled.

If the libs were built with `ORT_API_MANUAL_INIT` defined, you must define it too and call `Ort::InitApi()` before any ORT usage. If they weren't, you must NOT define it.

```
error LNK2038: mismatch detected for 'ORT_API_MANUAL_INIT': 
  value 'disabled' doesn't match value 'enabled'
```

There's no way to query this from the lib files. You just have to know (or try both).

---

## What Actually Ships

After all this, here's the Windows build:

- **Plugin binary:** Single `.vst3` file (~60MB), statically linked, no DLL dependencies
- **ORT static libs:** Downloaded once via CPM during CMake configure (~160MB compressed)
- **Build time:** ~8 minutes from clean (excluding first ORT download)
- **DAW compatibility:** Tested in Reaper, expected to work in all VST3/CLAP hosts

macOS and Linux continue using shared libraries (no DLL hell on those platforms).

---

## Lessons Learned

1. **Windows DLL loading is broken by design for plugins.** You get zero control over which version of a DLL loads if another version with the same module name is already in the process. This isn't a bug — it's how `LoadLibrary` works.

2. **Static linking is the only portable solution.** Every DLL-based approach (delay-load, renamed DLL, `SetDllDirectory`, custom hooks) fails when another application contaminates the process address space.

3. **`inline const` globals of non-trivial types are time bombs on MSVC.** They work on Clang/macOS by accident of link order. Use `constexpr` for simple types and function-local statics for complex types.

4. **JUCE's `String(const char*)` rejects non-ASCII.** Use `CharPointer_UTF8` for anything above code point 127.

5. **Building ONNX Runtime from source is painful.** CMake version sensitivity (CMake 4.x breaks FetchContent for ORT ≤ 1.21), Eigen download failures, abseil CRT propagation issues. Use GitHub Actions and cache the result.

6. **Test what you ship.** Debug builds use different CRT, different assertion behavior, and different static init ordering. If your plugin works in Debug but crashes in Release (or vice versa), you have a CRT or init-order problem.

7. **The offset `0x228` from nullptr** is what a member access at byte offset 552 looks like when `this` is null. If you see this pattern in a crash, look for uninitialized globals or dangling `this` pointers in constructors.

---

## The Toolkit

For anyone facing the same problem:

- **[olilarkin/ort-builder](https://github.com/olilarkin/ort-builder)** — GitHub Actions workflow for building ORT static libs
- **CPM.cmake** — For downloading the static libs during configure
- **`--enable_msvc_static_runtime`** — ORT build.py flag for `/MT` builds
- **`--cmake_extra_defines onnxruntime_ENABLE_LTO=OFF`** — Prevents 500MB+ static libs
- **`--skip_tests`** — Don't build ORT's test infrastructure (saves ~60MB of libs you don't need)

---

## Final Thought

The entire ordeal took roughly 12 hours of engineering time across two days. The fix is 4 lines of CMake and a 160MB zip file. The journey to get there required understanding Windows DLL loading at a level most developers never encounter, discovering MSVC-specific static initialization quirks that don't exist on other platforms, and accepting that sometimes the only winning move is to inline everything into one fat binary.

Audio plugin development on Windows is not for the faint of heart. However, I want to acknowledge just how grateful I am to my patient beta testers (especially Frank—you know who you are) and all my wonderful Windows users. You're exactly the reason we went down this path. Thank you!
