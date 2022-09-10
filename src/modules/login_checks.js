import router from '../router'
import { setUserid } from '../components/storage'
import axios from 'axios'

const state = {
  status: '',
  error: null,
  token: '' || localStorage.getItem('token'),
  user: {}
}

const getters = {
  authState: state => state.status,
  error: state => state.error,
  user: state => state.user,
  isLoggedIn: state => !!state.token
}

const ip = 'http://localhost:3000'

const actions = {
  // login function
  async login ({
    commit
  }, user) {
    commit('login_req')
    try {
      let response = await axios.post(`${ip}/api/login_system/login`, user)
      if (response.data.success === true) {
        const token = response.data.token
        const user = response.data.user
        // store token in localstorage
        localStorage.setItem('token', token)
        setUserid(user.username)
        // defaults axios
        axios.defaults.headers.common['Authorization'] = token
        commit('login_complete', token, user)
      }
      return response
    } catch (error) {
      commit('login_err', error)
    }
  },
  // user signup
  async register ({
    commit
  }, userData) {
    try {
      commit('signup_req')
      let response = await axios.post(`${ip}/api/login_system/register`, userData)
      if (response.data.success !== undefined) {
        commit('signup_complete')
      }
      return response
    } catch (error) {
      commit('signup_err', error)
    }
  },
  // logout
  async logout ({
    commit
  }) {
    localStorage.removeItem('token')
    localStorage.removeItem('userid')
    commit('logout')
    delete axios.defaults.headers.common['Authorization']
    // return user to login page
    router.push('/login')
  }
}
// different states and mutations
const mutations = {
  signup_req (state) {
    state.status = 'loading'
    state.error = null
  },
  signup_err (state, err) {
    state.error = err.response.data.msg
  },
  signup_complete (state) {
    state.status = 'success'
    state.error = null
  },
  logout (state) {
    state.status = ''
    state.user = ''
    state.error = null
    state.token = ''
  },
  login_req (state) {
    state.status = 'loading'
    state.error = null
  },
  login_err (state, err) {
    state.error = err.response.data.msg
  },
  login_complete (state, token, user) {
    state.token = token
    state.error = null
    state.user = user
    state.status = 'success'
  }
}

export default {
  actions,
  getters,
  state,
  mutations
}
