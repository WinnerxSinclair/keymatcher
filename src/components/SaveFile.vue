<script setup>
import { onMounted, onUnmounted, ref, watch, nextTick } from 'vue';


const isListening = ref(false);
const timer = ref(0);
const intervalId = ref(null);
const keyLogArr = ref([])
const savedLogs = ref({})
const nameInput = ref(null);
const stopped = ref(false);
const sameName = ref(false);
const showInput = ref(false);
const logName = ref('');
watch(showInput, (newVal) => {
  if (newVal) {
    nextTick(() => {
      nameInput.value.focus();
    });
  }
});
function handleKeyPress(event) {
  console.log(`Key pressed: ${event.key}: ${timer.value}`);
  keyLogArr.value.push({kee: event.key, time: timer.value});
  if (intervalId.value === null) {
    intervalId.value = setInterval(() => {
      timer.value += 1;
    }, 1);
  }
}

function start() {
  if (!isListening.value) {
    window.addEventListener('keydown', handleKeyPress);
    isListening.value = true;
  }
}


function stop(){
  if (intervalId.value !== null) {
    clearInterval(intervalId.value);
    intervalId.value = null;
    timer.value = 0;
  }
  isListening.value = false;
  window.removeEventListener('keydown', handleKeyPress);
  stopped.value = true;
}

function reset(){
  if (intervalId.value !== null) {
    clearInterval(intervalId.value);
    intervalId.value = null;
    timer.value = 0;
  }
  isListening.value = false;
  window.removeEventListener('keydown', handleKeyPress);
  keyLogArr.value = [];
}
function restart(){
  reset();
  start();
}

async function submit(x){
  if(logName.value == ''){
    return;
  }
  sameName.value = false;
  console.log(logName.value)
  
  const response = await window.electron.readFile();
  const existingLogs = response.success ? JSON.parse(response.content) : {};
  if (existingLogs[logName.value] && x=='xd') {
    sameName.value = true;
    console.log('Log name already exists');
    return;
  }
  
  savedLogs.value[logName.value]=[...keyLogArr.value];
  console.log(savedLogs.value[logName.value])
  keyLogArr.value = [];
  logName.value = '';
  saveLogsToFile();
  stopped.value = false;
  showInput.value = false;
  
  
}

function no(){
  keyLogArr.value = [];
  stopped.value = false;
}


async function saveLogsToFile() {
  try {
    const response = await window.electron.readFile();
    const existingLogs = response.success ? JSON.parse(response.content) : {};
    const newLogs = { ...existingLogs, ...savedLogs.value };
    const fileContent = JSON.stringify(newLogs, null, 2);
    const saveResponse = await window.electron.saveFile(fileContent);
    if (saveResponse.success) {
      // alert(`File saved at: ${saveResponse.filePath}`);
      savedLogs.value = newLogs; // Update the saved logs to include what was just saved
    } else {
      alert('Failed to save file');
    }
  } catch (error) {
    console.error('Error reading or saving file:', error);
    alert('Failed to read or save file');
  }
}
const restartMacro = (event) => {
  if (event.key === '3') {
    restart();
  }
};

onMounted(() => {
  window.addEventListener('keydown', restartMacro);
});
onUnmounted(() => {
  if (intervalId.value !== null) {
    clearInterval(intervalId.value);
  }
  window.removeEventListener('keydown', handleKeyPress);
  window.removeEventListener('keydown', restartMacro);
});
function xd(){
  console.log('xd')
  nameInput.value.focus();
}
</script>

<template>
  <br>
  <button @click="start" v-if="!isListening && !stopped">Start</button>
  <div class="bw" v-if="isListening">
    <button @click="stop">Stop</button>
    <button @click="restart" id="restart">Restart</button>
  </div>
  <div class="bw" v-if="stopped && !showInput">
    <div>Save Replay?</div>
    <button @click="showInput = true">Yes</button>
    <button @click="no">No</button>
  </div>
  <div v-if="showInput">
    <div v-if="!sameName">Name this sequence</div>
    <div v-else>Sequence name already exists. Overwrite?</div>
    <input @click="xd" v-if="!sameName" type="text" v-model="logName" ref="nameInput">
    <button v-if="!sameName" @click="submit('xd')">Submit</button>
    <div v-else>
      <button @click="submit('xdd')">Yes</button>
      <button @click="sameName = false">No</button>
    </div>
  </div>
  <p>Timer: {{ timer }} ms</p>
  <div class="" v-for="log in keyLogArr" :key="log">{{ log.kee }}: {{ log.time }}</div>
</template>

<style scoped>

button {
  margin: 10px;
}

p {
  font-size: 20px;
}
</style>
