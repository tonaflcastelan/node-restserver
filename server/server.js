require('./config/config');
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())

/* Routes config */
app.use(require('./routes/index'));

mongoose.connect(process.env.URL_DB, 
{
    useNewUrlParser: true,
    useCreateIndex: true
},
(err, res) => {
  if (err) throw err;
  console.log('DB Online');
});

app.listen(process.env.PORT, () => {
    console.log(`Escuchando puerto: `, process.env.PORT)
});