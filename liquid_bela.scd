/*******************
Liquid Synth (Bela Port)
OSC-controllable over UDP.
*******************/

s.waitForBoot {

    SynthDef(\liquidBela, {
        arg out = 0,
            amp = 0.4,
            gate = 1,

            // Core Parameters
            baseFreq = 40,    // Maps to liquid volume/mass
            viscosity = 0.5, // Feedback gain/damping
            resonance = 0.95, // Decay time

            // LFO Resonator
            lfoFreq = 15,
            lfoDepth = 0.5,

            // Envelope
            atk = 0.1,
            rel = 0.5;

        var excitation, fdn, sig, wet, env;
        var numLines = 8;
        var delays;

        // 1. Excitation Source (Sine LFO + PinkNoise) - Boosted Gain
        excitation = SinOsc.ar(lfoFreq) * lfoDepth;
        excitation = (excitation + PinkNoise.ar(0.1)) * 2.0; 
        excitation = LPF.ar(excitation, baseFreq * 6); // Brighter excitation

        // 2. Feedback Delay Network (FDN)
        delays = Array.fill(numLines, { |i|
            var delayTime = (1 / baseFreq) * (1.1 ** i);
            // Using softclip inside the Comb filter logic (emulated via higher resonance + clip)
            // Boosting resonance significantly
            var fb = resonance * viscosity * 12.0; 
            CombC.ar(excitation, 0.2, delayTime, fb).softclip;
        });

        // Sum and mix delay lines
        fdn = delays.sum / (numLines * 0.5); // Less attenuation on sum

        // 3. Final Signal Path
        sig = fdn * amp;
        
        // Simple built-in reverb
        wet = FreeVerb.ar(sig, 0.4, 0.8, 0.5);
        sig = (sig * 0.6) + (wet * 0.4);

        env = EnvGen.kr(Env.asr(atk, 1, rel), gate: gate, doneAction: 2);

        Out.ar(out, (sig * env) ! 2);
    }).add;

    s.sync;

    // --- TEST STARTUP SOUND ---
    { 
        var sig = SinOsc.ar(880, 0, 0.2) * EnvGen.kr(Env.perc(0.01, 0.5), doneAction: 2);
        Out.ar(0, sig ! 2);
    }.play;
    "Liquid Synth: Startup test beep played.".postln;

    ~liquid = nil;

    // OSC Control: Power/Gate
    OSCFunc({ |msg|
        var gateVal = msg[1].asInteger;
        ("OSC /liquid/gate " ++ gateVal).postln;
        
        if (gateVal == 0) {
            ~liquid.notNil.if { ~liquid.set(\gate, 0); ~liquid = nil; };
            "Liquid Synth stopped.".postln;
        } {
            if (~liquid.isNil) {
                // Play a tiny blip whenever we start to confirm OSC reached SC
                { SinOsc.ar(1200, 0, 0.1) * EnvGen.kr(Env.perc(0.005, 0.1), doneAction: 2) }.play;
                
                ~liquid = Synth(\liquidBela);
                "Liquid Synth started.".postln;
            };
        };
    }, '/liquid/gate');

    // OSC Control: Parameters
    OSCFunc({ |msg|
        var val = msg[1].asFloat;
        ~liquid.notNil.if { ~liquid.set(\baseFreq, val); };
    }, '/liquid/frequency');

    OSCFunc({ |msg|
        var val = msg[1].asFloat;
        ~liquid.notNil.if { ~liquid.set(\viscosity, val); };
    }, '/liquid/viscosity');

    OSCFunc({ |msg|
        var val = msg[1].asFloat;
        ~liquid.notNil.if { ~liquid.set(\amp, val); };
    }, '/liquid/volume');

    // Health check
    OSCFunc({ |msg, time, addr|
        addr.sendMsg('/liquid/pong');
    }, '/liquid/ping');

    "Liquid Synth: OSC listeners ready on port 57120.".postln;
};
