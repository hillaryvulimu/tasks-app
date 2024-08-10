<template>
  <main>
    <div id="lists-nav">
      <ul>
        <!-- starred list -->
        <li>
          <a href="#" @click="currentListName='starred'" :class="activeLinkClass('starred')">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 512 512">
              <title>ionicons-v5-e</title>
              <path d="M480,208H308L256,48,204,208H32l140,96L118,464,256,364,394,464,340,304Z" style="fill:currentColor;stroke:currentColor;stroke-linejoin:round;stroke-width:32px"/>
            </svg>
          </a>
        </li>
        
        <!-- other lists -->
        <li v-for="list in tasks" :key="list.list_name">
          <a href="#" @click="currentListName=list.list_name"  :class="activeLinkClass(list.list_name)">{{ list.list_name }}</a>
        </li>
        <li id="new-list-btn" @click="toggleNewListForm">+ New List</li>
      </ul>
      <NewList v-if="showNewListForm" 
      @new-list-name="addNewList" 
      @cancel-new-list-form="toggleNewListForm" 
      ref="newListForm"
      />
    </div>
    
    <!-- TASKS FOR CURRENT LIST -->
    <TaskList :list="currentListTasks"
    :keepRenameForm="keepRenameForm"
    @rename-list="handleRenameList"
    @delete-list="handleDeleteList"
    @delete-completed-tasks="handleDeleteCompletedTasks"
    @task-updated="handleTaskUpdated" 
    @task-deleted="handleTaskDeleted"
    @new-task="addNewTask"
    v-if="currentListName"
    />
  </main>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { v4 as uuidv4 } from 'uuid'

import TaskList from '../components/TaskList.vue'
import NewList from '../components/NewList.vue'


// get tasks from localStorage
const tasks = ref(JSON.parse(localStorage.getItem('tasks')) || [])

// get tasks for current/recently visited list
const currentListName = ref(localStorage.getItem('currentListName') || '')

onMounted(() => {
  // use last list's name if no recently vicited list.
  if (!currentListName.value && tasks.value.length > 0) {
    const lastList = tasks.value[tasks.value.length - 1];
    currentListName.value = lastList.list_name;
  }
});

// style active link
const activeLinkClass = (route) => {
  if(route === currentListName.value) {
    return 'router-link-exact-active'
  }
}

// update current list's tasks based on changes in currentListName or in tasks
const currentListTasks = computed(() => {
  if (currentListName.value === 'starred') {
    return {
      list_name: 'starred',
      tasks: tasks.value.flatMap(list => list.tasks.filter(task => task.starred && !task.done))
    };
  } else {
    return tasks.value.find(list => list.list_name === currentListName.value) || null;
  }
});


// Handle rename list
const keepRenameForm = ref(false);
const handleRenameList = (renamedList) => {
  const listIndex = tasks.value.findIndex(list => list.list_id === renamedList.list_id)
  // check if list name already exists
  if(tasks.value.some(list => list.list_name === renamedList.list_name)){
    alert(`'${renamedList.list_name}' list already exists`)
    keepRenameForm.value = true; // keep showing edit list form
  }
  else if(listIndex !== -1){
    tasks.value[listIndex] = renamedList
    currentListName.value = renamedList.list_name
    keepRenameForm.value = false
  }
}




// Handle delete list
const handleDeleteList = (listId) => {
  if(confirm(`Delete ${currentListName.value} this list?`)){
    tasks.value = tasks.value.filter(list => list.list_id !== listId)
    if(tasks.value.length === 0){
      currentListName.value = ''
    }
    else {
      currentListName.value = tasks.value[tasks.value.length - 1].list_name
    }
    
  }
}


// Handle delete all completed tasks
const handleDeleteCompletedTasks = () => {
  if(confirm('Delete all completed tasks?')){
    tasks.value.forEach(list => {
      if(list.list_name === currentListName.value){
        list.tasks = list.tasks.filter(task => !task.done)
      }
    })
  }
}



// Handle the updated task from TaskList
const handleTaskUpdated = (updatedTask) => {
  // Update the main tasks array
  for (const list of tasks.value) {
    const taskIndex = list.tasks.findIndex(task => task.id === updatedTask.id);
    if (taskIndex !== -1) {
      list.tasks[taskIndex] = updatedTask;
      break;
    }
  }
};

// Delete task
const handleTaskDeleted = (deletedTaskId) => {
  for (const list of tasks.value) {
    const taskIndex = list.tasks.findIndex(task => task.id === deletedTaskId);
    if (taskIndex !== -1) {
      list.tasks.splice(taskIndex, 1);
      break;
    }
  }
}


/*---- CREATE A NEW LIST ----*/
const showNewListForm = ref(false)
const newListForm = ref(null)

watch(showNewListForm, async (newValue) => {
  // using nextTick to add autofocus to list_name input in NewList
  if (newValue) {
    await nextTick()
    const input = newListForm.value?.$refs.listNameInput
    input?.focus()
  }
})

const toggleNewListForm = () => {
  showNewListForm.value = !showNewListForm.value
}


const addNewList = (newList) => {
  // use some() to check if list exists
  if(tasks.value.some(list => list.list_name === newList)){
    alert(`'${newList}' list already exists`)
  }
  else {
    tasks.value.push({ 
      'list_id': uuidv4(),
      'list_name': newList, 
      tasks: []

    })
    showNewListForm.value = false
    currentListName.value = newList
  }
}


/*  ADD A NEW TASK */
const addNewTask = (newTask) => {
  const currentList = tasks.value.find(list => list.list_name === currentListName.value);
  currentList.tasks.push(newTask)
}


// watch for tasks and list name changes, and update localStorage
watch(currentListName, newVal => {
  localStorage.setItem('currentListName', newVal)
})

// deep watch tasks array to update it.
watch(() => tasks.value, newVal =>{
  localStorage.setItem('tasks', JSON.stringify(newVal))
}, {deep: true})
</script>


<style scoped>
div#lists-nav {
  position: relative;
}

div#lists-nav > ul {
  padding: 0;
  list-style: none;
  display: flex;
  
}

div#lists-nav > ul li {
  margin: 0 5px;
}

li#new-list-btn {
  cursor: pointer;
}
</style>
