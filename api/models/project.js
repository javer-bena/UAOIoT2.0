'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var projectSchema = Schema({
    name:String,
    device: String
});

module.exports = mongoose.model('Project', projectSchema);