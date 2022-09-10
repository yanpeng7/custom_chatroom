<template>
<!-- standard Bootstrap-Vue templates, some part taken from https://www.djamware.com/post/5b6a681f80aca76a2cbd98fb/mongodb-express-vuejs-2-nodejs-mevn-and-socketio-chat-app -->
  <b-row class="chatroom">
    <b-col cols="12">
      <h2 class="room-name">
        <button class="fix-left" @click.stop="leaveRoom()">Leave</button>
        {{ roomName}}
        <button
          class="fix-right"
          href="javascript:;"
          @click.stop="displayUser()"
        >Users</button>
      </h2>
      <div v-show="popup">
        <div class="login">
          <button class="userlistClose" @click="closepopup">Close</button>
          <br />
          <br />
          <p v-for="(item, index) in users" class="userlist">
            {{ item }}
            <button
              v-show="kickButton"
              class="userlistClose"
              @click.stop="kickUsers(item)"
            >Kick</button>
          </p>
        </div>
        <div class="over"></div>
      </div>
      <b-list-group class="panel-body v-chat-scroll">
        <b-list-group-item v-for="(item, index) in chats" class="chat">
          <div class="right clearfix" v-if="item.nickname === nickname">
            <b-img
              right
              src="http://placehold.it/50/55C1E7/fff&text=ME"
              rounded="circle"
              width="74"
              height="74"
              alt="img"
              class="m-1"
            />
            <div class="chat-body clearfix">
              <div class="header">
                <strong class="primary-font">{{ item.nickname }}</strong>
                <small class="pull-right text-muted">
                  <span class="glyphicon glyphicon-time"></span>
                  {{ item.created_date }}
                </small>
              </div>
              <p>{{ item.message }}</p>
            </div>
          </div>
          <div class="left clearfix" v-else>
            <b-img
              left
              :src="`http://placehold.it/50/55C1E7/fff&text=${item.nickname.substr(0,2)}`"
              rounded="circle"
              width="74"
              height="74"
              alt="img"
              class="m-1"
            />
            <div class="chat-body clearfix">
              <div class="header">
                <strong class="primary-font">{{ item.nickname }}</strong>
                <small class="pull-right text-muted">
                  <span class="glyphicon glyphicon-time"></span>
                  {{ item.created_date }}
                </small>
              </div>
              <p>{{ item.message }}</p>
            </div>
          </div>
        </b-list-group-item>
      </b-list-group>
      <ul v-if="errors && errors.length">
        <li v-for="error of errors">{{error.message}}</li>
      </ul>
      <!-- bind input data -->
      <b-form @submit="onSubmit" class="chat-form">
        <b-input-group prepend="Message">
          <b-form-input id="message" :state="state" v-model.trim="chat.message"></b-form-input>
          <b-input-group-append>
            <b-btn type="submit" variant="info">Send</b-btn>
            <span>Send Private Message To: </span>
           <select id="privateUser" v-model="privateuser">
             <option v-for="item in users" name="privateuser" :value="item">
               {{ item }}
               </option>
               </select>
          </b-input-group-append>
        </b-input-group>
      </b-form>
    </b-col>
  </b-row>
</template>

<script>
import { getUserid, setUserid } from './storage'
import axios from 'axios'
import Vue from 'vue'
import * as io from 'socket.io-client'
import VueChatScroll from 'vue-chat-scroll'
Vue.use(VueChatScroll)
export default {
  name: 'Chatroom',
  data () {
    return {
      privateuser: '',
      state: '',
      chats: [],
      errors: [],
      nickname: getUserid(),
      chat: {},
      roomName: 'Chat Room',
      roomId: '',
      socket: null,
      popup: 0,
      users: [],
      kickButton: 0
    }
  },
  // fetch chat message and display
  created () {
    this.socket = io('http://localhost:4000')
    this.socket.on('connect', () => {
      console.log('connection success')

      this.enterRoom()
    })
    const hash = location.hash
    const roomId = hash.substr(12)
    this.roomId = roomId
    // get room name
    this.initRoominfo()
    this.initChats(roomId)
    // receive new message from backend and broadcast
    this.socket.on(
      'new-message',
      function (data) {
        if (data.message.room === roomId) {
          const userid = getUserid()
          console.log(data.message.message)
          if (data.message.message === 'show user') {
            this.displayUser()
          }
          if (data.message.isPrivate === true && data.message.toUser !== userid && data.message.nickname !== userid) {
          } else {
            this.chats.push(data.message)
            this.$nextTick(() => {
              this.scrolltoLastone()
            })
          }
        }
      }.bind(this)
    )
    // receive new user joining room notification from backend and apply
    this.socket.on(
      'user-enter-notification',
      function (data) {
        console.log(data)
        if (data.message.room === roomId) {
          console.log(data)
          if (!this.users.includes(data.message.nickname)) {
            this.users.push(data.message.nickname)
          }
        }
      }.bind(this)
    )
    // receive user leaving room notification from backend and apply
    this.socket.on(
      'user-leave-notification',
      function (data) {
        console.log(data)
        if (data.message.room === roomId) {
          this.users = this.users.filter((id) => id !== data.message.nickname)
        }
      }.bind(this)
    )
    // receive kicking user notification from backend and apply
    this.socket.on(
      'user-kick-notification',
      function (data) {
        console.log(data)
        if (data.message.room === roomId) {
          this.users = this.users.filter((id) => id !== data.message.nickname)
          if (this.nickname === data.message.nickname) {
            this.$router.push('/')
            alert('You are kicked by the room host!')
          }
        }
      }.bind(this)
    )
  },
  beforeDestroy () {
    this.socket.close()
  },
  methods: {
    enterRoom () {
      this.socket.emit('user-enter', {
        room: this.roomId,
        nickname: this.nickname
      })
    },
    BroadcastUserleave () {
      this.socket.emit('user-leave', {
        room: this.roomId,
        nickname: this.nickname
      })
    },
    initRoominfo () {
      const hash = location.hash
      const roomId = hash.substr(12)
      const userid = getUserid()
      axios
        .get(`http://localhost:3000/api/room/info/${roomId}`)
        .then((response) => {
          if (userid === response.data.creatorId) {
            this.kickButton = 1
          }
          this.roomName = response.data.room_name
          this.users = response.data.userIds
        })
        .catch((e) => {
          this.errors.push(e)
        })
    },
    initChats (roomId) {
      // get chat messages
      axios
        .get(`http://localhost:3000/api/chat/${roomId}`)
        .then((response) => {
          const userid = getUserid()
          this.chats = response.data.filter(function (chat) {
            if (chat.isPrivate === true && chat.toUser !== userid && chat.nickname !== userid) {
              return false
            }
            return true
          })
          this.$nextTick(() => {
            this.scrolltoLastone()
          })
        })
        .catch((e) => {
          this.errors.push(e)
        })
    },
    closepopup () {
      this.popup = 0
    },
    displayUser () {
      this.popup = 1
    },
    leaveRoom () {
      const hash = location.hash
      const roomId = hash.substr(12)
      const userid = getUserid()
      axios
        .delete(`http://localhost:3000/api/room/join/${roomId}`, {
          params: {
            userid: userid
          }
        })
        .then((data) => {
          this.$router.push('/')
        })
      this.BroadcastUserleave()
    },
    kickUsers (user) {
      const creatoruser = getUserid()
      const hash = location.hash
      const roomId = hash.substr(12)
      axios
        .post(
          `http://localhost:3000/api/room/kick/${roomId}`,
          { creatoruser },
          {
            params: {
              userid: user
            }
          }
        )
        .then((data) => {
          if (data.data === 'You cannot kick yourself!') {
            alert(data.data)
          } else {
            this.users = data.data.userIds
            this.socket.emit('user-kick', {
              room: this.roomId,
              nickname: user
            })
          }
        })
    },
    scrolltoLastone () {
      // find last chat item
      const allChats = document.querySelectorAll('.chat')
      const lastChatBox = allChats[allChats.length - 1]
      if (lastChatBox) {
        lastChatBox.scrollIntoView({
          behavior: 'smooth'
        })
      }
    },
    onSubmit (evt) {
      evt.preventDefault()
      const hash = location.hash
      const roomId = hash.substr(12)
      if (this.privateuser !== '') {
        this.chat.isPrivate = true
        this.chat.toUser = this.privateuser
      }
      this.chat.room = roomId
      this.chat.nickname = getUserid()
      this.socket.emit('save-message', this.chat)
      this.chat.message = ''
    }
  }
}
</script>

<style>
.chatroom {
}
.chat .chat-body p {
  margin: 0;
  color: #777777;
}
.chat .left .chat-body {
  text-align: left;
  margin-left: 95px;
}

.chat .right .chat-body {
  text-align: right;
  margin-right: 95px;
}

.panel-body {
  overflow-y: scroll;
  height: calc(100vh - 200px);
}

.chat-form {
  margin: 19px auto;
  width: 79%;
}
</style>

<style scoped>
.room-name {
  background-color: rgb(108, 158, 158);
  padding-top: 10px;
  padding-bottom: 10px;
  position: relati;
}
.fix-left {
  background-color: transparent;
  font-size: 19px;
  position: absolute;
  left: 30px;
  top: 14px;
  padding-top: 5px;
  padding-bottom: 5px;
  padding-left: 5px;
  padding-right: 5px;
  outline: none;
  border: none;
}
.fix-right {
  background-color: transparent;
  font-size: 19px;
  position: absolute;
  right: 30px;
  top: 14px;
  padding-top: 5px;
  padding-bottom: 5px;
  padding-left: 5px;
  padding-right: 5px;
  outline: none;
  border: none;
}
.userlist {
  font-size: 18px;
}
.userlistClose {
  background-color: transparent;
  outline: none;
  border: none;
}
.login {
  position: fixed;
  font-size: 18px;
  height: 500px;
  width: 400px;
  background-color: rgb(124, 145, 189);
  border-radius: 0.25rem;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000;
}
.over {
  position: fixed;
  width: 100%;
  height: 100%;
  opacity: 0.7;
  filter: alpha(opacity=70);
  top: 0;
  left: 0;
  z-index: 999;
  background-color: #111111;
}
</style>
