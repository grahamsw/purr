#!/usr/bin/env node
// ─────────────────────────────────────────────────────────────────
//  osc-bridge.js  —  HTTP → OSC bridge for the Cat Purr UI
//
//  Install deps:  npm install osc express cors
//  Run:           node osc-bridge.js
//  Then open:     index.html in your browser
// ─────────────────────────────────────────────────────────────────

const express = require('express');
const cors    = require('cors');
const osc     = require('osc');

const HTTP_PORT = 3131;
const SC_HOST   = '192.168.1.43'; // Bela WiFi address
const SC_PORT   = 57120;

// ── OSC UDP port ─────────────────────────────────────────────────
const udpPort = new osc.UDPPort({
    localAddress: '0.0.0.0',
    localPort:    0,          // OS picks a free port for sending
    remoteAddress: SC_HOST,
    remotePort:    SC_PORT,
    metadata: true
});

udpPort.open();
udpPort.on('ready', () => {
    console.log(`OSC UDP port open → ${SC_HOST}:${SC_PORT}`);
});

// ── Express HTTP server ──────────────────────────────────────────
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
        console.log(`OSC ${address}  ${args.map(a => a.value).join('  ')}`);
        res.json({ ok: true });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: e.message });
    }
});

app.listen(HTTP_PORT, () => {
    console.log(`HTTP bridge listening on http://localhost:${HTTP_PORT}`);
    console.log('Open index.html in your browser to start purring.');
});
