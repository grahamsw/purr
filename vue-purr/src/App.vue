<script setup lang="ts">
import { ref } from 'vue'
import PurrController from './components/PurrController.vue'
import MalletController from './components/MalletController.vue'
import LiquidSynthController from './components/LiquidSynthController.vue'

const currentView = ref('purr')
</script>

<template>
  <nav class="main-nav">
    <button :class="{ active: currentView === 'purr' }" @click="currentView = 'purr'">Purr</button>
    <button :class="{ active: currentView === 'mallet' }" @click="currentView = 'mallet'">Mallet</button>
    <button :class="{ active: currentView === 'liquid' }" @click="currentView = 'liquid'">Liquid</button>
  </nav>
  
  <PurrController v-if="currentView === 'purr'" />
  <MalletController v-if="currentView === 'mallet'" />
  <LiquidSynthController v-if="currentView === 'liquid'" />
</template>

<style>
:root {
  --bg:        #0d0e10;
  --surface:   #13151a;
  --surface2:  #1c1f27;
  --border:    #2a2e3a;
  --accent:    #c8a96e;
  --accent2:   #7eb8c9;
  --danger:    #c96e6e;
  --text:      #d4cfc7;
  --text-dim:  #6b6860;
  --text-mute: #3a3830;
  --accent3:   #8ec49e;
  --radius:    6px;
  --track-h:   3px;
  --thumb-sz:  16px;
}

body {
  background: var(--bg);
  color: var(--text);
  font-family: 'Space Mono', monospace;
  font-size: 11px;
  line-height: 1.5;
  margin: 0;
  min-height: 100vh;
}

* { box-sizing: border-box; }

.main-nav {
  display: flex;
  justify-content: center;
  gap: 20px;
  padding: 20px;
  background: var(--surface);
  border-bottom: 1px solid var(--border);
}

.main-nav button {
  background: none;
  border: none;
  color: var(--text-dim);
  font-family: 'Space Mono', monospace;
  font-size: 12px;
  text-transform: uppercase;
  cursor: pointer;
  padding: 5px 10px;
  border-bottom: 2px solid transparent;
  transition: all 0.2s;
}

.main-nav button:hover {
  color: var(--text);
}

.main-nav button.active {
  color: var(--accent);
  border-bottom-color: var(--accent);
}
</style>
