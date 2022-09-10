
<template>
<!-- standard Bootstrap-Vue templates, some part taken from https://www.djamware.com/post/5b6a681f80aca76a2cbd98fb/mongodb-express-vuejs-2-nodejs-mevn-and-socketio-chat-app -->
  <b-row>
    <b-col align-self="start">&nbsp;</b-col>
    <b-col cols="6" align-self="center">
      <h2>
        Add Room
        <b-link href="#/">(Room List)</b-link>
      </h2>
      <b-form @submit="onSubmit">
        <b-form-group id="fieldsetHorizontal"
                  horizontal
                  :label-cols="4"
                  breakpoint="md"
                  label="Enter Room Name">
          <b-form-input id="room_name" v-model.trim="room.room_name"></b-form-input>
        </b-form-group>
          <b-form-group id="fieldsetHorizontal1"
                  horizontal
                  :label-cols="4"
                  breakpoint="md"
                  label="Enter Password">
          <b-form-input id="room_password" v-model.trim="room.password"></b-form-input>
        </b-form-group>
        <b-button type="submit" variant="primary">Save</b-button>
      </b-form>
    </b-col>
    <b-col align-self="end">&nbsp;</b-col>
  </b-row>
</template>

<script>

import axios from 'axios'
import { getUserid } from './storage'
export default {
  name: 'Addroom',
  data () {
    return {
      room: {}
    }
  },
  methods: {
    onSubmit (evt) {
      const userid = getUserid()
      evt.preventDefault()
      axios.post(`http://localhost:3000/api/room`, this.room, {
        params: {
          userid: userid
        }
      })
        .then(response => {
          this.$router.push('/')
        })
        .catch(e => {
          this.errors.push(e)
        })
    }
  }
}
</script>
