## ADDED Requirements

### Requirement: Isolated Workspace Scripts
The project SHALL provide top-level scripts for building, testing, and running the application and library independently from any parent research repository.

#### Scenario: Quick Start
- **WHEN** a new contributor runs `npm install && npm run dev`
- **THEN** both the library is built and the sample application starts in watch mode

### Requirement: Documentation-Driven Onboarding
The repository SHALL include a `GEMINI.md` file that defines the architecture, development rules, and workflow expectations for AI agents and human developers.

#### Scenario: Agent Onboarding
- **WHEN** an AI agent initializes in the repository
- **THEN** it reads `GEMINI.md` and correctly identifies the project's technical standards (e.g., zero-dependencies, WebAudio lifecycle)

### Requirement: Local Linking for Development
The workspace configuration SHALL support seamless local development of the library alongside the sample app (e.g., via npm workspaces or relative paths).

#### Scenario: Real-time Feedback
- **WHEN** a developer changes code in `packages/sonifiers-core`
- **THEN** the changes are immediately reflected in the running `sonifier-app` without manual re-installation
