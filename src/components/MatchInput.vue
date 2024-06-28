<script setup>
import { onMounted, onUnmounted, ref } from 'vue';


const isListening = ref(false);
const timer = ref(0);
const intervalId = ref(null);
const keyLogArr = ref([])
const savedLogs = ref({})
const selectedLog = ref(null);
const currentLog = ref(null);
const compare = ref([]);
const count = ref(0);
function handleKeyPress(event) {
  if (currentLog.value && (event.key == currentLog.value[count.value].kee)) {
    keyLogArr.value.push({ kee: event.key, time: timer.value });
    const x = timer.value - currentLog.value[count.value].time;
    compare.value.push(x);
    count.value++;
  }else{
    return;
  }
  if(count.value>currentLog.value.length-1){
    console.log('xd')
    stop();
    return;
  }
  if (intervalId.value === null) {
    intervalId.value = setInterval(() => {
      timer.value += 1;
    }, 1);
  }
}
function stop(){
  if (intervalId.value !== null) {
    clearInterval(intervalId.value);
    intervalId.value = null;
    console.log(intervalId.value)
    timer.value = 0;
  }
  isListening.value = false;
  window.removeEventListener('keydown', handleKeyPress);
  
}

function start() {
  count.value = 0;
  keyLogArr.value = [];
  compare.value = [];
  currentLog.value = savedLogs.value[selectedLog.value];
  if (!isListening.value) {
    window.addEventListener('keydown', handleKeyPress);
    isListening.value = true;
  }
}
function reset(){
  if (intervalId.value !== null) {
    clearInterval(intervalId.value);
    intervalId.value = null;
    console.log(intervalId.value)
    timer.value = 0;
  }
  isListening.value = false;
  window.removeEventListener('keydown', handleKeyPress);
}
function restart(){
  reset();
  start();
}
async function loadFiles(){
  const response = await window.electron.readFile();
  const existingLogs = response.success ? JSON.parse(response.content) : {};
  const keys = Object.keys(existingLogs);
  console.log(keys[0])
  selectedLog.value = keys[0];
  savedLogs.value = existingLogs;
  
}
const restartMacro = (event) => {
  if (event.key === '3') {
    restart();
  }
};
const startMacro = (event) => {
  if (event.key === '2') {
    start();
  }
};
onMounted(()  => {
  loadFiles();
  window.addEventListener('keydown', restartMacro);
  window.addEventListener('keydown', startMacro);
})

onUnmounted(() => {
  if (intervalId.value !== null) {
    clearInterval(intervalId.value);
  }
  window.removeEventListener('keydown', handleKeyPress);
});
</script>

<template>
  <br>
  <div class="start-timer-wrap">
    <div v-if="selectedLog">{{ selectedLog }}</div>
    <button @click="start" v-if="!isListening">Start</button>
    <div class="bw" v-if="isListening">
      <button @click="stop">Stop</button>
      <button @click="restart" id="restart">Restart</button>
    </div>
    <p>Timer: {{ timer }} ms</p>
  </div>
  <br>
  <div class="main-flex">
    <div v-if="selectedLog!==null">
      <div v-for="(key,index) in savedLogs[selectedLog]" :key="index">{{ key.kee }}: {{ key.time }}</div>
    </div>

    <div>
      <div class="" v-for="log in keyLogArr" :key="log">{{ log.kee }}: {{ log.time }}</div>
    </div>
    <div>
      <div v-for="val in compare" :key="val">{{ val }}</div>
    </div>

    <div class="container">
      <div v-for="(value, key) in savedLogs" :key="key" 
      @click="selectedLog=key" :class="{dec: selectedLog == key}">{{ key }}</div>
    </div>
  </div>
</template>

<style scoped>
.start-timer-wrap{
  display:flex;
  flex-direction:column;
  align-items: center;
}
.main-flex{
  display:flex;
  justify-content: space-between
}

.dec{
  text-decoration: underline;
}
.container > div{
  cursor:pointer;
}
.container > div:hover{
  text-decoration:underline;
}
p {
  font-size: 20px;
}
</style>