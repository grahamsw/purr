## 1. Core Interfaces & Infrastructure

- [x] 1.1 Define the enhanced `Sonifier` interface in `packages/sonifiers-core/src/types.ts`.
- [x] 1.2 Implement polymorphic `ParameterDescriptor` types (Number, Enum, Boolean) and `SonifierDescriptor`.

## 2. Mapping Framework

- [x] 2.1 Implement `BaseMapping` types and logic in `packages/sonifiers-core/src/Mapping.ts`.
- [x] 2.2 Implement `StaticMapping` and `DynamicMapping` (normalization with sliding window).
- [x] 2.3 Add support for linear, exponential, and logarithmic mapping curves.

## 3. The Runner

- [x] 3.1 Implement the `Runner` class in `packages/sonifiers-core/src/Runner.ts`.
- [x] 3.2 Implement `runner.nominate(param, mapping)` and `runner.feed(param, value)`.
- [x] 3.3 Implement `runner.set(param, value)` for static parameters.
- [x] 3.4 Implement `runner.getConfig()` and `runner.applyConfig(config)` for serialization.

## 4. Global Registry

- [x] 4.1 Implement `SonifierLibrary` in `packages/sonifiers-core/src/SonifierLibrary.ts`.
- [x] 4.2 Add `register(registration: SonifierRegistration)` using a factory function approach.
- [x] 4.3 Implement `list()` and `create(name)` which returns a `Runner`.

## 5. Synth Refactoring

- [x] 5.1 Update `BaseSonifier.ts` to satisfy the new `Sonifier` interface.
- [x] 5.2 Refactor `LiquidSynth.ts` to match the updated interface and use the new parameter accessors.
- [x] 5.3 Refactor `MalletSynth.ts` to match the updated interface.
- [x] 5.4 Refactor `PurrSynth.ts` to match the updated interface.

## 6. Packaging & Verification

- [x] 6.1 Update `packages/sonifiers-core/src/index.ts` to export all new architecture components.
- [x] 6.2 Verify the build with `npm run build` in `packages/sonifiers-core`.
- [x] 6.3 Create a verification script (e.g. `test-library.ts`) that uses the Registry and Runner to play a sound.
