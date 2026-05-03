import { ref, reactive, watch, onUnmounted } from 'vue';
import { PurrSynth } from '../../../packages/sonifiers-core/src/synths/PurrSynth';

export function usePurrSynth() {
  const isStarted = ref(false);
  
  const synth = new PurrSynth();
  const parameters = synth.getParameters();

  const params = reactive(
    parameters.reduce((acc, p) => {
      acc[p.id] = p.defaultValue;
      return acc;
    }, {} as Record<string, number>)
  );

  watch(params, (newParams) => {
    for (const id in newParams) {
      synth.setParam(id, newParams[id]);
    }
  }, { deep: true });

  async function start() {
    await synth.start();
    isStarted.value = true;
  }

  function stop() {
    synth.stop();
    isStarted.value = false;
  }

  function applyMapping(pitch: number, intensity: number, arousal: number) {
    // This mapping logic should ideally move to a dedicated mapping layer 
    // or be part of the library if it's universal. 
    // For now, we'll keep it here and map it to our 0-1 params.
    params.baseFreq = pitch;
    params.purrRate = pitch;
    params.amp = 0.15 + intensity * 0.55;
    params.f1Amp = 0.30 + intensity * 0.35;
    params.f2Amp = 0.20 + intensity * 0.25;
    params.rumbleAmp = 0.08 + intensity * 0.30;
    params.jitterDepth = 0.02 + arousal * 0.20;
    params.breathRate = arousal;
    params.breathDepth = 0.10 + arousal * 0.35;
  }

  onUnmounted(() => {
    synth.dispose();
  });

  return {
    params,
    isStarted,
    start,
    stop,
    applyMapping,
    parameters
  };
}
