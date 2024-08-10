<template>
  <header>
    <div class="wrapper">     
      <nav>
        <RouterLink to="/">Tasks</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </nav>
    </div>
  </header>
  
  <main>
    <RouterView />  
  </main>
</template>

<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<style scoped>
nav {
  width: 100%;
  font-size: 18px;
  text-align: left;
  text-align: center;
  margin-top: 20px;
  margin-bottom: 30px;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

</style>
