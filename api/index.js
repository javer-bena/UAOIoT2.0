'use strict'

var mongoose = require('mongoose');
var app = require('./app');
var port = process.env.PORT || 3000;

mongoose.connect('mongodb://localhost:27017/uaoiotmqtt', (err, res) => {

    if (err) {
        throw err;
    } else {
        app.listen(port, function() {
            console.log('Conexión correcta');
        });
    }
})