## Why

The current sonifiers (Liquid, Mallet, Purr) are tightly coupled with Vue composables and have a dependency on Tone.js, which may be heavier than needed for some projects. Extracting them into a standalone, zero-dependency npm library improves maintainability, allows for better unit testing, and enables wider adoption across different platforms (e.g., React, Vanilla JS) with a standardized sonification API.

## What Changes

- **Zero Dependencies**: Remove `Tone.js` entirely, porting all synthesis logic to the native Web Audio API.
- **Standalone Library**: Extract core synthesis logic for Liquid, Mallet, and Purr into a new library ready for npm deployment.
- **Standardized Parameter Interface**: 
    - Each sonifier publishes a list of parameters with metadata (display name, default value, and order).
    - All parameters are normalized to a `0.0` to `1.0` range for easy mapping.
    - Master volume is a standard parameter.
    - Parameters are ordered, with the first being the primary mapping target for sonification.
- **Clean API**: Provide a standardized `start()`, `stop()`, and `setParam(id, value)` API.
- **Vue Integration**: Update the existing Vue project to use the new library via lightweight wrapper composables.

## Capabilities

### New Capabilities
- `sonifiers-core`: A standalone, zero-dependency JavaScript/TypeScript library containing the core synthesis logic for Liquid, Mallet, and Purr synths, featuring a normalized parameter API.

### Modified Capabilities
- `liquid-container-synth`: Update requirements to specify a decoupled core synthesis engine using the standardized 0-1 parameter interface.

## Impact

- **Affected Code**: `vue-purr/src/composables/useLiquidSynth.ts`, `useMalletSynth.ts`, `usePurrSynth.ts` will be refactored into wrappers.
- **APIs**: New TypeScript classes and standardized parameter metadata for each synth.
- **Dependencies**: **Tone.js is removed.** The library will have zero production dependencies.
