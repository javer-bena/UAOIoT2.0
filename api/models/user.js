'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = Schema({
    id: String,
    login: String,
    password: String
});

module.exports = mongoose.model('User', userSchema);