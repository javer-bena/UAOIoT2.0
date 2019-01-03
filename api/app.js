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

//Routes
var routesApi = require("./index")
var apiUser = require('./routes/user');
var apiMessage = require('./routes/message');
var apiAcls = require('./routes/acls');
var apiUserLogin = require('./routes/userLogin');
var device = require('./routes/device');
var apiDashboard = require('./routes/dashboard');
var apiChart = require('./routes/chart');
var apiProject = require('./routes/project');
var apiToken = require('./routes/token');

//MQTT
var mqtt = require('mqtt');
var optionsMqtt = {};
/*var optionsMqtt = {
    port: 1883,
    host: 'mqtt://192.168.0.11',
    username: 'user1',
    password: '123456',
    keepalive: 60,
    reconnectPeriod: 1000,
    protocolId: 'MQIsdp',
    protocolVersion: 3,
    clean: true,
    encoding: 'utf8'
};*/

var io = require('socket.io').listen(5000);
//var io = require('socket.io').connect();
//ip UAO
//ip casa
//var client = mqtt.connect('mqtt://192.168.0.7');

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

var user = '';
var topic = '';
var password = '';


/**
 * Socket events
 */

io.sockets.on('connection', function(socket){
    console.log('1 Socket connected');
    var client;
    
    socket.on('sendData', function(data){

        user = data.user;
        topic = data.topic;
        password = data.password;

        console.log(user);
        console.log(topic);
        console.log(password);


        optionsMqtt = {
            port: 1883,
            host: 'mqtt://192.168.0.23',
            username: user,
            password: password,
            keepalive: 60,
            reconnectPeriod: 1000,
            protocolId: 'MQIsdp',
            protocolVersion: 3,
            clean: true,
            encoding: 'utf8'
        };
    

        client = mqtt.connect('mqtt://192.168.0.23',optionsMqtt);
    
        //SUBSCRIBIRSE AL BROKER DESPUES DE CONECTARSE AL SOCKET
        client.subscribe("test2", function(){
            console.log('2 Subscribing to test1');

            //ENVIAR MENSAJE ENVIADO POR EL DISPOSITIVO A ANGULAR DEL MISMO TOPICO 
        });

        client.on('message',function(topic,payload,packet){
            console.log('payload from phone: ' + payload);


            io.sockets.emit('reciveMessage',{'topic':String(topic),
                            'payload':String(payload)});
            console.log("EMITE RECIVEMESSAGE TO ANGULAR");
            //io.sockets.emit('reciveMessage',{msg: payload});
        });


        //MENSAJE ENVIADO DESDE ANGULAR
        socket.on('sendMessage', function (data) {

            this.topic = data.topic;
        
            //SE PUBLICA EL MENSAJE RECIBIDO DE ANGULAR AL BROKER
            client.publish(data.topic,data.payload,function(){
                console.log("3 MESSAGE from client : " + data.payload + " - " + data.topic);
                
            });
            
        });

    });
    
    

});


app.use('/api', apiUser);
app.use('/api', apiMessage);
app.use('/api', apiAcls);
app.use('/api', apiUserLogin);
app.use('/api', device);
app.use('/api', apiDashboard);
app.use('/api', apiChart);
app.use('/api', apiProject);
app.use('/api', apiToken);

module.exports = app;
