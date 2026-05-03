# Specification: Mallet — Wooden Box Synth

This document provides instructions for recreating the **Mallet Synth**—a modal synthesis engine that simulates the sound of a wooden box being struck.

## 1. Technical Stack
- **Framework:** Vue 3 (Composition API).
- **Audio Engine:** Web Audio API (Native).
- **Styling:** Vanilla CSS (Dark/Terminal aesthetic).

## 2. Audio Architecture (Modal Synthesis)

### Excitation Source
- **Type:** Short White Noise Burst (0.05 seconds).
- **Processing:** 
  - **Excitation Filter:** `BiquadFilter` (lowpass).
    - Frequency: 500Hz to 15,000Hz (mapped from **Hardness** parameter).
  - **Excitation Gain:** `GainNode` with an exponential ramp.
    - Start: `impactLevel` (calculated from Volume * Force).
    - End: 0.001 over 0.02 seconds.

### Resonator Bank (The "Box")
- **Type:** Parallel bank of 4 `BiquadFilter` nodes (bandpass).
- **Base Frequencies:** `[120, 285, 410, 650]` Hz.
- **Scaling:** Frequencies are scaled by a `sizeScale` (calculated from **Box Size** parameter).
  - Formula: `2.0 - (boxSize / 100 * 1.5)`.
- **Resonance (Q):** Mapped from **Resonance** parameter.
  - Formula: `5 + (resonance / 100 * 150)`.

## 3. State & Parameters

| Parameter | Range | Default | Unit | Description |
|-----------|-------|---------|------|-------------|
| **Box Size** | 1–100 | 50 | % | Scales the resonator frequencies (larger = lower). |
| **Resonance** | 1–100 | 40 | % | Adjusts the Q factor/decay time of the filters. |
| **Strike Rate** | 0.1–50 | 2 | Hz | Frequency of the automatic periodic strike. |
| **Force** | 1–100 | 70 | % | Amplitude of the excitation burst. |
| **Hardness** | 1–100 | 50 | % | Cutoff frequency of the excitation low-pass filter. |
| **Volume** | 0–100 | 70 | % | Master output gain. |

## 4. UI/UX Requirements

### Visualizer
- **Box Rect:** A central rectangle that scales based on `Box Size`.
- **Visual Feedback:** 
  - Border width increases with `Force`.
  - Box Shadow (glow) increases with `Resonance`.
  - **Flash:** A full-container overlay that flashes white/green briefly on every `strike()`.

### Layout
- Clean, monospace font (e.g., 'Courier New' or 'Space Mono').
- Dark background (`#020b06`) with neon green highlights (`#00ff88`).
- Sliders should be vertical or in a clean grid with value labels.

## 5. Logic Implementation

### The Strike Function
```javascript
const strike = () => {
  const now = audioCtx.currentTime;
  
  // 1. Create Noise Buffer
  const noiseSource = audioCtx.createBufferSource();
  // ... fill with random values ...

  // 2. Setup Excitation
  const excitFilter = audioCtx.createBiquadFilter();
  excitFilter.type = "lowpass";
  excitFilter.frequency.value = 500 + (malletHardness.value / 100) * 14500;

  const excitGain = audioCtx.createGain();
  const impactLevel = (strikeForce.value / 100) * (volume.value / 100) * 2.0;
  excitGain.gain.setValueAtTime(impactLevel, now);
  excitGain.gain.exponentialRampToValueAtTime(0.001, now + 0.02);

  // 3. Connect Modal Bank
  const baseFreqs = [120, 285, 410, 650];
  const sizeScale = 2.0 - (boxSize.value / 100) * 1.5; 
  const masterGain = audioCtx.createGain();
  masterGain.connect(audioCtx.destination);

  baseFreqs.forEach(f => {
    const filter = audioCtx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = f * sizeScale;
    filter.Q.value = 5 + (resonance.value / 100) * 150;
    excitGain.connect(filter);
    filter.connect(masterGain);
  });

  noiseSource.start(now);
};
```

### Scheduling
Use a recursive `setTimeout` loop controlled by `strikeRate` to trigger the `strike()` function. Ensure `audioCtx.resume()` is called on user interaction.
