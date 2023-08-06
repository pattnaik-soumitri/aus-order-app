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
        requiresAuth: true,
        title: 'Aus Order App'
      }
    },
    {
      path: '/orders',
      name: 'orders',
      component: OrderList,
      meta: {
        requiresAuth: true,
        title: 'Orders'
      }
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/Login.vue'),
      meta: {
        title: 'Login'
      }
    }
  ]
})

// Global auth guard
router.beforeEach((to, from) => to?.meta?.requiresAuth ? authCheck() : true);
router.afterEach((toRoute, fromRoute) => {
  window.document.title = toRoute?.meta && toRoute?.meta?.title ? toRoute?.meta?.title : 'Aus Order App';
})

export default router
