<script setup>
import {onMounted, ref} from 'vue'
const savedLogs = ref(null);
async function loadFiles(){
  const response = await window.electron.readFile();
  const existingLogs = response.success ? JSON.parse(response.content) : {};
  const keys = Object.keys(existingLogs);
  savedLogs.value = existingLogs;
  
}

async function deleteLog(logName){
	delete savedLogs.value[logName];
	try {
    const fileContent = JSON.stringify(savedLogs.value, null, 2);
    const saveResponse = await window.electron.saveFile(fileContent);
    if (saveResponse.success) {
      console.log('success')
    } else {
      alert('Failed to save file');
    }
  } catch (error) {
    console.error('Error reading or saving file:', error);
    alert('Failed to read or save file');
  }
}
onMounted(()  => {
  loadFiles();
})
</script>

<template>
	<div>Click sequence name to delete it</div>
	<hr>
	<div class="logs" v-for="(value, key) in savedLogs" :key="key" @click="deleteLog(key)">{{ key }}</div>
</template>

<style scoped>
.logs:hover{
	cursor:pointer;
	text-decoration: underline;
}
.logs{
	margin-top:.2rem;
}
</style>