<template>
  <!-- using emit to send parent state of done if changed -->
  <div class="task-item">
    <div>
      <input type="checkbox" :checked="props.task.done" @change="toggleDone">
    </div>
    
    <div @click="toggleUpdateForm">
      <p class="task-text">{{ props.task.task }}</p> 
      <p v-if="props.task.due_date && !props.task.done" :class="{ 'due-date': true, 'overdue': overdue }">
        {{ formatDueDate(props.task.due_date) }}
        <strong v-if="overdue" class="overdue">(Past due)</strong>
      </p>  
    </div>    
    <div>
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 512 512" @click="toggleStarred" v-if="!props.task.done">
        <title>ionicons-v5-e</title>
        <path d="M480,208H308L256,48,204,208H32l140,96L118,464,256,364,394,464,340,304Z" :style="starredStyle" style="stroke-linejoin:round;stroke-width:32px"/>
      </svg>
    </div>
  </div>
  
  <!-- Form to edit task -->
  <div class="overlay" v-if="showUpdateForm">
    <form @submit.prevent="updateTask" class="fullscreen-form">
      <div class="input-div">
        <label for="task">
          <div>Task <span style="color:red;">*</span></div>
          <a @click="deleteTask">Delete</a>        
        </label>
        
        <input type="text" id="task" v-model="updatedTask" />
      </div>
      
      <div class="input-div">
        <label for="due_date">Due Date</label>
        <input type="date" id="due_date" v-model="updatedDueDate" />
      </div>
      
      <div class="buttons">
        <button type="button" class="cancel-btn" @click="toggleUpdateForm">Cancel</button>
        <button type="submit">Update</button>
      </div>
    </form>
  </div>
</template>

<script setup>
import {ref, computed, watch } from 'vue'

const props = defineProps({
  task: {
    type: Object,
    require: true,
  },
})

// compute style for starred svg
const starredStyle = computed(() => {
  const color = props.task.starred ? '#c7fae9' : 'none'
  return {
    fill: color,
    stroke: color !== 'none' ? color : 'currentColor'
  }
})


// define emits for the parent's v-on
const emit = defineEmits(['update-task', 'delete-task'])


/* To update task details */
const showUpdateForm = ref(false)
const updatedTask = ref(props.task.task)
const updatedDueDate = ref(props.task.due_date)

const toggleUpdateForm = () => {
  // toggle update form
  showUpdateForm.value = !showUpdateForm.value
}

const updateTask = () => {
  //updatetask
  emit('update-task', {
    ...props.task,
    task: updatedTask.value,
    due_date: updatedDueDate.value
  })
  toggleUpdateForm() // close the form after update
}


// Function to format the date
const formatDate = (date) => {
  const options = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
  return new Intl.DateTimeFormat('en-US', options).format(new Date(date));
};

// Function to determine if the date should be displayed as 'Yesterday', 'Today', or 'Tomorrow'
const formatDueDate = (dateString) => {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  
  // Clear time components for comparison
  today.setHours(0, 0, 0, 0);
  yesterday.setHours(0, 0, 0, 0);
  tomorrow.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);
  
  if (date.getTime() === today.getTime()) {
    return 'Today';
  } else if (date.getTime() === yesterday.getTime()) {
    return 'Yesterday';
  } else if (date.getTime() === tomorrow.getTime()) {
    return 'Tomorrow';
  } else {
    return formatDate(dateString);
  }
};

// Normalize date to midnight
const normalizeDate = (date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

const today = normalizeDate(new Date())

const isOverdue = (dueDate) => normalizeDate(dueDate) < today

// Initial check
const overdue = ref(isOverdue(props.task.due_date))

watch(updatedDueDate, newVal => {
  overdue.value = isOverdue(newVal);
})


const toggleDone = (event) => {
  // update done status
  emit('update-task', { ...props.task, done: event.target.checked })
}

const toggleStarred = () => {
  // update starred status
  emit('update-task', { ...props.task, starred: !props.task.starred })
}


const deleteTask = () => {
  // delete a task
  const deleteTask = confirm('Delete task?')
  if(deleteTask){
    emit('delete-task', props.task.id)
    toggleUpdateForm() 
  }
}
</script>

<style scoped>
svg, input[type="checkbox"] {
  cursor: pointer;
}

.task-item {
  display: grid;
  grid-template-columns: 30px 1fr 30px;
  gap: 5px;
  align-items: start;
  margin-bottom: 10px;
}

p {
  margin: 0;
}

.task-text {
  cursor: pointer;
}

label[for='task'] {
  display: flex;
  justify-content: space-between;
}

label[for='task'] > a {
  color: #b80000;
}

label[for='task'] > a:hover {
  background: none;
  color: #cf0101;
  text-decoration: underline;
}

.due-date {
  font-size: 14px;
  color:white;
}

.overdue {
  color: lightcoral;
}

.task-text:hover {
  text-decoration: underline;
}

</style>