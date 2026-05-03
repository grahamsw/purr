## ADDED Requirements

### Requirement: Active Runner Orchestration
The system SHALL maintain an active `Runner` instance for the currently selected and configured sonifier.

#### Scenario: Starting Sonification
- **WHEN** the user clicks "Start Sonification"
- **THEN** the system resumes the `AudioContext`, initializes the synth, and begins listening to the data stream

### Requirement: Real-time Data Ingestion
The system SHALL feed every new data point from the generator into the active `Runner`.

#### Scenario: Data Feed to Runner
- **WHEN** a new value is emitted by the random walk generator
- **THEN** the system calls `runner.feed(param, value)` for all nominated parameters

### Requirement: Audio Context Management
The system SHALL handle the browser's audio context lifecycle to ensure audio can be played after user interaction.

#### Scenario: Resume Audio Context
- **WHEN** the user interacts with the start button
- **THEN** the `AudioContext.resume()` method is called before synth initialization
