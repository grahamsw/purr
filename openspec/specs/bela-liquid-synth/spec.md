# Bela Liquid Synth

## Purpose
TBD - SuperCollider implementation of the liquid resonator model optimized for the Bela platform.

## Requirements

### Requirement: SuperCollider Implementation on Bela
The system SHALL implement the liquid resonator model as a SuperCollider SynthDef capable of running on the Bela platform.

#### Scenario: Running on Bela
- **WHEN** the `catpurr_bela.scd` file is executed on the Bela board
- **THEN** the SuperCollider server starts and the liquid synth becomes audible at ultra-low latency

### Requirement: FDN with Cubic Interpolation
The SuperCollider implementation SHALL use a Feedback Delay Network with cubic interpolation (`CombC`) to ensure high-fidelity pitch shifting and parameter modulation.

#### Scenario: Smooth Frequency Modulation
- **WHEN** the base frequency is modulated rapidly via OSC
- **THEN** the output audio pitch shifts smoothly without audible aliasing or stepping artifacts
