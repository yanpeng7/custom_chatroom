import Vue from 'vue'
import Router from 'vue-router'
import Roomlist from '@/components/Roomlist'
import Addroom from '@/components/Addroom'
import Chatroom from '@/components/Chatroom'
import Login from '@/views/login'
import Register from '@/views/register'
import store from '../store/index.js'
Vue.use(Router)

const routes = [
  {
    meta: {
      requiresGuest: true
    },
    path: '/Login',
    name: 'Login',
    component: Login
  },
  {
    meta: {
      requiresGuest: true
    },
    path: '/Register',
    name: 'Register',
    component: Register
  },
  {
    meta: {
      requiresAuth: true
    },
    path: '/',
    name: 'Roomlist',
    component: Roomlist
  },
  {
    meta: {
      requiresAuth: true
    },
    path: '/add-room',
    name: 'Addroom',
    component: Addroom
  },
  {
    meta: {
      requiresAuth: true
    },
    path: '/chat-room/:roomid',
    name: 'Chatroom',
    component: Chatroom
  }
]

const router = new Router({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})

// Standard template Vue route protection code, some parts from from https://www.freecodecamp.org/news/authentication-with-vue-js-firebase-5c3a82149f66/
router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!store.getters.isLoggedIn) {
      // redirects on login is user tries to go to home page without login
      next('/Login')
    } else {
      next()
    }
  } else if (to.matched.some(record => record.meta.requiresGuest)) {
    if (store.getters.isLoggedIn) {
      // redirects to home if user is already logged in
      next('/')
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
