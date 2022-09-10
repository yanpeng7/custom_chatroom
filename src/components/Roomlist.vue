<template>
<!-- standard Bootstrap-Vue templates, some part taken from https://www.djamware.com/post/5b6a681f80aca76a2cbd98fb/mongodb-express-vuejs-2-nodejs-mevn-and-socketio-chat-app -->
  <b-row>
    <b-col cols="12">
      <h2>
        Room List
        <br>
        <b-link href="#/add-room">(Add Room)</b-link>
      </h2>
      <b-table striped hover :items="allRooms" :fields="fieldsarr">
        <template v-slot:cell(actions)="roomInfo" >
          <button size="sm" @click.stop="joinRoom(roomInfo)">Join</button>
        </template>
      </b-table>
    </b-col>
  </b-row>
</template>

<script>
import { getUserid } from './storage'
import axios from 'axios'
export default {
  name: 'RoomList',
  data () {
    return {

      fieldsarr: [
        'created_date', 'room_name', 'actions'
      ],
      allRooms: [],
      errors: []
    }
  },
  created () {
    const userID = getUserid()
    if (!userID) {
      this.$router.push('/Login')
    }
    axios.get(`http://localhost:3000/api/room`)
      .then(response => {
        // console.log(response);
        this.allRooms = response.data
      })
      .catch(e => {
        this.errors.push(e)
      })
  },
  methods: {
    joinRoom (room) {
      console.log(room)
      const id = room.item._id
      const userid = getUserid()
      let password = ''
      if (room.item.password !== undefined) {
        password = prompt('Enter Room Password')
      }
      axios.post(`http://localhost:3000/api/room/join/${id}`, {
        password
      }, {
        params: {
          userid: userid
        }
      }).then(data => {
        if (data.data.errormessage !== undefined) {
          alert(data.data.errormessage)
        } else {
          const roomInfo = data.data
          const roomId = roomInfo._id
          location.hash = `#/chat-room/${roomId}`
        }
      })
    }
  }
}

</script>
