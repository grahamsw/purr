## 1. SuperCollider Implementation (Bela)

- [x] 1.1 Refine `catpurr_bela.scd` to implement the 8-line Feedback Delay Network (FDN) using `CombC`.
- [x] 1.2 Implement the 5Hz-50Hz LFO excitation source in the SCD SynthDef.
- [x] 1.3 Add `OSCFunc` or `named controls` in SuperCollider to handle incoming `/liquid/frequency`, `/liquid/viscosity`, and `/liquid/volume` messages.
- [x] 1.4 Test the SynthDef on Bela to ensure stable audio performance and low latency.

## 2. Control Infrastructure

- [x] 2.1 Update or verify `osc-bridge.js` configuration to target the Bela's IP address (default `192.168.7.2`).
- [x] 2.2 Ensure the `osc-bridge` Node.js process can start and listen for WebSocket connections.

## 3. HTML Control Panel

- [x] 3.1 Create a standalone `bela_control.html` page with interactive sliders for Frequency, Viscosity, and Volume.
- [x] 3.2 Implement `bela_control.js` to handle WebSocket communication with `osc-bridge`.
- [x] 3.3 Map HTML slider events to OSC message dispatches through the bridge.
- [x] 3.4 Add a "Power" toggle to start/stop the remote SuperCollider synth.

## 4. Integration and Verification

- [x] 4.1 Run the full stack: Bela (SC), Local Machine (osc-bridge + HTML Panel).
- [x] 4.2 Verify that moving a slider on the HTML page results in an immediate acoustic change on the Bela output.
- [x] 4.3 Check for any OSC message loss or excessive jitter during rapid parameter modulation.
