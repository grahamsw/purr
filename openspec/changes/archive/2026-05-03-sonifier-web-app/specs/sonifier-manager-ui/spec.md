## ADDED Requirements

### Requirement: Library Discovery UI
The system SHALL display a list of available sonifiers retrieved from the `SonifierLibrary`.

#### Scenario: Selecting a Sonifier
- **WHEN** the user selects "Purr Synth" from the list
- **THEN** the application loads the metadata and parameter descriptors for that synth

### Requirement: Dynamic Configuration Form
The system SHALL render an interactive form to configure the selected sonifier's parameters and mapping strategies.

#### Scenario: Configuring a Number Parameter
- **WHEN** a parameter is of type `number` and is `nominatable`
- **THEN** the system SHALL allow the user to choose between "Static Value" or "Data Driven (Mapping)"

### Requirement: Mapping Strategy Selection
The system SHALL allow the user to choose between Static or Dynamic normalization strategies for any nominated parameter.

#### Scenario: Choosing Dynamic Mapping
- **WHEN** the user selects "Dynamic" mapping for the primary parameter
- **THEN** the system SHALL allow configuration of `warmupSamples` and `sensitivity`
