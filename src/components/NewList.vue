<template>
  <div class="overlay">
    <form id="new_list_name" @submit.prevent="addListName" class="fullscreen-form">
      <input type="text" ref="listNameInput" v-model="list_name" placeholder="Enter a list name" />
      <div class="buttons">
        <button type="button" id="cancel-btn" @click="cancel">Cancel</button>
        <button type="submit" id="add-btn" :disabled="!list_name.length">Add</button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, } from 'vue';


// use nextTick from parent to add autofocus to list_name input
const list_name = ref('');


// emits to add new list or cancel input
const emit = defineEmits(['new-list-name', 'cancel-new-list-form']);
const addListName = () => {
  emit('new-list-name', list_name.value);
};


const cancel = () => {
  list_name.value = ''; 
  emit('cancel-new-list-form');
};
</script>

<style scoped>

</style>
