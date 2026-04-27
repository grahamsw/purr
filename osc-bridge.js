#!/usr/bin/env node
//  osc-bridge.js  --  HTTP -> OSC bridge for the Cat Purr UI
//
//  SC host:  --sc-host=<ip>  or  SC_HOST env var  (default: 127.0.0.1)
//
//  Install deps:  npm install osc express cors
//  Run:           node osc-bridge.js [--sc-host=192.168.1.43]
//  Then open:     index.html in your browser

const express = require('express');
const cors    = require('cors');
const osc     = require('osc');

const HTTP_PORT          = 3131;
const SC_PORT            = 57120;
const BRIDGE_LISTEN_PORT = 57200;  // bridge listens here for pong from SC

// SC host: --sc-host= arg, SC_HOST env, or localhost
const hostArg = process.argv.find(a => a.startsWith('--sc-host='));
const SC_HOST = hostArg
    ? hostArg.split('=')[1]
    : (process.env.SC_HOST || '192.168.1.43');

const udpPort = new osc.UDPPort({
    localAddress:  '0.0.0.0',
    localPort:     BRIDGE_LISTEN_PORT,
    remoteAddress: SC_HOST,
    remotePort:    SC_PORT,
    metadata: true
});

let scLastPong = 0;

udpPort.on('message', (msg) => {
    if (msg.address === '/liquid/pong') scLastPong = Date.now();
});

udpPort.open();
udpPort.on('ready', () => {
    console.log('OSC UDP -> ' + SC_HOST + ':' + SC_PORT + '  (listening on ' + BRIDGE_LISTEN_PORT + ')');
    setTimeout(sendPing, 1000);
});
udpPort.on('error', (err) => console.error('OSC error:', err.message));

function sendPing() {
    try { udpPort.send({ address: '/liquid/ping', args: [] }); } catch (e) {}
}
setInterval(sendPing, 5000);

const app = express();
app.use(cors());
app.use(express.json());

// POST /send  { address, args: [{type, value}, ...] }
app.post('/send', (req, res) => {
    const { address, args } = req.body;
    if (!address || !Array.isArray(args)) {
        return res.status(400).json({ error: 'address and args required' });
    }
    try {
        udpPort.send({ address, args });
        console.log('OSC ' + address + '  ' + args.map(a => a.value).join('  '));
        res.json({ ok: true });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: e.message });
    }
});

// GET /status  -- SC connectivity check
app.get('/status', (req, res) => {
    const scAlive = scLastPong > 0 && (Date.now() - scLastPong) < 10000;
    res.json({ scAlive, scHost: SC_HOST, scPort: SC_PORT });
});

app.listen(HTTP_PORT, () => {
    console.log('HTTP bridge on http://localhost:' + HTTP_PORT);
    console.log('SC target: ' + SC_HOST + ':' + SC_PORT);
    console.log('Open index.html in your browser.');
});
