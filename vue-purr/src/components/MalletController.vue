<script setup lang="ts">
import { useMalletSynth } from '../composables/useMalletSynth'

const { params, isStarted, isFlashing, start, stop, parameters } = useMalletSynth()

function toggleGate() {
  if (isStarted.value) {
    stop()
  } else {
    start()
  }
}
</script>

<template>
  <div :class="['mallet-shell', { 'flash': isFlashing }]">
    <header>
      <div class="title-block">
        <h1>Mallet</h1>
        <p>Wooden Box Modal Synth</p>
      </div>
      <div class="transport">
        <div :class="['status-dot', isStarted ? 'alive' : '']"></div>
        <span class="status-label">{{ isStarted ? 'online' : 'offline' }}</span>
        
        <button :class="['gate-btn', isStarted ? 'on' : '']" @click="toggleGate">
          {{ isStarted ? '■ stop' : '▶ start' }}
        </button>
      </div>
    </header>

    <div class="visualizer-container">
      <div 
        class="box-rect" 
        :style="{ 
          transform: `scale(${0.5 + (params.boxSize || 0.5)})`,
          borderWidth: `${1 + (params.force || 0.7) * 10}px`,
          boxShadow: `0 0 ${(params.resonance || 0.4) * 100}px var(--neon)`
        }"
      ></div>
    </div>

    <div class="controls-grid">
      <div v-for="p in parameters" :key="p.id" class="param">
        <div class="param-header">
          <span class="param-name">{{ p.name }}</span>
          <span class="param-value" v-if="p.type === 'number'">{{ params[p.id] }}</span>
        </div>

        <template v-if="p.type === 'number'">
          <input type="range" :min="p.min" :max="p.max" :step="p.step" v-model.number="params[p.id]" 
                 :style="{ '--pct': ((params[p.id] - (p.min || 0)) / ((p.max || 1) - (p.min || 0))) * 100 + '%' }">
        </template>

        <template v-else-if="p.type === 'choice'">
          <select v-model="params[p.id]" class="select-box">
            <option v-for="opt in p.options" :key="opt" :value="opt">{{ opt }}</option>
          </select>
        </template>

        <template v-else-if="p.type === 'boolean'">
          <input type="checkbox" v-model="params[p.id]">
        </template>
      </div>
    </div>

    <div class="footer-hint" v-if="!isStarted">
      Click START to enable AudioContext and begin striking.
    </div>
  </div>
</template>

<style scoped>
.mallet-shell {
  --neon: #00ff88;
  --bg-dark: #020b06;
  min-height: 100vh;
  max-width: 860px;
  margin: 0 auto;
  padding: 40px 24px 80px;
  transition: background-color 0.05s;
}

.mallet-shell.flash {
  background-color: rgba(0, 255, 136, 0.1);
}

header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  border-bottom: 1px solid #00ff8844;
  padding-bottom: 20px;
  margin-bottom: 32px;
  gap: 16px;
}

.title-block h1 {
  font-family: 'Space Mono', monospace;
  font-size: 36px;
  font-weight: 700;
  color: var(--neon);
  letter-spacing: -1px;
  line-height: 1;
  margin: 0;
  text-transform: uppercase;
}

.title-block p {
  color: #00ff88aa;
  margin: 6px 0 0;
  font-size: 10px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.transport {
  display: flex;
  align-items: center;
  gap: 12px;
}

.status-dot {
  width: 8px; height: 8px;
  border-radius: 50%;
  background: #1a3326;
  transition: background 0.3s;
}
.status-dot.alive {
  background: var(--neon);
  box-shadow: 0 0 8px var(--neon);
}

.status-label {
  font-size: 10px;
  color: #00ff8888;
  text-transform: uppercase;
  min-width: 64px;
}

.gate-btn {
  background: #05160d;
  border: 1px solid #00ff8844;
  color: var(--neon);
  font-family: 'Space Mono', monospace;
  font-size: 10px;
  padding: 8px 18px;
  border-radius: 4px;
  cursor: pointer;
  text-transform: uppercase;
}
.gate-btn:hover { border-color: var(--neon); }
.gate-btn.on { border-color: #ff4444; color: #ff4444; }

.select-box {
  background: #05160d;
  border: 1px solid #00ff8844;
  color: var(--neon);
  font-family: 'Space Mono', monospace;
  font-size: 10px;
  padding: 6px;
  border-radius: 4px;
  width: 100%;
}

.visualizer-container {
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 40px;
  background: #05160d;
  border-radius: 8px;
  border: 1px solid #00ff8822;
  overflow: hidden;
}

.box-rect {
  width: 80px;
  height: 80px;
  border: 2px solid var(--neon);
  transition: transform 0.1s, border-width 0.1s, box-shadow 0.1s;
}

.controls-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 24px;
}

.param { display: flex; flex-direction: column; gap: 8px; }
.param-header { display: flex; justify-content: space-between; }
.param-name { color: #00ff8888; font-size: 10px; text-transform: uppercase; }
.param-value { color: var(--neon); }

input[type=range] {
  -webkit-appearance: none;
  width: 100%;
  height: 4px;
  background: linear-gradient(to right, var(--neon) 0%, var(--neon) var(--pct), #1a3326 var(--pct), #1a3326 100%);
  border-radius: 2px;
  outline: none;
}

input[type=range]::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 14px; height: 14px;
  border-radius: 50%;
  background: var(--neon);
  border: 2px solid var(--bg-dark);
  cursor: pointer;
}

.footer-hint {
  text-align: center;
  color: #00ff8844;
  margin-top: 40px;
  font-size: 10px;
  text-transform: uppercase;
}
</style>
