// bela_control.js
// Handles communication between HTML sliders and the osc-bridge

const BRIDGE_URL = 'http://localhost:3131';

const elements = {
    freq: { slider: document.getElementById('freq-slider'), val: document.getElementById('freq-val'), addr: '/liquid/frequency' },
    visc: { slider: document.getElementById('visc-slider'), val: document.getElementById('visc-val'), addr: '/liquid/viscosity' },
    vol:  { slider: document.getElementById('vol-slider'),  val: document.getElementById('vol-val'),  addr: '/liquid/volume' },
    power: document.getElementById('power-btn'),
    statusDot: document.getElementById('status-dot'),
    statusText: document.getElementById('status-text')
};

let isPowered = false;

// 1. Send OSC message via bridge
async function sendOsc(address, value) {
    try {
        await fetch(`${BRIDGE_URL}/send`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                address: address,
                args: [{ type: 'f', value: parseFloat(value) }]
            })
        });
    } catch (err) {
        console.error('Bridge error:', err);
    }
}

// 2. Setup Slider Listeners
Object.keys(elements).forEach(key => {
    const group = elements[key];
    if (group.slider) {
        group.slider.addEventListener('input', (e) => {
            const val = e.target.value;
            group.val.textContent = key === 'freq' ? `${val} Hz` : val;
            if (isPowered) sendOsc(group.addr, val);
        });
    }
});

// 3. Power Button Toggle
elements.power.addEventListener('click', () => {
    isPowered = !isPowered;
    elements.power.textContent = isPowered ? 'Power On' : 'Power Off';
    elements.power.classList.toggle('active', isPowered);
    
    // Send gate message
    fetch(`${BRIDGE_URL}/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            address: '/liquid/gate',
            args: [{ type: 'i', value: isPowered ? 1 : 0 }]
        })
    });

    // If powering on, sync current slider values
    if (isPowered) {
        Object.keys(elements).forEach(key => {
            const group = elements[key];
            if (group.slider) sendOsc(group.addr, group.slider.value);
        });
    }
});

// 4. Status Polling
async function checkStatus() {
    try {
        const res = await fetch(`${BRIDGE_URL}/status`);
        const status = await res.json();
        
        // The bridge returns scAlive if IT got a pong from SC.
        // We'll trust the bridge's life-check for now.
        elements.statusDot.classList.toggle('online', status.scAlive);
        elements.statusText.textContent = status.scAlive ? `Online (${status.scHost})` : 'Offline';
    } catch (err) {
        elements.statusDot.classList.remove('online');
        elements.statusText.textContent = 'Bridge Disconnected';
    }
}

setInterval(checkStatus, 2000);
checkStatus();
