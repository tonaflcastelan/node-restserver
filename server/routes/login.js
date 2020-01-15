const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

app.post('/login', (req, res) => {
    let body = req.body;

    User.findOne({email: body.email}, (err, user) => {
        if (err) {
            return res.status(500).json({
                status: false,
                err
            });
        }

        if (!user) {
            return res.status(400).json({
                status: false,
                err: {
                    message: 'Usuario o contraseña incorrectos',
                }
            });
        }

        if (!bcrypt.compareSync(body.password, user.password)) {
            return res.status(400).json({
                status: false,
                err: {
                    message: 'Usuario o contraseña incorrectos',
                }
            });
        }

        let token = jwt.sign({
            user
        }, process.env.TOKEN_SEED, {expiresIn: process.env.EXPIRES});

        res.json({
            status: true,
            user,
            token
        });
    });
})


/* Google Config */
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    console.log(payload);
    return {
        name: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
}

app.post('/google', async (req, res) => {
    let token = req.body.idToken;
    let googleUser = await verify(token)
        .catch(e => {
            return res.status(403).json({
                status: false,
                err: e
            })
        })
    
    User.findOne({email: googleUser.email}, (err, user) => {
        if (err) {
            return res.status(500).json({
                status: false,
                err
            });
        }

        if (user) {
            if (user.google === false) {
                return res.status(400).json({
                    status: false,
                    err: {
                        message: 'Debe utilizar la autenticación normal'
                    }
                });
            } else {
                let token = jwt.sign({
                    user
                }, process.env.TOKEN_SEED, {expiresIn: process.env.EXPIRES});

                return res.json({
                    status: true,
                    user,
                    token 
                })
            }
        } else {
            /* Create new user if doesn't exists*/
            let userObj = new User();
            userObj.name = googleUser.name;
            userObj.email = googleUser.email;
            userObj.img = googleUser.img;
            userObj.google = true;
            userObj.password = ':)';

            userObj.save((err, user) => {
                if (err) {
                    return res.status(500).json({
                        status: false,
                        err
                    });
                }
                let token = jwt.sign({
                    user
                }, process.env.TOKEN_SEED, {expiresIn: process.env.EXPIRES});

                return res.json({
                    status: true,
                    user,
                    token 
                })
            })
        }
    })
})
module.exports = app