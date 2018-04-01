'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var aclsSchema = Schema({
    id: String,
    user: String,
    topic: String,
    permission: String
});

module.exports = mongoose.model('Acls', aclsSchema);