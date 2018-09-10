'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var deviceSchema = Schema({
    token:String,
    name:String,
    user:String

});

module.exports = mongoose.model('Device',deviceSchema);