## Context

The project is a WebAudio-based synthesizer suite. We are adding a new synthesizer that focuses on low-frequency excitation of a resonant liquid-filled container. This requires a physical modeling approach that is efficient enough for browser-based real-time execution.

## Goals / Non-Goals

**Goals:**
- Implement a sample-accurate physical model of a liquid resonator.
- Provide a user-friendly interface for manipulating physical parameters (viscosity, volume, frequency).
- Ensure low-latency audio response using modern WebAudio APIs.

**Non-Goals:**
- High-fidelity 3D fluid dynamics simulation.
- Multi-channel spatial audio support for the initial version.
- External hardware controller support (MIDI).

## Decisions

### 1. Use `AudioWorklet` for the Physical Model
- **Rationale**: Physical modeling requires custom signal processing (feedback loops, non-linearities) that are best handled at the sample level. `AudioWorklet` provides the necessary performance and timing accuracy.
- **Alternatives**: 
  - Standard `BiquadFilterNode` chains: Too restrictive for complex modal resonances.
  - `ScriptProcessorNode`: Deprecated and runs on the main thread, causing audio glitches.

### 2. Feedback Delay Network (FDN) for Container Resonance
- **Rationale**: FDNs are excellent for modeling the complex, overlapping resonances (modes) of a physical container. By modulating delay lengths and feedback gains, we can simulate fluid properties like viscosity and volume.
- **Alternatives**:
  - Karplus-Strong: Better suited for strings and tubes than containers.
  - Modal Synthesis: Requires complex calculation of individual modes, which may be less flexible for real-time fluid simulation.

### 3. Vue Composable for State and Lifecycle
- **Rationale**: Following the project's established pattern (`usePurrSynth.ts`), a composable will manage the WebAudio context, node creation, and parameter updates.
- **Alternatives**:
  - Global Store (Pinia): Overkill for local component state.
  - Class-based management: Less idiomatic in the current Vue 3 setup.

## Risks / Trade-offs

- **[Risk] High CPU Consumption** → **Mitigation**: Limit the number of delay lines in the FDN and optimize the `AudioWorkletProcessor` code for performance.
- **[Risk] Initialization Latency** → **Mitigation**: Pre-fetch or inline the `AudioWorklet` script to avoid delays when starting the synth.
- **[Risk] Unstable Feedback** → **Mitigation**: Implement strict gain limiting and soft-clipping within the feedback loop to prevent audio blowups.
