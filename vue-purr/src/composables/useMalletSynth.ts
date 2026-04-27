import { ref, reactive, watch, onUnmounted } from 'vue';
import * as Tone from 'tone';

export interface MalletParams {
  boxSize: number;
  resonance: number;
  strikeRate: number;
  force: number;
  hardness: number;
  volume: number;
}

export const DEFAULT_MALLET_PARAMS: MalletParams = {
  boxSize: 50,
  resonance: 40,
  strikeRate: 2,
  force: 70,
  hardness: 50,
  volume: 70,
};

export function useMalletSynth() {
  const isStarted = ref(false);
  const params = reactive({ ...DEFAULT_MALLET_PARAMS });
  const isFlashing = ref(false);

  let timerId: ReturnType<typeof setTimeout> | null = null;
  let audioCtx: AudioContext;
  let masterGain: GainNode;

  function init() {
    audioCtx = Tone.getContext().rawContext as AudioContext;
    masterGain = audioCtx.createGain();
    masterGain.connect(audioCtx.destination);
    masterGain.gain.setValueAtTime(params.volume / 100, audioCtx.currentTime);
  }

  const strike = () => {
    if (!isStarted.value || !audioCtx) return;
    
    const now = audioCtx.currentTime;
    
    // 1. Create Noise Buffer
    const bufferSize = audioCtx.sampleRate * 0.05;
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noiseSource = audioCtx.createBufferSource();
    noiseSource.buffer = buffer;

    // 2. Setup Excitation
    const excitFilter = audioCtx.createBiquadFilter();
    excitFilter.type = "lowpass";
    excitFilter.frequency.value = 500 + (params.hardness / 100) * 14500;

    const excitGain = audioCtx.createGain();
    const impactLevel = (params.force / 100) * (params.volume / 100) * 2.0;
    excitGain.gain.setValueAtTime(impactLevel, now);
    excitGain.gain.exponentialRampToValueAtTime(0.001, now + 0.02);

    noiseSource.connect(excitFilter);
    excitFilter.connect(excitGain);

    // 3. Connect Modal Bank
    const baseFreqs = [120, 285, 410, 650];
    const sizeScale = 2.0 - (params.boxSize / 100) * 1.5; 

    baseFreqs.forEach(f => {
      const filter = audioCtx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.value = f * sizeScale;
      filter.Q.value = 5 + (params.resonance / 100) * 150;
      
      excitGain.connect(filter);
      filter.connect(masterGain);
    });

    noiseSource.start(now);
    noiseSource.stop(now + 0.05);

    // Visual feedback
    isFlashing.value = true;
    setTimeout(() => {
      isFlashing.value = false;
    }, 50);
  };

  const scheduleNextStrike = () => {
    if (!isStarted.value) return;
    strike();
    const interval = 1000 / params.strikeRate;
    timerId = setTimeout(scheduleNextStrike, interval);
  };

  async function start() {
    if (isStarted.value) return;
    if (!audioCtx) init();
    
    if (audioCtx.state === 'suspended') {
      await audioCtx.resume();
    }
    
    isStarted.value = true;
    scheduleNextStrike();
  }

  function stop() {
    isStarted.value = false;
    if (timerId) {
      clearTimeout(timerId);
      timerId = null;
    }
  }

  watch(() => params.volume, (newVol) => {
    if (masterGain && audioCtx) {
      masterGain.gain.setTargetAtTime(newVol / 100, audioCtx.currentTime, 0.03);
    }
  });

  onUnmounted(() => {
    stop();
  });

  return { params, isStarted, isFlashing, start, stop, strike };
}
