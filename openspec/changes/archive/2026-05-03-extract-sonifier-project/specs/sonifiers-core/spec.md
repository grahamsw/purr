## ADDED Requirements

### Requirement: Packageable Export Surface
The core library SHALL explicitly define its public API surface in a top-level `index.ts`, ensuring that only stable, intended interfaces are exposed to consumers.

#### Scenario: Restricting Internal Helpers
- **WHEN** a client project imports the library
- **THEN** it only sees exported classes like `Runner` and `BaseSonifier`, and cannot accidentally import internal utility functions

## MODIFIED Requirements

### Requirement: Zero Dependencies
The core library SHALL NOT have any production dependencies (e.g., Tone.js). This ensures that the public package remains lightweight and does not introduce "dependency hell" for consumers.

#### Scenario: Project Bundle Size
- **WHEN** the library is included in a new project
- **THEN** no additional packages (like Tone.js) are added to the dependency graph
