'use strict'

var express = require('express');
var DashboardController = require('../controllers/dashboard');
var api = express.Router();

api.get('/devicetoken/:id',DashboardController.getDashboardId);
api.get('/deviceuser/:user', DashboardController.getDashboardUser);
api.post('/device', DashboardController.postDashboard);
api.put('device/:id',DashboardController.updateDashboard);
api.delete('/device/:id',DashboardController.deleteDashboard);

module.exports = api;