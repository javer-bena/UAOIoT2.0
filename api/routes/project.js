'use strict'

var express = require('express');
var ProjectController = require('../controllers/project');
var api = express.Router();

api.get('/projectId/:id',ProjectController.getProjectId);
api.get('/projectUser/:user', ProjectController.getProjectUser);
api.post('/device', ProjectController.postProject);
api.delete('/device/:id',ProjectController.deleteProject);

module.exports = api;