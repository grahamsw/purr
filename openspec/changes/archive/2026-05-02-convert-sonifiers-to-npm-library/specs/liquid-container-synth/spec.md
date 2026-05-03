## MODIFIED Requirements

### Requirement: Real-time Audio Control Interface
The system SHALL provide a standardized API to control the synthesizer parameters in real-time, supporting both Web Audio and OSC backends.

#### Scenario: Start/Stop Audio via Standardized API
- **WHEN** the user calls the `start()` or `stop()` method on a synth instance
- **THEN** the underlying audio engine (Web Audio or OSC) is started or stopped accordingly

#### Scenario: Parameter Control via Standardized API
- **WHEN** the user updates parameters via the synth's `setParams()` method
- **THEN** the system SHALL dispatch either a Web Audio parameter ramp or an OSC message to the synthesis engine
