## Context

The current synthesis logic is embedded in Vue composables and uses Tone.js. This design aims to move this logic to a pure Web Audio API library with a standardized, data-centric interface optimized for sonification tasks.

## Goals / Non-Goals

**Goals:**
- Extract core synthesis logic into a zero-dependency TypeScript library.
- **Standardize parameters**: All user-facing parameters must be normalized (0-1) and include metadata (display name, default, order).
- **Remove Tone.js**: Port all synths to native Web Audio API for a lightweight footprint.
- **Ordered Parameters**: Enable clients to programmatically discover and map parameters based on their defined order.
- **npm Ready**: Structure the package for distribution via npm.

**Non-Goals:**
- Porting to non-web platforms (like Bela/C++) in this specific change.
- Changing the fundamental sound design of the existing sonifiers.

## Decisions

1. **Normalized Interface (0-1)**: All synth parameters will accept values between 0.0 and 1.0. The internal implementation will handle the mapping to specific frequency, gain, or Q ranges.
   - *Rationale*: Simplifies client mapping logic. Clients don't need to know the internal ranges to map data.

2. **Parameter Metadata**: Each synth will provide a `getParameters()` method returning an array of parameter descriptors:
   ```typescript
   interface ParameterDescriptor {
     id: string;
     name: string;
     defaultValue: number; // 0-1
     order: number;
   }
   ```
   - *Rationale*: Allows clients to dynamically build configuration UIs.

3. **Manual Porting (Tone.js → Web Audio)**: `MalletSynth` and `PurrSynth` will be refactored to use native `BiquadFilterNode`, `OscillatorNode`, `GainNode`, etc., instead of Tone.js wrappers.
   - *Rationale*: Eliminates the Tone.js dependency for a lighter, more portable library.

4. **Primary Parameter Mapping**: The parameter with `order: 0` is the designated "primary" value for sonification.

5. **AudioContext Management**: Synths will accept an `AudioContext` in the constructor or `init()` to ensure compatibility with client-managed audio graphs.

## Risks / Trade-offs

- **[Risk]**: Porting complex Tone.js graphs (like Purr's Karplus-Strong) to native Web Audio might result in subtle timing or sound differences.
  - **[Mitigation]**: Careful comparison of the new native implementation against the original Tone.js version.
- **[Trade-off]**: Normalizing all parameters (0-1) makes the library slightly more complex internally (needs mapping logic) but significantly easier for clients to use.
