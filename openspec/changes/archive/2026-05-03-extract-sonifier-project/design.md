## Context

The current project is a research-oriented monorepo. The web sonification tools (`sonifiers-core` and `sonifier-app`) have matured to a state where they can benefit from a dedicated repository for public distribution and community contribution.

## Goals / Non-Goals

**Goals:**
- Create a clean, standalone project structure for the web sonification library and application.
- Implement a robust build and distribution pipeline for the library.
- Consolidate AI and human documentation for the new repository context.
- Ensure the sample application serves as a high-quality demonstration of the library's capabilities.

**Non-Goals:**
- Porting Bela, Pure Data, or SuperCollider research tools to the new repository.
- Implementing a full CI/CD pipeline (this design focuses on the project structure and local build logic).
- Changing the core audio synthesis logic (unless required by the extraction).

## Decisions

### 1. Unified Web Repository
**Decision**: Use a single repository containing both `packages/sonifiers-core` and `packages/sonifier-app` using `npm workspaces`.
**Rationale**: High cohesion between the core library and its primary sample application. Workspaces simplify local linking and dependency management.
**Alternatives**: Separate repositories for library and app. Rejected due to increased overhead for synchronized changes.

### 2. Modern ESM Distribution
**Decision**: Configure the library to emit ES Modules (ESM) as the primary target, with a CommonJS fallback.
**Rationale**: Aligns with modern web standards and provides optimal tree-shaking for Vite-based consumers.
**Alternatives**: CJS only. Rejected as it complicates modern web app integration.

### 3. Documentation Consolidation
**Decision**: Synthesize a new `GEMINI.md` and `README.md` from existing instructions, tailored specifically for the standalone web project.
**Rationale**: Ensures that both human and AI developers have a clear, focused onboarding path without the "noise" of the research tools.

## Risks / Trade-offs

- **[Risk]**: Broken local references in the original research repository. -> **[Mitigation]**: Update the original project's documentation to point to the new repository as the source of truth for web tools.
- **[Risk]**: Difficulty in testing the "packaged" library locally. -> **[Mitigation]**: Implement an `npm run pack:test` script that builds the library and installs the `.tgz` into a fresh test environment.
- **[Risk]**: Losing the history of the experimental phase. -> **[Mitigation]**: Maintain the original repository as an archive/research hub.
