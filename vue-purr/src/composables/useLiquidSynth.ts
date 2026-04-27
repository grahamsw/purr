import { ref, reactive, watch, onUnmounted } from 'vue';

export interface LiquidSynthParams {
  frequency: number;
  viscosity: number;
  volume: number;
  amp: number;
}

export const DEFAULT_LIQUID_PARAMS: LiquidSynthParams = {
  frequency: 40,
  viscosity: 0.5,
  volume: 0.5,
  amp: 0.5,
};

// Ensure this path is correct for the dev server (usually /audio/...)
const processorUrl = '/audio/LiquidResonatorProcessor.js';

export function useLiquidSynth() {
  const isStarted = ref(false);
  const isReady = ref(false);
  const error = ref<string | null>(null);
  const params = reactive({ ...DEFAULT_LIQUID_PARAMS });

  let context: AudioContext | null = null;
  let workletNode: AudioWorkletNode | null = null;
  let mainGain: GainNode | null = null;

  async function init() {
    if (isReady.value) return;
    error.value = null;

    try {
      context = new (window.AudioContext || (window as any).webkitAudioContext)();
      console.log('AudioContext created. State:', context.state);

      console.log('Attempting to add AudioWorklet module from:', processorUrl);
      
      // Standard fetch check to see if the file is even there
      const response = await fetch(processorUrl);
      if (!response.ok) {
        throw new Error(`Processor file not found at ${processorUrl} (Status: ${response.status})`);
      }

      await context.audioWorklet.addModule(processorUrl);
      console.log('AudioWorklet module added successfully');
      
      workletNode = new AudioWorkletNode(context, 'liquid-resonator-processor');
      mainGain = context.createGain();
      mainGain.gain.value = 0;
      
      workletNode.connect(mainGain);
      mainGain.connect(context.destination);

      updateParameters();
      isReady.value = true;
      console.log('LiquidResonatorProcessor initialization complete');
    } catch (e: any) {
      console.error('Liquid Synth Initialization Error:', e);
      error.value = e.message || 'Unknown initialization error';
      isReady.value = false;
    }
  }

  function playTestTone() {
    if (!context) return;
    const now = context.currentTime;
    // Delay by 100ms to allow audio hardware to "wake up"
    const startTime = now + 0.1;
    
    console.log('Playing test tone at', startTime);
    const osc = context.createOscillator();
    const g = context.createGain();
    
    osc.frequency.setValueAtTime(880, startTime); // Higher pitch (A5)
    g.gain.setValueAtTime(0, startTime);
    g.gain.linearRampToValueAtTime(0.1, startTime + 0.05);
    g.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.6);
    
    osc.connect(g);
    g.connect(context.destination);
    
    osc.start(startTime);
    osc.stop(startTime + 0.6);
  }

  function updateParameters() {
    if (!workletNode || !mainGain || !context) return;

    const freqParam = workletNode.parameters.get('frequency');
    const viscParam = workletNode.parameters.get('viscosity');
    const volParam = workletNode.parameters.get('volume');

    const now = context.currentTime;
    const rampTime = 0.05;

    if (freqParam) freqParam.setTargetAtTime(params.frequency, now, rampTime);
    if (viscParam) viscParam.setTargetAtTime(params.viscosity, now, rampTime);
    if (volParam) volParam.setTargetAtTime(params.volume, now, rampTime);

    if (isStarted.value) {
      mainGain.gain.setTargetAtTime(params.amp, now, rampTime);
    } else {
      mainGain.gain.setTargetAtTime(0, now, rampTime);
    }
  }

  watch(params, () => {
    updateParameters();
  }, { deep: true });

  async function start() {
    if (!isReady.value) {
      await init();
    }
    
    if (context) {
      if (context.state === 'suspended') {
        await context.resume();
      }
      playTestTone();
    }

    isStarted.value = true;
    updateParameters();
  }

  function stop() {
    isStarted.value = false;
    updateParameters();
  }

  onUnmounted(() => {
    if (workletNode) workletNode.disconnect();
    if (mainGain) mainGain.disconnect();
    if (context) context.close();
  });

  return {
    params,
    isStarted,
    isReady,
    error,
    start,
    stop,
  };
}
