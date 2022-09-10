//import { Router } from 'express';
import pkgEXPRESS from 'express';
const { Router } = pkgEXPRESS;
const router = Router();

//import { genSalt, hash as _hash, compare } from 'bcryptjs';
import pkg from 'bcryptjs';
const { genSalt, hash: _hash, compare } = pkg;

//import { sign } from 'jsonwebtoken';
import pkgJSON from 'jsonwebtoken';
const { sign } = pkgJSON;

//import { authenticate } from 'passport';
import pkgAUTH from 'passport';
const { authenticate } = pkgAUTH;

import { secret as key } from '../../database_and_passport/dBconnect.js';

import User from '../../user_obj/user.js';

/**
 * @route POST api/users/register
 * @desc Register the User
 * @access Public
 */
router.post('/register', (req, res) => {
    let {
        password,
        username,
    } = req.body
    // Check for the unique Username
    User.findOne({
        username: username
    }).then(user => {
        if (user) {
            return res.status(400).json({
                msg: "Username is already taken."
            });
        }
    })

    // The data is valid and new we can register the user
    let newUser = new User({
        username,
        password
    });

    // Hash the password
    genSalt(10, (err, salt) => {
        _hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser.save().then(user => {
                return res.status(201).json({
                    success: true,
                    msg: "Hurry! User is now registered."
                });
            });
        });
    });
});

/**
 * @route POST api/users/login
 * @desc Signing in the User
 * @access Public
 */
router.post('/login', (req, res) => {
    User.findOne({
        username: req.body.username
    }).then(user => {
        if (!user) {
            return res.status(404).json({
                msg: "Username is not found.",
                success: false
            });
        }
        // If there is user we are now going to compare the password
        compare(req.body.password, user.password).then(isMatch => {
            if (isMatch) {
                // User's password is correct and we need to send the JSON Token for that user
                const payload = {
                    _id: user._id,
                    username: user.username,
                }
                sign(payload, key, {
                    expiresIn: 700000
                }, (err, token) => {
                    res.status(200).json({
                        success: true,
                        token: `Bearer ${token}`,
                        user: user,
                        msg: "Hurry! You are now logged in."
                    });
                })
            } else {
                return res.status(404).json({
                    msg: "Incorrect password.",
                    success: false
                });
            }
        })
    });
});

/**
 * @route POST api/users/profile
 * @desc Return the User's Data
 * @access Private
 */
// router.get('/profile', authenticate('jwt', {
//     session: false
// }), (req, res) => {
//     return res.json({
//         user: req.user
//     });
// });

export default router;