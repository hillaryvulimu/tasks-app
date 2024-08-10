<template>
  <!-- incomplete tasks -->
  <div id="pending">
    <ul v-if="props.list">
      <li v-for="task in props.list.tasks.filter(task => !task.done)" :key="task.task" >
        <!-- include emits passed from TaskItem -->
        <TaskItem :task="task" @update-task="updateTask" @delete-task="deleteTask" />
      </li>
    </ul>
  </div>
  
  
  <!-- completed tasks div sohws only if theres at least one completed task -->
  <div id="completed" 
  v-if="
  props.list.tasks &&
  props.list.tasks.find(task => task.done) &&
  props.list && props.list.list_name !== 'starred'
  "
  >
  <hr>
  <h4 @click="toggleCompletedList">
    <span>Completed</span>
    <span>{{ completedList ? '&#x25B2;' : '&#x25BC;' }}</span>
  </h4>
  <Transition name="expand">
    <ul v-if="completedList" id="completed-list">
      <li v-for="task in props.list.tasks.filter(task => task.done)" :key="task.task">
        <!-- include emits passed from TaskItem -->
        <TaskItem :task="task" @update-task="updateTask" @delete-task="deleteTask"  />
      </li>
    </ul>
  </Transition>
</div>

<!-- add new task -->
<div id="add-new-task">
  <AddTask v-if="showNewTaskForm" @cancel-add-task-form="toggleNewTask" @add-task="addNewTask" />
</div>


<!-- Bottom menu container -->
<div id="bottom-menu" v-if="props.list.tasks && props.list.list_name !== 'starred'">
  <div class="menu-left">
    <button class="menu-button" @click="toggleMenu">
      &#x22EE; <!-- Three-dot menu icon -->
    </button>
    <div class="menu-content" v-if="menuOpen">
      <ul>
        <li @click="toggleRenameList">Rename list</li>
        <li @click="deleteList">Delete list</li>
        <li @click="deleteCompletedTasks" :class="{ 'disabled': !props.list.tasks.find(task => task.done) }">Delete completed tasks</li>
      </ul>
    </div>
  </div>
  <div class="menu-right">
    <button id="add-task-button" @click="toggleNewTask" >
      +
    </button>
  </div>
</div>

<!-- Rename List form -->
<div class="overlay" v-if="showRenameListForm || keepRenameForm">
  <form @submit.prevent="newListName" class="fullscreen-form">
    <input type="text" ref="listNameInput" v-model="new_list_name" placeholder="Enter a list name" />
    <div class="buttons">
      <button type="button" class="cancel-btn" @click="toggleRenameList">Cancel</button>
      <button type="submit" :disabled="!new_list_name.length">Done</button>
    </div>
  </form>
 
</div>
</template>

<script setup>
import { ref, watch } from 'vue'
import TaskItem from './TaskItem.vue';
import AddTask from './AddTask.vue';

const props = defineProps({
  list: {
    type: Object,
    required: true,
  },
  keepRenameForm: {
    type: Boolean,
    required: false
  }
})

// listen for child's emits, and pass to parent, i.e. TaskListView
const emit = defineEmits(['task-updated', 'task-deleted', 
'new-task', 'rename-list', 'delete-list', 'delete-completed-tasks'
])

const updateTask = (updatedTask) => {
  emit('task-updated', updatedTask)
}

const deleteTask = (deletedTaskId) => {
  emit('task-deleted', deletedTaskId)
}

// show/hide completed list
const completedList = ref(false)
const toggleCompletedList = () => {
  completedList.value = !completedList.value
}


/* Bottom menu */
const menuOpen = ref(false);
const showNewTaskForm = ref(false)

const toggleMenu = () => {
  menuOpen.value = !menuOpen.value;
};

const handleClickOutside = (event) => {
  // hide bottom menu when cliking outside it.
  if (event.target.id !== 'bottom-menu' && !event.target.closest('#bottom-menu')) {
    menuOpen.value = false;
  }
};

document.addEventListener('click', handleClickOutside);


// rename list
const new_list_name = ref(props.list.list_name)
const showRenameListForm = ref(false)

const toggleRenameList = () => {
  new_list_name.value = localStorage.getItem('currentListName')
  showRenameListForm.value = !showRenameListForm.value
}

const newListName = () => {
  emit('rename-list', { ...props.list, list_name: new_list_name.value})
}


watch(() => props.keepRenameForm, (newValue) => {
  // check if list with same name exists, and keep form active
  if (!newValue) {
    showRenameListForm.value = false;
  }
  else {
    showRenameListForm.value = true;
  }
});


// delete list
const deleteList = () => {
  emit('delete-list', props.list.list_id)
  toggleMenu()
}

// delete completed tasks
const deleteCompletedTasks = () => {
  if(completedList.value) {
    emit('delete-completed-tasks')
    toggleMenu()
  }
}








// show new task form
const toggleNewTask = () => {
  showNewTaskForm.value = !showNewTaskForm.value
}

// send task to parent
const addNewTask = (newTask) => {
  emit('new-task', newTask)
  toggleNewTask()
}
</script>


<style scoped>
ul {
  padding: 0;
  margin: 5px 0;
}

ul > li {
  list-style: none;
}


div#completed > h4 {
  color: white;
  margin-bottom: 0;
  cursor: pointer;
  padding-right: 22px;
  
  display: flex;
  justify-content: space-between;
}

div#completed > ul > li {
  text-decoration: line-through;
  font-style: italic;
  color: #808080;
}

hr {
  border: 1px solid rgb(107, 107, 107);
}


/* completed list animation */
.expand-enter-active, .expand-leave-active {
  transition: all 0.5s ease;
}
.expand-enter, .expand-leave-to {
  height: 0;
  opacity: 0;
  overflow: hidden;
}


/* bottom menu styles */
#bottom-menu {
  position: fixed;
  bottom: 0;
  max-width: 480px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 1rem;
  box-sizing: border-box;
  background-color: #141414; /* Inherit background color from parent */
  color: inherit; /* Inherit font color from parent */
}

.menu-left, .menu-right {
  display: flex;
  align-items: center;
}

.menu-button {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: inherit; 
}

.menu-content {
  position: absolute;
  bottom: 2.5rem; 
  left: 0;
  right:0;
  border-radius: 4px;
  list-style: none;
  padding: 0.5rem;
  background-color: #141414;;
}

.menu-content ul {
  padding: 0;
  margin: 0;
  list-style: none;
}

.menu-content li {
  padding: 0.5rem 1rem;
  cursor: pointer;
  white-space: nowrap;
}

.menu-content li:hover {
  background-color: #3b3b3b;
}

#add-task-button {
  background: none;
  border: none;
  font-size: 2rem;
  cursor: pointer;
  color: inherit; /* Inherit font color from parent */
}

#add-task-button:hover {
  background-color: #0f1c41;
  color: white
}
</style>