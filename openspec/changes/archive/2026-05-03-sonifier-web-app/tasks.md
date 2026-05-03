## 1. Project Setup

- [x] 1.1 Scaffold a new Vue 3 + TypeScript project using Vite (e.g., in `packages/sonifier-app`).
- [x] 1.2 Link the local `sonifiers-core` library as a dependency.
- [x] 1.3 Set up a basic layout with a dashboard and a configuration sidebar/dialog.

## 2. Data Feed Implementation

- [x] 2.1 Implement the `useDataStream` composable with random walk logic.
- [x] 2.2 Add UI controls to adjust the interval (e.g., 10s default) and step size.
- [x] 2.3 Create a simple visualization (e.g., a sparkline or a large number display) for the live data.

## 3. Sonifier Management UI

- [x] 3.1 Create a `SonifierSelector` component that lists all registered synths from `SonifierLibrary`.
- [x] 3.2 Implement a dynamic `ParameterForm` that renders controls for `number`, `enum`, and `boolean` descriptors.
- [x] 3.3 Implement the `MappingConfigurator` sub-form for nominated parameters (Static/Dynamic selection).

## 4. Sonification Control Logic

- [x] 4.1 Implement a `useSonifierController` composable to manage the active `Runner` lifecycle.
- [x] 4.2 Add the \"Start Audio\" / \"Stop Audio\" global controls to handle `AudioContext` resumption.
- [x] 4.3 Connect the `useDataStream` output to `runner.feed()` calls within the controller.

## 5. Polishing & Verification

- [x] 5.1 Test selection and configuration for `LiquidSynth`, `MalletSynth`, and `PurrSynth`.
- [x] 5.2 Verify that `DynamicMapping` correctly adapts to the random walk range over time.
- [x] 5.3 Ensure all audio nodes are properly disposed when switching between sonifiers.
