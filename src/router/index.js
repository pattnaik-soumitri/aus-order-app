import { createRouter, createWebHistory } from 'vue-router'
import OrderEntry from '../views/OrderEntry.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: OrderEntry
    },
    {
      path: '/orders',
      name: 'orders',
      component: () => import('../views/OrderList.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/Login.vue')
    }
  ]
})

export default router
