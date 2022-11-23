import { createRouter, createWebHistory } from 'vue-router'
import Log from '../views/Log/LogView.vue'

const router = createRouter({
  history: createWebHistory(''),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Log,
    },
  ],
})

export default router
