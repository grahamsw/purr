import { ref, reactive, watch, onUnmounted } from 'vue';
import { LiquidSynth } from '../../../packages/sonifiers-core/src/synths/LiquidSynth';

// Ensure this path is correct for the dev server (usually /audio/...)
const processorUrl = '/audio/LiquidResonatorProcessor.js';

export function useLiquidSynth() {
  const isStarted = ref(false);
  const isReady = ref(false);
  const error = ref<string | null>(null);
  
  const synth = new LiquidSynth(processorUrl);
  const parameters = synth.getParameters();
  
  // Initialize reactive params with default values from synth
  const params = reactive(
    parameters.reduce((acc, p) => {
      acc[p.id] = p.defaultValue;
      return acc;
    }, {} as Record<string, number>)
  );

  async function init() {
    if (isReady.value) return;
    try {
      await synth.init();
      isReady.value = true;
    } catch (e: any) {
      error.value = e.message || 'Initialization failed';
    }
  }

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

  onUnmounted(() => {
    synth.dispose();
  });

  return {
    params,
    isStarted,
    isReady,
    error,
    start,
    stop,
    parameters
  };
}
