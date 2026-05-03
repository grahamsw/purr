## ADDED Requirements

### Requirement: Standardized Sonifier Lifecycle
Each synth in the core library SHALL satisfy a standard lifecycle: `initialize()`, `start()`, and `stop()`.

#### Scenario: Synth Cleanup
- **WHEN** `synth.stop()` is called
- **THEN** all audio nodes are disconnected or disposed of to prevent memory leaks

### Requirement: Unified Parameter Accessors
Each synth SHALL provide both `setParameter(name, value)` and `getParameter(name)` methods for reading and writing normalized (0-1) values.

#### Scenario: Reading Current State
- **WHEN** a client calls `getParameter('pitch')`
- **THEN** it returns the current value, or the default value if it has not been set

### Requirement: Polymorphic Parameter Descriptors
Each synth SHALL provide a descriptor that defines its parameters as either `number`, `enum`, or `boolean` types.

#### Scenario: Discovering an Enum Parameter
- **WHEN** a client inspects the descriptor for a synth with a 'waveform' parameter
- **THEN** it finds an `EnumParameterDescriptor` containing valid options like 'sine', 'square', etc.

### Requirement: Nominatable Flag
The parameter metadata SHALL include a `nominatable` boolean to indicate if a number parameter is suitable for data-driven mapping.

#### Scenario: Non-Nominatable Parameter
- **WHEN** a client attempts to nominate a parameter where `nominatable: false`
- **THEN** the Runner SHALL throw an error
