const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const User = require('../models/user');
const _ = require('underscore');
const {verifyToken, verifyAdmin} = require('../middlewares/authenticate');

app.get('/user', verifyToken, (req, res) => {

    let from = req.query.from || 0;
    from = Number(from);

    let limit = req.query.limit || 5;
    limit = Number(limit);

    User.find({status: true}, 'name email role status img google')
        .skip(from)
        .limit(limit)
        .exec((err, users) => {
            if (err) {
                return res.status(400).json({
                    status: false,
                    err
                });
            }

            User.count({status: true}, (err, countUsers) => {
                res.json({
                    status: true,
                    users,
                    total: countUsers
                });
            });
        });
})

app.post('/user', [verifyToken, verifyAdmin], (req, res) => {
    let body = req.body;

    let user = new User({
        name: body.name,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    user.save((err, userDb) => {
        if (err) {
            return res.status(400).json({
                status: false,
                err
            });
        }
        res.json({
            status: true,
            user: userDb,
        })
    });
})

app.put('/user/:id', [verifyToken, verifyAdmin], (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['name', 'email', 'img', 'role, status']);

    User.findByIdAndUpdate(id, body, {new: true, runValidators: true}, (err, userDb) => {
        if (err) {
            return res.status(400).json({
                status: false,
                err
            });
        }

        res.json({
            status: true,
            user: userDb
        })
    });
})

app.delete('/user/:id', [verifyToken, verifyAdmin], (req, res) => {
    let id = req.params.id;
    let changeStatus = {
        status: false,
    };
    // User.findByIdAndRemove(id, (err, userDeleted) => {
    User.findByIdAndUpdate(id, changeStatus, {new: true}, (err, userDeleted) => {
        if (err) {
            return res.status(400).json({
                status: false,
                err
            });
        }

        if (!userDeleted) {
            return res.status(400).json({
                status: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            });
        }
        res.json({
            status: true,
            user: userDeleted
        });
    });
})

module.exports = app