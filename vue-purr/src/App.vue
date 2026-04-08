<script setup lang="ts">
import PurrController from './components/PurrController.vue'
</script>

<template>
  <PurrController />
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
</style>
