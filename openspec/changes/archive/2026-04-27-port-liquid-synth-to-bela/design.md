## Context

The current liquid synth implementation is confined to the browser via Web Audio API. While portable, it lacks the low-latency performance and standalone capability required for embedded instrument design. This port moves the synthesis engine to SuperCollider running on Bela, a dedicated hardware platform for ultra-low latency audio.

## Goals / Non-Goals

**Goals:**
- **Real-time Performance**: Achieve sub-millisecond audio latency on Bela.
- **Remote Control**: Provide a responsive HTML/JS interface that controls the Bela-based synth via OSC.
- **Standalone Operation**: The synth should be capable of running on Bela without a persistent browser connection (though the browser is used for control).

**Non-Goals:**
- **Vue.js on Bela**: We will not attempt to run the full Vue framework on the Bela board; the UI will remain client-side.
- **General MIDI Support**: The focus is exclusively on the liquid synth model parameters.

## Decisions

### 1. Synthesis Engine: SuperCollider (SCD)
We will use SuperCollider's server (scsynth) on Bela. 
- **Rationale**: Bela has first-class support for SuperCollider. UGens like `DelayC`, `AllpassC`, and `LFPulse` map directly to the liquid synth's FDN and LFO requirements.
- **Alternative**: Pure Data (Pd) or C++. SC offers the best balance of flexibility and performance for this specific model.

### 2. Control Layer: osc-bridge (Node.js)
The HTML control panel will communicate with Bela via `osc-bridge`.
- **Rationale**: Browser-based WebSockets are the most flexible way to build a UI. `osc-bridge` handles the translation to UDP OSC which the SC server expects.
- **Alternative**: Raw WebSockets to a custom C++ bridge. `osc-bridge` is already used in the project (based on the directory structure) and is a proven solution.

### 3. FDN Structure in SCD
The FDN will be implemented using an array of `CombC` filters with a feedback matrix.
- **Rationale**: This closely mirrors the logic of the `LiquidResonatorProcessor`.

## Risks / Trade-offs

- **[Risk]** Network Jitter → **[Mitigation]** Use a wired ethernet connection to the Bela when possible; implement parameter interpolation in the SC SynthDef to smooth out control changes.
- **[Risk]** CPU Overload on Bela → **[Mitigation]** Limit the number of delay lines in the FDN; use `CombL` (linear interpolation) if `CombC` (cubic) is too expensive.
- **[Risk]** IP Configuration → **[Mitigation]** Standardize on Bela's default IP (`192.168.7.2`) for the `osc-bridge` configuration.
