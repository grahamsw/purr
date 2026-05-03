## Why

The current monorepo structure mixes experimental research (Bela, SuperCollider, Pure Data) with production-ready web sonification tools. To enable public distribution, clean packaging via npm, and a focused development environment for the web-based sonification engine, we need to extract the core library and its sample application into a dedicated, standalone repository.

## What Changes

- **Extraction**: Relocate `packages/sonifiers-core` and `packages/sonifier-app` into a new standalone directory/repository structure.
- **Project Structure**: Establish a clean, non-monorepo workspace (or a dedicated web-only monorepo) with proper TypeScript and Vite configurations.
- **Documentation Migration**: Consolidate and refine `GEMINI.md` instructions and `README` files to provide a professional onboarding experience for public contributors.
- **Spec Porting**: Move the relevant OpenSpec architecture and specifications into the new project to maintain development rigor.
- **Cleanup**: Remove the extracted packages from the current research repository to prevent synchronization conflicts.

## Capabilities

### New Capabilities
- `public-package-infrastructure`: Infrastructure for public npm distribution, including build scripts, type declarations, and versioning.
- `standalone-development-workflow`: A streamlined development and testing workflow for the library and app without dependencies on the research tools.

### Modified Capabilities
- `sonifiers-core`: Update the core specification to reflect its status as a standalone, distributable package.
- `sonifier-registry`: Update registry requirements to support broader library usage beyond the initial monorepo.

## Impact

This change will decouple the web sonification tools from the Bela/SC research environment. It will require a new CI/CD setup for the new repository and an update to the `sonifier-app`'s internal library references.
