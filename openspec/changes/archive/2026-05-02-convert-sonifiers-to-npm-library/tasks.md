## 1. Library Infrastructure

- [x] 1.1 Create the directory structure for the new library (`packages/sonifiers-core`).
- [x] 1.2 Initialize `package.json` for the new library (no prod dependencies).
- [x] 1.3 Setup TypeScript configuration and build scripts for npm deployment.
- [x] 1.4 Define the `Sonifier` base interface and `ParameterDescriptor` type.

## 2. Synth Implementation (Web Audio API)

- [x] 2.1 Refactor `LiquidSynth` class to the new standardized API (0-1 parameters).
- [x] 2.2 Port `MalletSynth` from Tone.js to native Web Audio API and implement the standardized API.
- [x] 2.3 Port `PurrSynth` from Tone.js to native Web Audio API and implement the standardized API.
- [x] 2.4 Implement internal mapping logic for each synth to convert 0-1 values to physical ranges.

## 3. Vue Integration & Refactoring

- [x] 3.1 Update `useLiquidSynth.ts` to wrap the new library class.
- [x] 3.2 Update `useMalletSynth.ts` to wrap the new library class.
- [x] 3.3 Update `usePurrSynth.ts` to wrap the new library class.
- [x] 3.4 Update UI components to use parameter metadata for rendering control screens.

## 4. Verification & Deployment

- [x] 4.1 Verify all synths produce audio identical (or very similar) to the original Tone.js versions.
- [x] 4.2 Verify 0-1 parameter mapping works correctly across all synths.
- [x] 4.3 Test the library in a minimal Vanilla JS environment.
- [x] 4.4 Prepare the package for npm (readme, exports, etc.).
