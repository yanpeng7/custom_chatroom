var { Router } = require('express')

var router = Router()

var { sign } = require('jsonwebtoken')

var User = require('../models/User')

var { secret } = require('./connection')

var key = secret

var sanitize = require('mongo-sanitize')

var { genSalt, hash: _hash, compare } = require('bcryptjs')

// signup
router.post('/register', (req, res) => {
  let username = sanitize(req.body.username)
  let password = sanitize(req.body.password)
  // Check for the unique Username
  User.findOne({
    username: username
  }).then(user => {
    if (user) {
      return res.status(400).json({
        msg: 'Username is already taken.'
      })
    }
  })
  // The data is valid and new we can register the user
  let newUser = new User({
    password,
    username
  })

  // hash password
  const saltRounds = 10
  genSalt(saltRounds, (error, salt) => {
    if (error) return error
    _hash(newUser.password, salt, (error, hashedPWD) => {
      if (error) return error
      newUser.password = hashedPWD
      newUser.save().then(returnedUser => {
        return res.status(201).json({
          msg: 'User is registered!',
          success: true
        })
      })
    })
  })
})

// login
router.post('/login', (req, res) => {
  let username = sanitize(req.body.username)
  User.findOne({
    username: username
  }).then(user => {
    if (!user) {
      return res.status(404).json({
        msg: 'Username is not found.',
        success: false
      })
    }
    // if user exists check password
    let dbPWD = user.password
    let userPWD = sanitize(req.body.password)
    compare(userPWD, dbPWD).then(check => {
      if (check) {
        // send json token if user password is correct
        const payload = {
          username: user.username,
          _id: user._id
        }
        sign(payload, key, {
          expiresIn: 700000
        }, (error, signature) => {
          if (error) return error
          res.status(200).json({
            msg: 'You are now logged in.',
            token: signature,
            user: user,
            success: true
          })
        })
      } else {
        return res.status(404).json({
          msg: 'Incorrect password.',
          success: false
        })
      }
    })
  })
})
module.exports = router
