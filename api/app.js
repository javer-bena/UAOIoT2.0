'use strict'

var express = require('express');
var app = express();
var path = require("path");
//var favicon = require("serve-favicon");
//var logger = require('morgan');
//var cookieParser = require('cookie-parser');
var cors = require('cors');
var bodyParser = require('body-parser');
var passport = require('passport');

require('./models/db');
require('./config/passport');

var routesApi = require("./index")
var apiUser = require('./routes/user');
var apiMessage = require('./routes/message');
var apiAcls = require('./routes/acls');
var apiUserLogin = require('./routes/userLogin');
var device = require('./routes/device');

app.use(cors());
//app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//app.use(cookieParser());

app.use(passport.initialize());
app.use(passport.session());
//app.use('./', routesApi);

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
app.use('/api', apiUserLogin);
app.use('/api', device);

module.exports = app;