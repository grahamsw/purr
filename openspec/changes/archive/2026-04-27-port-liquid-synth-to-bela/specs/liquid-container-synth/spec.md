## MODIFIED Requirements

### Requirement: Real-time Audio Control Interface
The system SHALL provide a user interface to control the synthesizer parameters in real-time using either WebAudio or OSC (Open Sound Control).

#### Scenario: Start/Stop Audio
- **WHEN** the user toggles the synth power state
- **THEN** the audio context (WebAudio) or the remote server (OSC) is started or stopped accordingly

#### Scenario: Remote Parameter Control
- **WHEN** the user adjusts a parameter in the HTML control interface
- **THEN** the system SHALL dispatch either a WebAudio parameter ramp or an OSC message to the synthesis engine
