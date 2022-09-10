<template>
  <!--Taken from bootstrap https://getbootstrap.com/docs/4.5/components/navbar/-->
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <a class="navbar-brand" href="#">Chatrooms</a>
    <button
      class="navbar-toggler"
      type="button"
      data-toggle="collapse"
      data-target="#navbarSupportedContent"
      aria-controls="navbarSupportedContent"
      aria-expanded="false"
      aria-label="Toggle navigation"
    >
      <span class="navbar-toggler-icon"></span>
    </button>

    <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <ul class="navbar-nav ml-auto">

        <li class="nav-item active" v-if="!isLoggedIn">
          <router-link to="/login" class="nav-link">
            Login
            <span class="sr-only">(current)</span>
          </router-link>
        </li>

        <li class="nav-item active" v-if="!isLoggedIn">
          <router-link to="/register" class="nav-link">
            Register
            <span class="sr-only">(current)</span>
          </router-link>
        </li>

        <li class="nav-item active" v-if="isLoggedIn">
          <a class="nav-link" to="/logout" @click.prevent="logoutUser" >
            Logout
            <span class="sr-only">(current)</span>
          </a>
        </li>

      </ul>
    </div>
  </nav>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
export default {
  computed: {
    ...mapGetters(["isLoggedIn"]),
  },
  methods: {
    ...mapActions(["logout"]),
    logoutUser() {
      this.logout();
    },
  },
};
</script>

<style>
</style>