## Why

The project currently lacks a complex physical modeling synthesizer that simulates organic, fluid-like textures. This new synth will provide a rich and expressive sound source by modeling the resonance of a liquid-filled container, enabling unique sound design possibilities.

## What Changes

- **New Capability**: Introduction of a physical modeling synthesizer focused on liquid resonance.
- **Resonator Source**: Implementation of a vibrating object oscillator ranging from 5Hz to 50Hz.
- **Fluid Simulation**: A WebAudio implementation of a resonator system that mimics liquid behavior (viscosity, mass, and internal structure).
- **User Interface**: New Vue components to control the synth parameters in real-time.

## Capabilities

### New Capabilities
- `liquid-container-synth`: A WebAudio-based synthesizer that models the physical properties of a liquid-filled container and its resonance under low-frequency vibration.

### Modified Capabilities
<!-- None -->

## Impact

- **New Components**: A `LiquidSynthController.vue` component in `vue-purr/src/components`.
- **New Composables**: A `useLiquidSynth.ts` composable in `vue-purr/src/composables` to handle the WebAudio logic.
- **Dependencies**: Utilizes the standard WebAudio API available in modern browsers.
