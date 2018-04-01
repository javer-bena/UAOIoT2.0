'use strict'

var express = require('express');
var bodyParser = require('body-parser');
var app = express();

var apiUser = require('./routes/user');
var apiMessage = require('./routes/message');
var apiAcls = require('./routes/acls');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header('Acces-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'X-API-KEY,Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Alllow', 'GET, POST, OPTIONS, PUT, DELETE');

    next();
});

app.use('/api', apiUser);
app.use('/api', apiMessage);
app.use('/api', apiAcls);

module.exports = app;