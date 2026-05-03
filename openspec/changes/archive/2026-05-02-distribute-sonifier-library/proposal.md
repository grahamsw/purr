## Why

The `sonifiers-core` package currently provides standalone synth implementations but lacks a unified orchestration layer for data mapping and discovery. The `WebSonifierLibrary` contains the foundational design for a `Runner` (which handles data-to-sound mapping) and a `SonifierLibrary` (a registry for discovery). Integrating these will transform individual synths into a professional, distributable library where clients can easily map raw data to audio parameters using sophisticated strategies (like dynamic normalization) without deep audio expertise.

## What Changes

- **Mapping Framework**: Port `BaseMapping.ts` to `sonifiers-core`, providing both static and dynamic (self-calibrating) normalization strategies.
- **Unified Runner**: Implement the `Runner` class from `WebSonifierLibrary`. The Runner will sit between the client and the synth, owning the mapping logic and ensuring consistent parameter control via `nominate` and `feed` APIs.
- **Advanced Parameter Metadata**: Support for `number`, `enum`, and `boolean` parameter types with metadata for UI generation, including a `nominatable` flag for data-driven parameters.
- **Serialization**: Provide `RunnerConfig` for snapshotting and restoring the complete state of a sonifier, including static values and active mappings.
- **Global Registry**: Implement the `SonifierLibrary` registry to allow applications to dynamically discover and instantiate available sonifiers (`Purr`, `Mallet`, `Liquid`).
- **Standardized API Integration**: Refactor the existing synths in `sonifiers-core` to perfectly align with the `Sonifier` interface defined in `WebSonifierLibrary`.
- **NPM Packaging**: Complete the `package.json` and build configuration to export these new orchestration layers.

## Capabilities

### New Capabilities
- `sonifier-registry`: A central registry (SonifierLibrary) for discovery and instantiation of sonifiers.
- `data-mapping-runner`: An orchestration layer (Runner) that handles the lifecycle and data mapping for a Sonifier using configurable Mapping strategies.

### Modified Capabilities
- `sonifiers-core`: Update the core package to include the Mapping framework and satisfy the advanced `Sonifier` interface from the design basis.

## Impact

- **Affected Code**: `packages/sonifiers-core` will see major additions to its exports. The existing synths (`LiquidSynth.ts`, etc.) will be updated to match the new `Sonifier` interface.
- **APIs**: New high-level `Runner` and `SonifierLibrary` APIs for library users.
- **Dependencies**: No new production dependencies; all mapping logic will be implemented as pure TypeScript.
