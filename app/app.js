const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const indexRouter = require('./routes/index.routes');


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
require('dotenv').config();

app.use(cors());

app.use(express.static(path.join(__dirname, 'public')));


app.get('/', (req, res) => {
    res.send('API funcionando correctamente');
});

app.use('/', indexRouter);

module.exports = app;