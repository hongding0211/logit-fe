import { createRouter, createWebHistory } from 'vue-router'
import Log from '../views/Log/Log.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Log,
    },
  ],
})

export default router
