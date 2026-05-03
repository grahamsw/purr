## Why

To provide a modern, interactive web interface for the `sonifiers-core` library, enabling users to visualize and listen to data sonification in real-time. This application serves as both a demonstration of the library's capabilities and a testing ground for different sonification strategies.

## What Changes

- **New Vue Application**: A fresh Vue 3 project (TypeScript) to host the sonification dashboard.
- **Random Walk Data Feed**: Implementation of a background data generator that simulates a real-time stream (0-1000 range, random walk).
- **Sonifier Selector & Configurator**: A dynamic UI that queries the `SonifierLibrary` for available synths and generates configuration forms based on their parameter descriptors.
- **Live Sonification Engine**: Integration logic that connects the live data feed to a `Runner` instance, applying chosen mappings and curves.

## Capabilities

### New Capabilities
- `data-stream-generator`: Logic for generating a continuous random walk data stream with configurable parameters.
- `sonifier-manager-ui`: User interface components for selecting, initializing, and configuring sonifiers from the library.
- `real-time-sonifier-controller`: Orchestration layer that bridges the data stream and the `Runner` to produce audio output.

### Modified Capabilities
- None

## Impact

- **Affected Code**: None (New project).
- **APIs**: Consumes the `sonifiers-core` library API (Registry, Runner, Mapping).
- **Dependencies**: Adds `sonifiers-core` as a dependency for the new web application.
