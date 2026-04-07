/*******************
Cat Purr Synthesizer
OSC-controllable over UDP -- platform-agnostic.

Run directly in SC IDE on any machine, or via catpurr_bela.scd on Bela.
Uses whatever Server.default (s) is already configured.

OSC port 57120 (SC default):
  /purr/set       paramName  value(f)   -- low-level, direct
  /purr/pitch     value(f)   0-1
  /purr/intensity value(f)   0-1
  /purr/arousal   value(f)   0-1
  /purr/gate      1|0(i)     -- creates synth on 1, releases on 0
  /purr/ping                 -- responds /purr/pong to sender (health check)
*/

s.waitForBoot {

    SynthDef(\catPurr, {
        arg out = 0,
            amp  = 0.4,
            gate = 1,

            // -- Pitch centre --------------------------------------
            baseFreq = 40,

            // -- Purr rhythm --------------------------------------
            purrRate    = 28,
            jitterRate  = 4,
            jitterDepth = 0.08,
            impulseLPF  = 2.0,

            // -- F1 - chest fundamental (Ringz) -------------------
            f1Ratio  = 1.0,
            f1Amp    = 0.5,
            f1Decay  = 0.05,

            // -- F2 - throat/first overtone (Ringz) ---------------
            f2Ratio  = 2.1,
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

            // -- Rumble -------------------------------------------
            rumbleAmp       = 0.25,
            rumbleCutoff    = 1.8,
            rumbleWidthRate = 2,

            // -- Breath -------------------------------------------
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

        impulses = LPF.ar(Impulse.ar(rate), baseFreq * impulseLPF);

        f1 = Ringz.ar(impulses, freq: baseFreq * f1Ratio, decaytime: f1Decay) * f1Amp;
        f2 = Ringz.ar(impulses, freq: baseFreq * f2Ratio, decaytime: f2Decay) * f2Amp;

        noise = WhiteNoise.ar;
        f3 = BPF.ar(noise, freq: baseFreq * f3Ratio, rq: f3RQ) * f3Amp;
        f4 = BPF.ar(noise, freq: baseFreq * f4Ratio, rq: f4RQ) * f4Amp;

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

    SynthDef(\catPurr2, {
        arg out = 0,
            amp  = 0.4,
            gate = 1,

            // -- Pitch centre --------------------------------------
            baseFreq = 40,

            // -- Purr rhythm --------------------------------------
            purrRate    = 28,
            jitterRate  = 4,
            jitterDepth = 0.08,
            impulseLPF  = 2.0,

            // -- Blip specific ------------------------------------
            numHarmonics = 10,

            // -- F1 - chest fundamental (Ringz) -------------------
            f1Ratio  = 1.0,
            f1Amp    = 0.5,
            f1Decay  = 0.05,

            // -- F2 - throat/first overtone (Ringz) ---------------
            f2Ratio  = 2.1,
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

            // -- Rumble -------------------------------------------
            rumbleAmp       = 0.25,
            rumbleCutoff    = 1.8,
            rumbleWidthRate = 2,

            // -- Breath -------------------------------------------
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
        var pulses, f1, f2, f3, f4, rumble, noise;
        var sig, wet, env;

        jitter    = 1.0 + (LFNoise1.kr(jitterRate) * jitterDepth);
        rate      = purrRate * jitter;
        breathLo  = 1.0 - breathDepth;
        breathMod = SinOsc.kr(breathRate).range(breathLo, 1.0);

        // Alternative to Impulse: Blip provides a band-limited pulse train.
        // It sounds "fuller" and less "clicky" than a raw Impulse.
        // Scaled down (0.3) because Blip has much higher energy than Impulse.
        pulses = LPF.ar(Blip.ar(rate, numHarmonics, 0.3), baseFreq * impulseLPF);

        f1 = Ringz.ar(pulses, freq: baseFreq * f1Ratio, decaytime: f1Decay) * f1Amp;
        f2 = Ringz.ar(pulses, freq: baseFreq * f2Ratio, decaytime: f2Decay) * f2Amp;

        noise = WhiteNoise.ar;
        f3 = BPF.ar(noise, freq: baseFreq * f3Ratio, rq: f3RQ) * f3Amp;
        f4 = BPF.ar(noise, freq: baseFreq * f4Ratio, rq: f4RQ) * f4Amp;

        rumble = LPF.ar(
            Pulse.ar(rate, width: LFNoise1.kr(rumbleWidthRate).range(0.3, 0.6)),
            baseFreq * rumbleCutoff
        ) * rumbleAmp;

        sig = (f1 + f2 + f3 + f4 + rumble) * breathMod;
        wet = FreeVerb.ar(sig, mix: 1, room: reverbRoom, damp: reverbDamp);
        sig = (sig * (1 - reverbMix)) + (wet * reverbMix);
        env = EnvGen.kr(Env.asr(atk, 1, rel), gate: gate, doneAction: 2);

        // Additional 0.5 multiplier to bring overall level in line with Classic mode
        Out.ar(out, (sig * env * amp * 0.5) ! 2);
    }).add;

    s.sync;

    ~purr = nil;
    ~currentSynthName = \catPurr;

    OSCFunc({ |msg|
        var param = msg[1].asString;
        var value = msg[2].asFloat;
        ("OSC /purr/set  " ++ param ++ "  " ++ value).postln;
        ~purr.notNil.if { ~purr.set(param.asSymbol, value) };
    }, '/purr/set');

    OSCFunc({ |msg|
        var gateVal = msg[1].asInteger;
        var synthType = if(msg.size > 2) { msg[2].asInteger } { 0 };
        
        if (gateVal == 0) {
            ~purr.notNil.if { ~purr.set(\gate, 0) };
            "catPurr stopped.".postln;
        } {
            ~currentSynthName = if(synthType == 1) { \catPurr2 } { \catPurr };
            ~purr = Synth(~currentSynthName);
            ("catPurr started: " ++ ~currentSynthName).postln;
            ~applyMapping.value; // Re-apply current mapping to new synth
        };
    }, '/purr/gate');


    ~mapPitch     = 0.5;
    ~mapIntensity = 0.5;
    ~mapArousal   = 0.5;

    ~applyMapping = {
        var p = ~mapPitch, i = ~mapIntensity, a = ~mapArousal;
        ~purr.notNil.if {
            ~purr.set(
                \baseFreq,    20 * (40 ** p),
                \purrRate,    15 + (p * 65),
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

    OSCFunc({ |msg| ~mapPitch     = msg[1].asFloat.clip(0,1); ~applyMapping.value }, '/purr/pitch');
    OSCFunc({ |msg| ~mapIntensity = msg[1].asFloat.clip(0,1); ~applyMapping.value }, '/purr/intensity');
    OSCFunc({ |msg| ~mapArousal   = msg[1].asFloat.clip(0,1); ~applyMapping.value }, '/purr/arousal');

    // Health check -- responds /purr/pong to sender
    OSCFunc({ |msg, time, addr|
        addr.sendMsg('/purr/pong');
    }, '/purr/ping');

    "catPurr: OSC listeners ready on port 57120.".postln;
};
