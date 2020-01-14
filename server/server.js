const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const config = require('./config/config');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())

app.get('/user', function (req, res) {
    res.json('get user')
})

app.post('/user', function (req, res) {
    let body = req.body;

    if (body.name === undefined) {
        res.status(400).json({
            status: false,
            message: 'El nombre es necesario'
        });
    } else {
        res.json({
            person: body
        })
    }
})

app.put('/user/:id', function (req, res) {
    let id = req.params.id;
    res.json({
        id
    })
})

app.delete('/user', function (req, res) {
    res.json('delete user')
})

app.listen(process.env.PORT, () => {
    console.log(`Escuchando puerto: `, process.env.PORT)
})