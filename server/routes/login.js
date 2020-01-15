const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

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
module.exports = app