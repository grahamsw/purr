/*******************
Cat Purr Synthesizer - Bela Gem / PocketBeagle 2
OSC-controllable via WiFi

Formant bank design:
  All formant frequencies are ratios * baseFreq.
  A single baseFreq shifts the entire spectral character coherently.
  F1, F2 = Ringz on filtered impulses (transient ring, low body)
  F3, F4 = BPF on noise (sustained upper resonance, breath texture)

Sonification mapping layer -- /purr/pitch, /purr/intensity, /purr/arousal:
  pitch     -> baseFreq (20-800 Hz exp) + purrRate (15-80 Hz)
  intensity -> amp + formant amps
  arousal   -> jitterDepth + breathRate + reverbMix + decays

Web UI sends to 192.168.1.43:57120
  /purr/set       paramName(s)  value(f)   -- low-level, direct
  /purr/pitch     value(f)  0-1
  /purr/intensity value(f)  0-1
  /purr/arousal   value(f)  0-1
  /purr/gate      1|0(i)             -- starts synth on 1, stops on 0
*/

s = Server.default;

// Set up options for the Bela
s.options.numAnalogInChannels  = 2;
s.options.numAnalogOutChannels = 2;
s.options.numDigitalChannels   = 0;
s.options.maxLogins            = 4;
s.options.bindAddress          = "0.0.0.0";

s.options.blockSize            = 16;
s.options.numInputBusChannels  = 2;
s.options.numOutputBusChannels = 2;
s.options.memSize              = 8192 * 4;

s.waitForBoot {

    SynthDef(\catPurr, {
        arg out = 0,
            amp  = 0.4,
            gate = 1,

            // -- Pitch centre --------------------------------------
            // All formant freqs = baseFreq * their ratio.
            // This is the primary pitch control for sonification.
            baseFreq = 40,          // Hz

            // -- Purr rhythm --------------------------------------
            purrRate    = 28,       // glottal pulse rate Hz
            jitterRate  = 4,        // jitter wander speed Hz
            jitterDepth = 0.08,     // fractional jitter depth (0-0.4)
            impulseLPF  = 2.0,      // LPF on impulse as ratio of baseFreq

            // -- F1 - chest fundamental (Ringz) -------------------
            f1Ratio  = 1.0,
            f1Amp    = 0.5,
            f1Decay  = 0.05,        // s

            // -- F2 - throat/first overtone (Ringz) ---------------
            f2Ratio  = 2.1,         // slightly stretched octave
            f2Amp    = 0.35,
            f2Decay  = 0.03,

            // -- F3 - upper chest (BPF on noise) ------------------
            f3Ratio  = 4.5,
            f3Amp    = 0.07,
            f3RQ     = 0.45,

            // -- F4 - nasal texture (BPF on noise) ----------------
            f4Ratio  = 9.0,
            f4Amp    = 0.03,
            f4RQ     = 0.35,

            // -- Rumble (low pulse + LPF) -------------------------
            rumbleAmp       = 0.25,
            rumbleCutoff    = 1.8,  // ratio of baseFreq
            rumbleWidthRate = 2,

            // -- Breath modulation --------------------------------
            breathRate  = 0.35,
            breathDepth = 0.3,

            // -- Reverb -------------------------------------------
            reverbMix  = 0.4,
            reverbRoom = 0.5,
            reverbDamp = 0.8,

            // -- Envelope -----------------------------------------
            atk = 0.3,
            rel = 0.4;

        var jitter, rate, breathLo, breathMod;
        var impulses, f1, f2, f3, f4, rumble, noise;
        var sig, wet, env;

        jitter    = 1.0 + (LFNoise1.kr(jitterRate) * jitterDepth);
        rate      = purrRate * jitter;
        breathLo  = 1.0 - breathDepth;
        breathMod = SinOsc.kr(breathRate).range(breathLo, 1.0);

        // Shared impulse source - LPF cutoff tracks baseFreq
        impulses = LPF.ar(Impulse.ar(rate), baseFreq * impulseLPF);

        // F1 + F2: transient Ringz driven by impulses
        f1 = Ringz.ar(impulses, freq: baseFreq * f1Ratio, decaytime: f1Decay) * f1Amp;
        f2 = Ringz.ar(impulses, freq: baseFreq * f2Ratio, decaytime: f2Decay) * f2Amp;

        // F3 + F4: sustained resonance from noise
        noise = WhiteNoise.ar;
        f3 = BPF.ar(noise, freq: baseFreq * f3Ratio, rq: f3RQ) * f3Amp;
        f4 = BPF.ar(noise, freq: baseFreq * f4Ratio, rq: f4RQ) * f4Amp;

        // Rumble: low pulse, cutoff also tracks baseFreq
        rumble = LPF.ar(
            Pulse.ar(rate, width: LFNoise1.kr(rumbleWidthRate).range(0.3, 0.6)),
            baseFreq * rumbleCutoff
        ) * rumbleAmp;

        sig = (f1 + f2 + f3 + f4 + rumble) * breathMod;
        wet = FreeVerb.ar(sig, mix: 1, room: reverbRoom, damp: reverbDamp);
        sig = (sig * (1 - reverbMix)) + (wet * reverbMix);
        env = EnvGen.kr(Env.asr(atk, 1, rel), gate: gate, doneAction: 2);

        Out.ar(out, (sig * env * amp) ! 2);
    }).add;

    s.sync;

    // Synth starts nil -- waits for /purr/gate 1
    ~purr = nil;

    // -- Low-level: /purr/set  paramName  value -------------------
    ~purrOSC = OSCFunc({ |msg|
        var param = msg[1].asString;
        var value = msg[2].asFloat;
        ("OSC /purr/set  " ++ param ++ "  " ++ value).postln;
        ~purr.notNil.if { ~purr.set(param.asSymbol, value) };
    }, '/purr/set');

    // -- Low-level: /purr/gate  1|0 -------------------------------
    ~purrGate = OSCFunc({ |msg|
        var gateVal = msg[1].asInteger;
        if (gateVal == 0) {
            ~purr.notNil.if { ~purr.set(\gate, 0) };
            "catPurr stopped.".postln;
        } {
            ~purr = Synth(\catPurr);
            "catPurr started.".postln;
        };
    }, '/purr/gate');

    // -- High-level mapping state ---------------------------------
    ~mapPitch     = 0.5;
    ~mapIntensity = 0.5;
    ~mapArousal   = 0.5;

    ~applyMapping = {
        var p = ~mapPitch, i = ~mapIntensity, a = ~mapArousal;
        ~purr.notNil.if {
            ~purr.set(
                \baseFreq,    20 * (40 ** p),      // exp: 20-800 Hz
                \purrRate,    15 + (p * 65),        // 15-80 Hz
                \amp,         0.15 + (i * 0.55),
                \f1Amp,       0.30 + (i * 0.35),
                \f2Amp,       0.20 + (i * 0.25),
                \rumbleAmp,   0.08 + (i * 0.30),
                \jitterDepth, 0.02 + (a * 0.20),
                \breathRate,  0.15 + (a * 1.20),
                \breathDepth, 0.10 + (a * 0.35),
                \reverbMix,   0.55 - (a * 0.40),
                \f1Decay,     0.08 - (a * 0.05),
                \f2Decay,     0.05 - (a * 0.03)
            );
            ("Mapping  pitch=" ++ p ++ "  intensity=" ++ i ++ "  arousal=" ++ a).postln;
        };
    };

    // -- High-level: /purr/pitch  /purr/intensity  /purr/arousal --
    OSCFunc({ |msg| ~mapPitch     = msg[1].asFloat.clip(0,1); ~applyMapping.value }, '/purr/pitch');
    OSCFunc({ |msg| ~mapIntensity = msg[1].asFloat.clip(0,1); ~applyMapping.value }, '/purr/intensity');
    OSCFunc({ |msg| ~mapArousal   = msg[1].asFloat.clip(0,1); ~applyMapping.value }, '/purr/arousal');

    "OSC listeners ready on port 57120.".postln;
};

ServerQuit.add({ 0.exit });
