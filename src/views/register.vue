<template>
  <!--Taken from bootstrap https://getbootstrap.com/docs/4.5/components/forms/-->
  <div class="row">
    <div class="card mx-auto border-0">
      <div class="card-header text-black bg-white border-0">
        <b>Register</b>
      </div>
      <br />
      <form @submit.prevent="registerUser">
        <div class="form-group">
          <label for="username">Username</label>
          <input
            type="text"
            class="form-control"
            id="username"
            v-model="username"
            placeholder="Username"
            name="username"
            aria-describedby="Help"
          />
          <small id="emailHelp" class="form-text text-muted">Can not have special characters</small>
        </div>
        <div class="form-group">
          <label for="exampleInputPassword1">Password</label>
          <input
            type="password"
            class="form-control"
            id="password"
            v-model="password"
            placeholder="Password"
            name="password"
          />
        </div>
        <button type="submit" class="btn btn-primary">Submit</button>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <router-link to="/login" class="card-link">Login Now!</router-link>
      </form>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  data () {
    return {
      password: '',
      username: ''
    }
  },
  methods: {
    ...mapActions(['register']),
    registerUser () {
      let signupRequester = {
        password: this.password,
        username: this.username
      }
      this.register(signupRequester).then(response => {
        if (response.data.success === true) {
          this.$router.push('/Login')
        }
      })
    }
  }
}
</script>

<style>
</style>
