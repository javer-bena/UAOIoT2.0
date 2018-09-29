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
var mqtt = require('mqtt');

var optionsMqtt = {
    port: 1883,
    host: 'mqtt://10.10.38.129',
    username: 'user1',
    password: '123456',
    keepalive: 60,
    reconnectPeriod: 1000,
    protocolId: 'MQIsdp',
    protocolVersion: 3,
    clean: true,
    encoding: 'utf8'
};

var io = require('socket.io').listen(5000);
//var io = require('socket.io').connect();

//ip UAO
var client = mqtt.connect('mqtt://10.10.47.120',optionsMqtt);
//ip casa
//var client = mqtt.connect('mqtt://192.168.0.14');

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

var topic = 'test1';

/**
 * Socket events
 */


io.sockets.on('connection', function(socket){
    console.log('Socket connected');
    
    socket.on('recep', function (data) {
        console.log('Subscribing to '+ topic);
        console.log('DATA to '+ data.payload);
        //socket.broadcast.emit()
        socket.join(topic);
        
        client.subscribe(topic, function(){
            client.on('payload',function(topic,payload,packet){
                console.log('payload: ' + payload);
            });
        });
        
    });

    
    client.publish(topic,'15',function(){
        console.log("MESSAGE: " + topic);
    });


    socket.on('recep', function (data) {
        console.log('Publishing to '+ topic);
        console.log('DATA 2 '+ data.payload);
        client.publish(topic,data.payload);
        
    });

});

client.on(topic, function (topic, payload, packet) {
    console.log(topic+'='+payload);
    io.sockets.emit('mqtt',{'topic':String(topic),
                            'payload':String(payload)});
});



app.use('/api', apiUser);
app.use('/api', apiMessage);
app.use('/api', apiAcls);
app.use('/api', apiUserLogin);
app.use('/api', device);

module.exports = app;
