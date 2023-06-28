import { createRouter, createWebHistory } from 'vue-router';
import OrderEntry from '../views/OrderEntry.vue';
import OrderList from '../views/OrderList.vue';
import { useSessionStore } from '../stores/userSessionStore';

const authCheck = () => {
  const session = useSessionStore();
  if(!session.currentUser.isLoggedIn) {
    return 'login';
  }
  return session.currentUser.isLoggedIn;
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: OrderEntry,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/orders',
      name: 'orders',
      component: OrderList,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/Login.vue')
    }
  ]
})

// Global auth guard
router.beforeEach((to, from) => to?.meta?.requiresAuth ? authCheck() : true);

export default router
