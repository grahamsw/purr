import { ref, reactive, watch, onUnmounted } from 'vue';
import { MalletSynth } from '../../../packages/sonifiers-core/src/synths/MalletSynth';

export function useMalletSynth() {
  const isStarted = ref(false);
  const isFlashing = ref(false);
  
  const synth = new MalletSynth();
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

  onUnmounted(() => {
    synth.dispose();
  });

  return {
    params,
    isStarted,
    isFlashing,
    start,
    stop,
    parameters
  };
}
