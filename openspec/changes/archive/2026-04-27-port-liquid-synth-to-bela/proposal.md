## Why

The liquid synth currently exists as a Web Audio API (AudioWorklet) implementation. Porting it to SuperCollider on Bela enables standalone, low-latency execution on dedicated hardware, suitable for embedded musical instruments, while retaining a remote HTML-based control interface.

## What Changes

- **Port Liquid Synth to SCD**: Implement the Feedback Delay Network (FDN) and LFO excitation model in SuperCollider.
- **Bela Integration**: Configure the `.scd` file to run on the Bela SuperCollider environment, utilizing Bela's low-latency audio capabilities.
- **HTML Control Panel**: Create a dedicated HTML/JS interface for the Bela port (repurposing logic from the Vue implementation).
- **OSC Communication**: Integrate `osc-bridge` to facilitate real-time communication between the HTML control panel (running on a client) and the SuperCollider server (running on Bela).

## Capabilities

### New Capabilities
- `bela-liquid-synth`: SuperCollider implementation of the liquid resonator optimized for Bela hardware.
- `bela-osc-control`: OSC-based remote control protocol and bridge configuration for the liquid synth.

### Modified Capabilities
- `liquid-container-synth`: The core requirements for the liquid resonator model (FDN, LFO excitation) remain consistent but will be extended to support OSC parameter mapping.

## Impact

- **New Files**: `catpurr_bela.scd` (already partially exists but needs refinement), new HTML/JS controller, `osc-bridge` configuration.
- **Systems**: SuperCollider (Bela), Node.js (osc-bridge), Browser (UI).
- **Dependencies**: Requires `osc-bridge` and a working SuperCollider/Bela setup.
