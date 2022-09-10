<template>
  <!--Taken from bootstrap https://getbootstrap.com/docs/4.5/components/forms/-->
  <div class="row">
    <div class="card mx-auto border-0">
      <div class="card-header text-black bg-white border-0">
        <b>Login</b>
      </div>
      <br />
      <form @submit.prevent="loginUser">
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
        <input type="submit" class="btn btn-primary" value="Login">
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <router-link to="/register" class="card-link">Register Here!</router-link>
      </form>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
export default {
  data() {
    return {
      username: "",
      password: ""
    };
  },
  methods: {
    ...mapActions(["login"]),
    loginUser() {
      let user = {
        username: this.username,
        password: this.password
      };
      this.login(user)
        .then(res => {
          if (res.data.success) {
            this.$router.push("/chat_proper");
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>

<style>
</style>