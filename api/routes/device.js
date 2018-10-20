'use strict'

var express = require('express');
var DeviceController = require('../controllers/device');
var api = express.Router();

api.get('/devicetoken/:token',DeviceController.getDeviceId);
api.get('/deviceuser/:user', DeviceController.getDeviceUser);
api.post('/device', DeviceController.postDevice);
api.put('device/:id',DeviceController.updateDevice);
api.delete('/device/:id',DeviceController.deleteDevice);

module.exports = api;