## ADDED Requirements

### Requirement: Normalized Parameter Interface
Each synth SHALL expose parameters that accept values strictly between 0.0 and 1.0 (inclusive).

#### Scenario: Setting a Normalized Parameter
- **WHEN** a client calls `setParam('viscosity', 0.8)`
- **THEN** the internal synth engine maps 0.8 to the appropriate physical range for that parameter

### Requirement: Parameter Metadata Discovery
Each synth SHALL provide a way to retrieve a list of its available parameters, including display names, default values (0-1), and a suggested ordering.

#### Scenario: Building a Dynamic UI
- **WHEN** a client calls `getParameters()`
- **THEN** it returns an ordered list of descriptors containing `id`, `name`, `defaultValue`, and `order`

### Requirement: Primary Sonification Parameter
Each synth SHALL designate one parameter (order: 0) as the primary mapping target for data sonification.

#### Scenario: Automated Data Mapping
- **WHEN** a client has a single data dimension to sonify
- **THEN** it can identify the primary parameter by selecting the one with the lowest `order` index

### Requirement: Zero Dependencies
The core library SHALL NOT have any production dependencies (e.g., Tone.js).

#### Scenario: Project Bundle Size
- **WHEN** the library is included in a new project
- **THEN** no additional packages (like Tone.js) are added to the dependency graph

### Requirement: Explicit Start Call
The library SHALL provide an explicit `start()` method to activate the Web Audio engine, satisfying browser requirements for user-initiated audio.

#### Scenario: User Activation
- **WHEN** a user clicks a "Play" button and the client calls `synth.start()`
- **THEN** the `AudioContext` is resumed if needed and the synth begins processing
