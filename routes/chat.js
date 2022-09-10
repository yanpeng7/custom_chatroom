var express = require('express')
var router = express.Router()
var Chat = require('../models/Chat.js')
var app = express()
var server = require('http').createServer(app)
var io = require('socket.io')(server)
var botAllowed = true
/* GET ALL CHATS */
router.get('/', function (req, res, next) {
  Chat.find(function (err, products) {
    if (err) return next(err)
    res.json(products)
  })
})

/* GET SINGLE CHAT BY ROOM ID */
router.get('/:roomid', function (req, res, next) {
  Chat.find({
    room: req.params.roomid
  }, function (err, chats) {
    if (err) return next(err)
    // console.log(chats)
    res.json(chats)
  })
})

/* SAVE CHAT */
router.post('/', function (req, res, next) {
  console.log('TESTTHIS', req.body)
  Chat.create(req.body, function (err, post) {
    if (err) return next(err)
    res.json(post)
  })
})

server.listen(4000)

// socket io ADD CHAT
io.on('connection', function (socket) {
  console.log('User connected')
  socket.on('disconnect', function () {
    console.log('User disconnected')
  })
  socket.on('save-message', function (data) {
    // broadcast to all users in the room
    Chat.create(data, function (err, post) {
      if (err) return err
      // chatbot
      // incMessage=post.message
      let chatbotPost = chatbotCall(post)
      io.emit('new-message', { message: chatbotPost })
    })
  })
  socket.on('user-enter', function (data) {
    console.log('message', data)
    // broadcast to all users in the room
    io.emit('user-enter-notification', { message: data })
  })
  socket.on('user-leave', function (data) {
    console.log('message', data)
    // broadcast to all users in the room
    io.emit('user-leave-notification', { message: data })
  })
  socket.on('user-kick', function (data) {
    console.log('message', data)
    // broadcast to all users in the room
    io.emit('user-kick-notification', { message: data })
  })
})
// bot
function chatbotCall (post) {
  // check if bot is called
  let msg = post.message
  let botCheck = /\/bot comeback/
  // check if bot is kicked
  if (botAllowed) {
    let regex = /\/bot\s+([^\s]+)$/
    if (regex.test(msg)) {
      io.emit('new-message', { message: post })
      let result = msg.match(regex)
      let cmd = result[1]
      console.log(cmd)
      // generate response
      switch (cmd) {
        case 'kick':
          botAllowed = false
          post.message = ':( You can always call me back by calling /bot comeback'
          post.nickname = `Bot`
          break
        case 'hi':
          post.message = 'Hello! I am here!'
          post.nickname = `bot`
          break
        case 'showusers':
          post.message = 'show user'
          post.nickname = `bot`
          break
        case 'help':
          post.message = `Use /bot x to call bot. x can be: kick(kicks bot), showusers(shows all user in room)`
          post.nickname = `bot`
          break
        default:
          post.message = 'command not found. "Try /bot help"'
          post.nickname = `bot`
          return post
      }
    }
  } else if (botCheck.test(msg)) {
    io.emit('new-message', { message: post })
    botAllowed = true
    post.message = 'Yey! Bot is back'
    post.nickname = `bot`
  }
  return post
}

module.exports = router
