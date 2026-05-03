## ADDED Requirements

### Requirement: External Synth Registration
The registry SHALL provide a mechanism for consumer projects to register their own custom synth implementations that satisfy the `Sonifier` interface.

#### Scenario: Registering a Custom Synth
- **WHEN** a client application provides a `factory` and `descriptor` for a custom synth to the library
- **THEN** that synth becomes available via `list()` and can be instantiated via `create()` just like the built-in synths
