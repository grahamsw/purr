## 1. Repository Scaffolding

- [x] 1.1 Create the new standalone directory structure
- [x] 1.2 Initialize the root `package.json` with npm workspaces configuration
- [x] 1.3 Set up a base `tsconfig.json` and a clean `.gitignore` for the new project

## 2. Core Library Extraction

- [x] 2.1 Migrate `packages/sonifiers-core` source files and configuration
- [x] 2.2 Refactor library `package.json` to support public distribution (ESM/CJS, types, exports)
- [x] 2.3 Implement a clean `src/index.ts` to explicitly define the public API surface
- [x] 2.4 Verify the standalone library build process (`npm run build`)

## 3. Sample Application Extraction

- [x] 3.1 Migrate `packages/sonifier-app` source files and configuration
- [x] 3.2 Update application dependencies to resolve the library via npm workspaces
- [x] 3.3 Verify the application's dev and build workflows in the new context

## 4. Knowledge and Workflow Migration

- [x] 4.1 Synthesize a professional `README.md` for the public repository
- [x] 4.2 Create a focused `GEMINI.md` containing only web-relevant engineering instructions
- [x] 4.3 Port the `openspec` configuration and relevant architecture specs to the new project
- [x] 4.4 Implement an `npm run pack:test` script to verify library packaging

## 5. Cleanup and Handover

- [x] 5.1 Perform a final end-to-end verification of the new standalone project
- [x] 5.2 (Optional) Remove the extracted packages from the original research monorepo
