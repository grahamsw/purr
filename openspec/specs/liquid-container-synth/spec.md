# Liquid Container Synth

## Purpose
TBD - Physical modeling synthesizer simulating the resonance of liquid in a container.

## Requirements

### Requirement: Low-Frequency Oscillator (LFO) Resonator
The system SHALL implement a primary excitation source using a low-frequency oscillator capable of vibrating between 5Hz and 50Hz.

#### Scenario: Adjusting Resonator Frequency
- **WHEN** the user modifies the resonator frequency slider
- **THEN** the excitation frequency of the physical model updates in real-time within the 5Hz to 50Hz range

### Requirement: Liquid Resonance Physical Model
The system SHALL model the acoustic response of a large container filled with liquid, responding to the resonator's vibrations.

#### Scenario: Simulating High Viscosity
- **WHEN** the user increases the liquid viscosity parameter
- **THEN** the resonance decay time decreases and high-frequency harmonics are dampened in the output audio

#### Scenario: Simulating Volume Changes
- **WHEN** the user increases the liquid volume parameter
- **THEN** the fundamental resonance frequencies shift downward to simulate a larger mass of liquid

### Requirement: Real-time Audio Control Interface
The system SHALL provide a user interface to control the synthesizer parameters in real-time using WebAudio.

#### Scenario: Start/Stop Audio
- **WHEN** the user toggles the synth power state
- **THEN** the WebAudio context is resumed or suspended accordingly, starting or stopping the resonance simulation
