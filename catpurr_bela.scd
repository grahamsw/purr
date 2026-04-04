/*******************
Bela hardware configuration for catpurr.
Sets Bela-specific server options, then loads catpurr.scd.

On Bela: use this file as the project _main.scd.
In SC IDE: run catpurr.scd directly instead.
*/

s = Server.default;
s.options.numAnalogInChannels  = 2;
s.options.numAnalogOutChannels = 2;
s.options.numDigitalChannels   = 0;
s.options.maxLogins            = 4;
s.options.bindAddress          = "0.0.0.0";
s.options.blockSize            = 16;
s.options.numInputBusChannels  = 2;
s.options.numOutputBusChannels = 2;
s.options.memSize              = 8192 * 4;

load(thisProcess.nowExecutingPath.dirname +/+ "catpurr.scd");

ServerQuit.add({ 0.exit });
