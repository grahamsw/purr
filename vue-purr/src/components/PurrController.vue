<script setup lang="ts">
import { usePurrSynth } from '../composables/usePurrSynth'
import { ref } from 'vue'

const { params, isStarted, start, stop, applyMapping, parameters } = usePurrSynth()

const pitch = ref(0.5)
const intensity = ref(0.5)
const arousal = ref(0.5)

const showLowLevel = ref(false)

function onMappingChange() {
  applyMapping(pitch.value, intensity.value, arousal.value)
}

// Initial mapping
onMappingChange()

function toggleGate() {
  if (isStarted.value) {
    stop()
  } else {
    start()
  }
}
</script>

<template>
  <div class="shell">
    <header>
      <div class="title-block">
        <h1>Purr</h1>
        <p>Zero-Dependency Web Audio Synth</p>
      </div>
      <div class="transport">
        <div :class="['status-dot', isStarted ? 'alive' : '']"></div>
        <span class="status-label">{{ isStarted ? 'online' : 'offline' }}</span>
        
        <button class="gate-btn" @click="showLowLevel = !showLowLevel">
          {{ showLowLevel ? 'hide' : 'show' }} params
        </button>
        <button :class="['gate-btn', isStarted ? 'on' : '']" @click="toggleGate">
          {{ isStarted ? '■ stop' : '▶ start' }}
        </button>
      </div>
    </header>

    <!-- Mapping Section -->
    <div class="mapping-section">
      <div class="section-label"><span>◈</span>Sonification</div>
      <div class="grid">
        <div class="param">
          <div class="param-header">
            <span class="param-name">pitch</span>
            <span class="param-value">{{ pitch.toFixed(2) }}</span>
          </div>
          <input type="range" min="0" max="1" step="0.01" v-model.number="pitch" 
                 @input="onMappingChange" :style="{ '--pct': pitch * 100 + '%' }">
        </div>

        <div class="param">
          <div class="param-header">
            <span class="param-name">intensity</span>
            <span class="param-value">{{ intensity.toFixed(2) }}</span>
          </div>
          <input type="range" min="0" max="1" step="0.01" v-model.number="intensity" 
                 @input="onMappingChange" :style="{ '--pct': intensity * 100 + '%' }">
        </div>

        <div class="param">
          <div class="param-header">
            <span class="param-name">arousal</span>
            <span class="param-value">{{ arousal.toFixed(2) }}</span>
          </div>
          <input type="range" min="0" max="1" step="0.01" v-model.number="arousal" 
                 @input="onMappingChange" :style="{ '--pct': arousal * 100 + '%' }">
        </div>
      </div>
    </div>

    <!-- Low Level Params -->
    <div v-if="showLowLevel" class="params-container">
      <div class="section">
        <div class="section-label"><span>◎</span>All Parameters</div>
        <div class="grid">
          <div v-for="p in parameters" :key="p.id" class="param">
            <div class="param-header">
              <span class="param-name">{{ p.name }}</span>
              <span class="param-value" v-if="p.type === 'number'">{{ params[p.id] }}</span>
            </div>
            
            <template v-if="p.type === 'number'">
              <input type="range" :min="p.min" :max="p.max" :step="p.step" v-model.number="params[p.id]" 
                     :style="{ '--pct': ((params[p.id] - p.min) / (p.max - p.min)) * 100 + '%' }">
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
      </div>
    </div>

    <div class="footer-hint" v-if="!isStarted">
      Click START to enable AudioContext and begin purring.
    </div>
  </div>
</template>

<style scoped>
.shell {
  max-width: 860px;
  margin: 0 auto;
  padding: 40px 24px 80px;
}

header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  border-bottom: 1px solid var(--border);
  padding-bottom: 20px;
  margin-bottom: 32px;
  gap: 16px;
}

.title-block h1 {
  font-family: 'Syne', sans-serif;
  font-size: 36px;
  font-weight: 400;
  color: var(--accent);
  letter-spacing: -0.5px;
  line-height: 1;
  margin: 0;
}

.title-block p {
  color: var(--text-dim);
  margin: 6px 0 0;
  font-size: 10px;
  letter-spacing: 0.08em;
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
  background: var(--text-mute);
  transition: background 0.3s;
}
.status-dot.alive {
  background: #6ebd8a;
  box-shadow: 0 0 8px #6ebd8a88;
}

.status-label {
  font-size: 10px;
  color: var(--text-dim);
  text-transform: uppercase;
  min-width: 64px;
}

.gate-btn {
  background: var(--surface2);
  border: 1px solid var(--border);
  color: var(--text);
  font-family: 'Space Mono', monospace;
  font-size: 10px;
  padding: 8px 18px;
  border-radius: var(--radius);
  cursor: pointer;
  text-transform: uppercase;
}
.gate-btn:hover { border-color: var(--accent); color: var(--accent); }
.gate-btn.on { border-color: var(--danger); color: var(--danger); }

.select-box {
  background: var(--surface2);
  border: 1px solid var(--border);
  color: var(--text);
  font-family: 'Space Mono', monospace;
  font-size: 10px;
  padding: 6px;
  border-radius: var(--radius);
  width: 100%;
}

.mapping-section {
  background: var(--surface);
  border: 1px solid #8ec49e33;
  border-radius: var(--radius);
  padding: 20px;
  margin-bottom: 32px;
}

.section-label {
  font-size: 9px;
  text-transform: uppercase;
  color: var(--text-dim);
  border-bottom: 1px solid var(--border);
  padding-bottom: 6px;
  margin-bottom: 18px;
}
.section-label span { color: var(--accent); margin-right: 8px; }

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
}

.param { display: flex; flex-direction: column; gap: 6px; }
.param-header { display: flex; justify-content: space-between; }
.param-name { color: var(--text-dim); font-size: 10px; }
.param-value { color: var(--accent); }

input[type=range] {
  -webkit-appearance: none;
  width: 100%;
  height: var(--track-h);
  background: linear-gradient(to right, var(--accent) 0%, var(--accent) var(--pct), var(--surface2) var(--pct), var(--surface2) 100%);
  border-radius: 2px;
  outline: none;
}

input[type=range]::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: var(--thumb-sz); height: var(--thumb-sz);
  border-radius: 50%;
  background: var(--accent);
  border: 2px solid var(--bg);
}

.footer-hint {
  text-align: center;
  color: var(--text-mute);
  margin-top: 40px;
  font-size: 10px;
}

.section { margin-bottom: 24px; }
</style>
