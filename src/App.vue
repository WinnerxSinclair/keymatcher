<script setup>
import SaveFile from './components/SaveFile.vue';
import MatchInput from './components/MatchInput.vue';
import TheOptions from './components/TheOptions.vue';
import {ref} from 'vue';

const tab = ref('record')
</script>

<template>
  <div class="wrap">
      <button @click="tab = 'record'">Record</button>
      <button @click="tab = 'match'">Match</button>
      <button @click="tab = 'option'" class="ml-a">Options</button>
  </div>
  <br>
  <div id="app">
    <div class="flex-wrap">
      <SaveFile v-if="tab=='record'" />
    </div>
  <MatchInput v-if="tab=='match'" />
  <TheOptions v-if="tab=='option'" />
  
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  
  color: #2c3e50;
  
}
.ml-a{
  margin-left:auto;
}
.wrap{
  position:absolute;
  top:0;
  left:0;
  display:flex;
  justify-content: center;
  gap:1rem;
  width:100%;
}
.flex-wrap{
  display:flex;
  flex-direction: column;
  align-items: center;
  
}
</style>
