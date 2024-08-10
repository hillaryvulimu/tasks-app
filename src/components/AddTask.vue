<template>
  <div class="overlay">
    <form @submit.prevent="addTask" class="fullscreen-form">
      <div class="input-div">
        <label for="task">Task <span style="color:red;">*</span> </label>
        <input type="text" id="task" v-model="form.task" required  />
      </div>
      
      <div class="input-div">
        <label for="due_date">Due Date</label>
        <input type="date" id="due_date" v-model="form.due_date" />
      </div>
      
      <div class="buttons">
        <button type="button" class="cancel-btn" @click="cancel">Cancel</button>
        <button type="submit">Add</button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { v4 as uuidv4 } from 'uuid'
const emit = defineEmits(['add-task', 'cancel-add-task-form'])

// add task
const form = ref({
  id: uuidv4(),
  task: '',
  due_date: '',
  due_time: '',
  done: false,
  starred: false
});


const addTask = () => {
  emit('add-task', form.value)  
};

// cancel
const cancel = () => {
  emit('cancel-add-task-form')
}
</script>

<style scoped>
</style>