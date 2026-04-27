import * as Tone from 'tone';
import { ref, reactive, watch, onUnmounted } from 'vue';

export interface PurrParams {
  engine: 'classic' | 'buzz' | 'karplus';
  amp: number;
  baseFreq: number;
  purrRate: number;
  jitterRate: number;
  jitterDepth: number;
  impulseLPF: number;
  numHarmonics: number;
  f1Ratio: number;
  f1Amp: number;
  f1Decay: number;
  f2Ratio: number;
  f2Amp: number;
  f2Decay: number;
  rumbleAmp: number;
  rumbleCutoff: number;
  rumbleWidthRate: number;
  breathRate: number;
  breathDepth: number;
  reverbMix: number;
  reverbRoom: number;
  reverbDamp: number;
  atk: number;
  rel: number;
}

export const DEFAULT_PARAMS: PurrParams = {
  engine: 'classic',
  amp: 0.4,
  baseFreq: 40,
  purrRate: 28,
  jitterRate: 4,
  jitterDepth: 0.08,
  impulseLPF: 2.0,
  numHarmonics: 10,
  f1Ratio: 1.0,
  f1Amp: 0.5,
  f1Decay: 0.05,
  f2Ratio: 2.1,
  f2Amp: 0.35,
  f2Decay: 0.03,
  rumbleAmp: 0.25,
  rumbleCutoff: 1.8,
  rumbleWidthRate: 2,
  breathRate: 0.35,
  breathDepth: 0.3,
  reverbMix: 0.4,
  reverbRoom: 0.5,
  reverbDamp: 0.8,
  atk: 0.3,
  rel: 0.4,
};

export function usePurrSynth() {
  const isStarted = ref(false);
  const params = reactive({ ...DEFAULT_PARAMS });

  let mainGain: Tone.Gain;
  let breathGain: Tone.Gain;
  let reverb: Tone.Freeverb;
  let dryWet: Tone.CrossFade;
  
  let exciter: Tone.PulseOscillator;
  let exciterLPF: Tone.Filter;
  let jitterLFO: Tone.LFO;

  // Karplus-Strong nodes
  let noise: Tone.Noise;
  let noiseGate: Tone.Gain;
  let ksDelay: Tone.Delay;
  let ksFeedback: Tone.Gain;
  let ksLPF: Tone.Filter;
  let ksOut: Tone.Gain;

  let f1Res: Tone.Filter;
  let f2Res: Tone.Filter;
  let f1Gain: Tone.Gain;
  let f2Gain: Tone.Gain;

  let rumbleOsc: Tone.PulseOscillator;
  let rumbleLPF: Tone.Filter;
  let rumbleGain: Tone.Gain;
  let rumbleWidthLFO: Tone.LFO;

  let breathLFO: Tone.LFO;

  const RAMP_TIME = 0.03;

  function init() {
    mainGain = new Tone.Gain(0).toDestination();
    dryWet = new Tone.CrossFade(params.reverbMix).connect(mainGain);
    reverb = new Tone.Freeverb().connect(dryWet.b);
    
    breathGain = new Tone.Gain(1);
    breathGain.connect(dryWet.a);
    breathGain.connect(reverb);

    // Exciter (Pulse for classic/buzz, noise trigger for karplus)
    exciter = new Tone.PulseOscillator(params.purrRate, 0.01).start();
    exciterLPF = new Tone.Filter(params.baseFreq * params.impulseLPF, "lowpass");
    exciter.connect(exciterLPF);

    // Karplus-Strong Chain
    noise = new Tone.Noise("white").start();
    noiseGate = new Tone.Gain(0);
    noise.connect(noiseGate);
    
    // Use exciter to gate noise for KS burst
    // We'll use a separate gain controlled by the pulse
    const pulseToGate = new Tone.Gain(0);
    exciter.connect(pulseToGate); // Pulse is -1 to 1, we want 0 to 1
    // A simple trick to get 0-1 from pulse:
    const gateScale = new Tone.ScaleExp(0, 1); 
    exciter.connect(gateScale);
    gateScale.connect(noiseGate.gain);

    ksDelay = new Tone.Delay(1/20, 1);
    ksFeedback = new Tone.Gain(0.98);
    ksLPF = new Tone.Filter(params.baseFreq * 4, "lowpass");
    ksOut = new Tone.Gain(0);

    noiseGate.connect(ksDelay);
    ksDelay.connect(ksLPF);
    ksLPF.connect(ksFeedback);
    ksFeedback.connect(ksDelay);
    ksDelay.connect(ksOut);

    jitterLFO = new Tone.LFO(params.jitterRate, 0, 1).start();
    jitterLFO.connect(exciter.frequency);
    jitterLFO.connect(ksDelay.delayTime); // Optional: jitter the KS pitch too

    f1Res = new Tone.Filter(params.baseFreq * params.f1Ratio, "bandpass");
    f1Gain = new Tone.Gain(params.f1Amp).connect(breathGain);
    exciterLPF.connect(f1Res);
    ksOut.connect(f1Res); // Both sources feed into formants
    f1Res.connect(f1Gain);

    f2Res = new Tone.Filter(params.baseFreq * params.f2Ratio, "bandpass");
    f2Gain = new Tone.Gain(params.f2Amp).connect(breathGain);
    exciterLPF.connect(f2Res);
    ksOut.connect(f2Res);
    f2Res.connect(f2Gain);

    rumbleOsc = new Tone.PulseOscillator(params.purrRate, 0.5).start();
    jitterLFO.connect(rumbleOsc.frequency);
    rumbleLPF = new Tone.Filter(params.baseFreq * params.rumbleCutoff, "lowpass");
    rumbleGain = new Tone.Gain(params.rumbleAmp).connect(breathGain);
    rumbleOsc.connect(rumbleLPF);
    rumbleLPF.connect(rumbleGain);

    rumbleWidthLFO = new Tone.LFO(params.rumbleWidthRate, 0.3, 0.6).start();
    rumbleWidthLFO.connect(rumbleOsc.width);

    breathLFO = new Tone.LFO(params.breathRate, 1 - params.breathDepth, 1).start();
    breathLFO.connect(breathGain.gain);

    updateAll();
  }

  function updateAll() {
    if (!mainGain) return; // Wait for init

    // Engine Selection
    if (params.engine === 'karplus') {
      exciterLPF.gain.rampTo(0, RAMP_TIME);
      ksOut.gain.rampTo(1.5, RAMP_TIME); // KS needs a bit more gain
      ksDelay.delayTime.rampTo(1 / params.baseFreq, RAMP_TIME);
      ksLPF.frequency.rampTo(params.baseFreq * 8, RAMP_TIME);
    } else {
      ksOut.gain.rampTo(0, RAMP_TIME);
      exciterLPF.gain.rampTo(1, RAMP_TIME);
      const targetWidth = params.engine === 'classic' ? 0.01 : (1 / Math.max(1, params.numHarmonics));
      exciter.width.rampTo(targetWidth, RAMP_TIME);
    }

    // Timing
    jitterLFO.frequency.rampTo(params.jitterRate, RAMP_TIME);
    jitterLFO.min = params.purrRate * (1 - params.jitterDepth);
    jitterLFO.max = params.purrRate * (1 + params.jitterDepth);
    
    exciterLPF.frequency.rampTo(params.baseFreq * params.impulseLPF, RAMP_TIME);

    // Formants
    f1Res.frequency.rampTo(params.baseFreq * params.f1Ratio, RAMP_TIME);
    f1Gain.gain.rampTo(params.f1Amp, RAMP_TIME);
    f1Res.Q.rampTo(Math.PI * (params.baseFreq * params.f1Ratio) * params.f1Decay, RAMP_TIME);

    f2Res.frequency.rampTo(params.baseFreq * params.f2Ratio, RAMP_TIME);
    f2Gain.gain.rampTo(params.f2Amp, RAMP_TIME);
    f2Res.Q.rampTo(Math.PI * (params.baseFreq * params.f2Ratio) * params.f2Decay, RAMP_TIME);

    // Rumble
    rumbleLPF.frequency.rampTo(params.baseFreq * params.rumbleCutoff, RAMP_TIME);
    rumbleGain.gain.rampTo(params.rumbleAmp, RAMP_TIME);
    rumbleWidthLFO.frequency.rampTo(params.rumbleWidthRate, RAMP_TIME);

    // Breath
    breathLFO.frequency.rampTo(params.breathRate, RAMP_TIME);
    breathLFO.min = 1 - params.breathDepth;
    breathLFO.max = 1;

    // Spatial
    reverb.roomSize.rampTo(params.reverbRoom, RAMP_TIME);
    dryWet.fade.rampTo(params.reverbMix, RAMP_TIME);

    if (isStarted.value) {
      mainGain.gain.rampTo(params.amp, RAMP_TIME);
    }
  }

  watch(params, () => {
    updateAll();
  }, { deep: true });

  async function start() {
    if (isStarted.value) return;
    await Tone.start();
    if (!mainGain) init();
    mainGain.gain.rampTo(params.amp, params.atk);
    isStarted.value = true;
  }

  function stop() {
    if (!isStarted.value) return;
    mainGain.gain.rampTo(0, params.rel);
    isStarted.value = false;
  }

  function applyMapping(pitch: number, intensity: number, arousal: number) {
    params.baseFreq = 20 * Math.pow(40, pitch);
    params.purrRate = 15 + pitch * 65;
    params.amp = 0.15 + intensity * 0.55;
    params.f1Amp = 0.30 + intensity * 0.35;
    params.f2Amp = 0.20 + intensity * 0.25;
    params.rumbleAmp = 0.08 + intensity * 0.30;
    params.jitterDepth = 0.02 + arousal * 0.20;
    params.breathRate = 0.15 + arousal * 1.20;
    params.breathDepth = 0.10 + arousal * 0.35;
    params.reverbMix = 0.55 - arousal * 0.40;
    params.f1Decay = 0.08 - arousal * 0.05;
    params.f2Decay = 0.05 - arousal * 0.03;
  }

  onUnmounted(() => {
    stop();
  });

  return { params, isStarted, start, stop, applyMapping };
}
