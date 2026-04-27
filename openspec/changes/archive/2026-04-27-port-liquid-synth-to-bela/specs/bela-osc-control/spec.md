## ADDED Requirements

### Requirement: OSC Parameter Mapping
The system SHALL map OSC addresses to specific synth parameters, including frequency, viscosity, and volume.

#### Scenario: Remote Parameter Update
- **WHEN** the HTML control panel sends an OSC message `/liquid/viscosity 0.8`
- **THEN** the corresponding parameter in the SuperCollider SynthDef on Bela updates immediately

### Requirement: osc-bridge Configuration
The system SHALL provide a configuration for `osc-bridge` that routes WebSocket messages from the HTML panel to the Bela's IP address on the standard SuperCollider port (57110).

#### Scenario: Bridge Connectivity
- **WHEN** the `osc-bridge` is running and the HTML panel is connected
- **THEN** control messages are successfully relayed to the Bela board
