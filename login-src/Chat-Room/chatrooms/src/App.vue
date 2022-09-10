<template>
  <div id="app">
    <navbar />
    <br>
    <br>
    <div class="container">
      <Errors v-if="error" :msg="error"/>
      <router-view/>
    </div>
  </div>
</template>

<script>
import navbar from "@/components/navbar";
import Errors from "@/components/Errors";
import { mapGetters } from "vuex";
export default {
  components: {
    navbar,
    Errors
  },
  computed: {
    ...mapGetters(["error"]),
  },
};
</script>
<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
