## Context

The `sonifiers-core` library provides the engine for sonification but requires a host application to provide data and user control. This design outlines a Vue 3 application that integrates this library to sonify a synthetic data stream.

## Goals / Non-Goals

**Goals:**
- **Modular Data Feed**: Create a reusable composable for the random walk data stream.
- **Dynamic UI**: Generate configuration controls automatically based on the `SonifierDescriptor`.
- **Real-time Feedback**: Visualize the data stream and the corresponding audio parameter changes.
- **Easy Integration**: Use the `sonifiers-core` library as a workspace dependency.

**Non-Goals:**
- Persisting user configurations to a database.
- Supporting multiple simultaneous data streams (one stream at a time).

## Decisions

1. **Vite + Vue 3 (Composition API)**:
   - *Rationale*: Modern, fast development experience with excellent TypeScript support.

2. **`useDataStream` Composable**:
   - *Rationale*: Encapsulates the random walk logic.
   - *Implementation*:
     ```typescript
     export function useDataStream(intervalMs = 10000) {
       const value = ref(500);
       const step = 10;
       // ... timer logic ...
       return { value };
     }
     ```

3. **Dynamic Configuration Dialog**:
   - *Rationale*: The library may add new sonifiers or parameters. The UI should adapt without code changes.
   - *Implementation*: Map over `SonifierLibrary.list()` to show a selection list. Once selected, iterate over `parameters` Record to render:
     - Sliders for `NumberParameterDescriptor`.
     - Selects for `EnumParameterDescriptor`.
     - Toggles for `BooleanParameterDescriptor`.

4. **Runner Lifecycle Management**:
   - *Rationale*: Prevent memory leaks and ensure audio is only active when needed.
   - *Implementation*: The UI will manage a single `Runner` instance. When a new sonifier is selected, the old one is stopped and disposed.

5. **Audio Context Handling**:
   - *Rationale*: Browsers block audio until user interaction.
   - *Implementation*: Include a "Start Audio" button that resumes the context and initializes the `Runner`.

## Risks / Trade-offs

- **[Risk]**: The 10-second interval might feel slow for real-time testing.
  - **[Mitigation]**: Allow the user to adjust the interval in the UI.
- **[Risk]**: Complex mappings might be hard to represent in a simple dialog.
  - **[Mitigation]**: Start with standard Static/Dynamic mapping templates.
