'use strict'

var express = require('express');
var ProjectController = require('../controllers/project');
var api = express.Router();

api.get('/projectId/:_id',ProjectController.getProjectId);
api.get('/projectUser/:user', ProjectController.getProjectUser);
api.post('/project', ProjectController.postProject);
api.delete('/project/:id',ProjectController.deleteProject);

module.exports = api;