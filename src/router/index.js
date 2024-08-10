import { createRouter, createWebHistory } from 'vue-router'
import TaskListView from '../views/TaskListView.vue'
import AboutView from '../views/AboutView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),

  routes: [
    {
      // home - shows all task lists
      path: '/',
      name: 'tasks',
      component: TaskListView
    },
    {
      // task list - shows tasks for a given list

    },
    {
      // task - shows details of a given task
    },
    {
      // about path
      path: '/about',
      name: 'about',
      component: AboutView,
    }
  ]
})

export default router
