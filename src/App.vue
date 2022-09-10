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
import navbar from '@/components/navbar'
import Errors from '@/components/Errors'
import { mapGetters } from 'vuex'
export default {
  name: 'App',
  components: {
    navbar,
    Errors
  },
  computed: {
    ...mapGetters(['error'])
  }
}
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  -webkit-font-smoothing: antialiased;
}
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
</style>
