'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var projectSchema = Schema({
    name:String, //TOPICO
    device: String,
    dashboard: String
});

module.exports = mongoose.model('Project', projectSchema);