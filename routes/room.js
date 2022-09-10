var express = require('express')
var router = express.Router()
var Room = require('../models/Room.js')
const { genSalt, hash: _hash, compare } = require('bcryptjs')
/* GET ALL ROOMS */
router.get('/', function (req, res, next) {
  // get userid
  const userid = req.query.userid
  console.log(
    userid
  )
  // mongoose fetch data from database
  Room.find(function (err, rooms) {
    if (err) return next(err)
    // error is null
    res.json(rooms)
  })
})

/* GET SINGLE ROOM BY ID */
router.get('/info/:id', function (req, res, next) {
  Room.findById(req.params.id, function (err, post) {
    if (err) return next(err)
    res.json(post)
  })
})

// join room
router.post('/join/:roomid', function (req, res, next) {
  const userid = req.query.userid
  const password = req.body.password
  Room.findById(req.params.roomid, function (err, roomInfo) {
    if (roomInfo.banUserIds.includes(userid)) {
      return res.json({errormessage: 'You are permanently banned by the room host!'})
    } else {
      if (err) return next(err)
      // check if room has password
      console.log('roominfo', roomInfo.password)
      console.log(password)
      if (roomInfo.password !== undefined) {
      // check if password matched

        compare(password, roomInfo.password).then(isMatch => {
          if (isMatch) {
            if (!roomInfo.userIds.includes(userid)) {
              roomInfo.userIds.push(userid)
            }
            Room.findByIdAndUpdate(req.params.roomid, roomInfo, function (err, oldData) {
              if (err) return next(err)
              return res.json(roomInfo)
            })
          } else {
            return res.json({errormessage: 'Wrong Password!'})
          }
        })
      } else {
      // check users in banlist
        if (roomInfo.banUserIds.includes(userid)) {
          return res.json({errormessage: 'You are permanently banned by the room host!'})
        } else {
          if (!roomInfo.userIds.includes(userid)) {
            roomInfo.userIds.push(userid)
          }
          Room.findByIdAndUpdate(req.params.roomid, roomInfo, function (err, oldData) {
            if (err) return next(err)
            res.json(roomInfo)
          })
        }
      }
    }
  })
})

// delete users from room
router.delete('/join/:roomid', function (req, res, next) {
  const userid = req.query.userid
  Room.findById(req.params.roomid, function (err, roomInfo) {
    if (err) return next(err)
    // filter function will keep item when filter function return true
    roomInfo.userIds = roomInfo.userIds.filter(id => id !== userid)
    Room.findByIdAndUpdate(req.params.roomid, roomInfo, function (err, oldData) {
      if (err) return next(err)
      res.json(roomInfo)
    })
  })
})

// kick users
router.post('/kick/:roomid', function (req, res, next) {
  const banuserid = req.query.userid
  const creator = req.body.creatoruser
  Room.findById(req.params.roomid, function (err, roomInfo) {
    if (err) return next(err)
    // check not ban self
    // update ban list
    // send ban notification
    // erturn ban info
    if (banuserid === creator) {
      return res.json('You cannot kick yourself!')
    }
    if (!roomInfo.banUserIds.includes(banuserid)) {
      roomInfo.banUserIds.push(banuserid)
      roomInfo.userIds = roomInfo.userIds.filter(id => id !== banuserid)
    }
    Room.findByIdAndUpdate(req.params.roomid, roomInfo, function (err, oldData) {
      if (err) return next(err)
      res.json(roomInfo)
    })
  })
})

/* SAVE ROOM the add room function */
router.post('/', function (req, res, next) {
  const userid = req.query.userid
  Room.create(req.body, function (err, post) {
    if (err) return next(err)
    Room.findById(post._id, function (err, roomInfo) {
      if (err) return next(err)
      roomInfo.creatorId = userid
      genSalt(10, (err, salt) => {
        if (err) return next(err)
        _hash(roomInfo.password, salt, (err, hash) => {
          if (err) return next(err)
          roomInfo.password = hash
          roomInfo.save()
        })
      })

      Room.findByIdAndUpdate(post._id, roomInfo, function (err, oldData) {
        if (err) return next(err)
      })
    })
    res.json(post)
  })
})

module.exports = router
