## ADDED Requirements

### Requirement: Dual ESM/CJS Support
The library SHALL be built to support both ECMAScript Modules (ESM) and CommonJS (CJS) to ensure compatibility across various Node.js and browser environments.

#### Scenario: Importing in Vite (ESM)
- **WHEN** a client project uses `import { Runner } from 'sonifiers-core'`
- **THEN** the ESM build is correctly resolved without errors

### Requirement: Type Definition Bundling
The build process SHALL generate and bundle TypeScript declaration files (`.d.ts`) to provide a first-class developer experience for TypeScript users.

#### Scenario: IDE Autocomplete
- **WHEN** a developer types `runner.` in a TypeScript project
- **THEN** the IDE provides accurate autocomplete suggestions based on the bundled types

### Requirement: Source Map Generation
The production build SHALL include source maps to facilitate debugging of the library in consumer applications.

#### Scenario: Browser Debugging
- **WHEN** a developer inspects a stack trace in the browser console
- **THEN** it maps correctly back to the original TypeScript source code in the library
