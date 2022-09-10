import Vue from 'vue'
import store from '../store/index.js'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

  const routes = [
  {
    meta: {
      requiresGuest: true
    },
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    meta: {
      requiresGuest: true
    },
    path: '/login',
    name: 'Login',
    component: () => import(/* webpackChunkName: "about" */ '../views/login.vue')
  },
  {
    meta: {
      requiresGuest: true
    },
    path: '/register',
    name: 'Register',
    component: () => import(/* webpackChunkName: "about" */ '../views/register.vue')
  },
  {
    meta: {
      requiresGuest: false
    },
    path: '/chat_proper',
    name: 'Chatroom',
    component: () => import(/* webpackChunkName: "about" */ '../views/chat_proper.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!store.getters.isLoggedIn) {
      // Redirect to the Login Page
      next('/login');
    } else {
      next();
    }
  } else if (to.matched.some(record => record.meta.requiresGuest)) {
    if (store.getters.isLoggedIn) {
      // Redirect to the Login Page
      next('/chat_proper');
    } else {
      next();
    }
  } else {
    next()
  }
});

export default router
