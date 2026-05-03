## Context

The `sonifiers-core` package has been successfully scaffolded with basic Web Audio implementations of `LiquidSynth`, `MalletSynth`, and `PurrSynth`. However, it currently lacks the high-level orchestration required for a production-ready sonification library. Clients are forced to manually manage `AudioContext`, parameter mapping, and discovery.

The `WebSonifierLibrary` directory contains an architectural blueprint for a more mature library. This design ports and completes that blueprint into `sonifiers-core`.

## Goals / Non-Goals

**Goals:**
- **Encapsulation**: Hide `AudioContext` and internal synth complexity behind a `Runner`.
- **Sophisticated Mapping**: Support static and dynamic (mean/std-dev based) normalization of input data.
- **Discovery**: Provide a registry to list available sonifiers and their parameters.
- **Zero Dependencies**: Maintain the zero-dependency promise of `sonifiers-core`.

**Non-Goals:**
- Implementation of new synthesis techniques (focus is on infrastructure).
- Visual UI components (focus is on the core library).

## Decisions

1. **Class-based Registry (SonifierLibrary)**:
   - *Rationale*: A central singleton or class-based registry allows for easy discovery.
   - *Design*: `SonifierLibrary` will maintain a map of `SonifierDescriptor` and factory functions.

2. **The Runner as the Primary Entry Point**:
   - *Rationale*: Clients should interact with a `Runner`, not the `Sonifier` directly. The Runner owns the `Mapping` and the `Sonifier`.
   - *API*: `runner.nominate(param, mapping)` designates a parameter for data driving. `runner.feed(param, value)` pushes data to that mapping. Static values are set via `runner.set(param, value)`.

3. **Polymorphic Parameter Descriptors**:
   - *Rationale*: Different synthesis parameters require different UI controls (sliders for numbers, dropdowns for enums, toggles for booleans).
   - *Design*: Implement `NumberParameterDescriptor`, `EnumParameterDescriptor`, and `BooleanParameterDescriptor`.

4. **Serialization (RunnerConfig)**:
   - *Rationale*: Users need to be able to save their sonification "presets".
   - *Design*: The `Runner` will provide `getConfig()` and `applyConfig(config)` to export/import the full state of static and nominated parameters.

5. **Dynamic Normalization Strategy**:
   - *Rationale*: Data streams often have unknown or shifting ranges. A dynamic normalizer that tracks mean and standard deviation allows the sonification to "self-calibrate".
   - *Implementation*: Use a sliding window to track statistics and map input to `[mean - 2*stdDev, mean + 2*stdDev]`.

6. **Internal Parameter Mapping (0-1 to Physical)**:
   - *Rationale*: The `Sonifier` interface will continue to use 0-1 normalized parameters internally. The `Mapping` logic in the `Runner` will map raw *domain* data into this 0-1 range.
   - *Benefit*: Separation of concerns between "how the sound is made" (0-1) and "how the data is mapped" (domain to 0-1).

## Risks / Trade-offs

- **[Risk]**: Complexity of dynamic mapping. If not implemented carefully, it can cause "pumping" artifacts in the audio as the range shifts.
  - **[Mitigation]**: Implement a "warm-up" period and smooth blending of range updates.
- **[Trade-off]**: Class-based architecture might be slightly heavier than a pure functional approach, but it provides better encapsulation of state (especially for dynamic normalizers).
