'use strict'

var Device = require('../models/device');

/**
 * Metodo para consultar todos los dispositivos de la base de datos.
 * @param {*} req 
 * @param {*} res 
 */
function getDevices(req, res) {

    Device.find({}, (err, devices) => {
        if (err) {
            res.status(500).send({ message: 'Error al buscar' });
        } else {
            if (!devices) {
                res.status(404).send({ message: 'No existen dispositivos' });
            } else {
                res.status(200).send({ devices });
            }
        }

    });

}

/**
 * Método para consultar un dispositivo por su ID.
 * @param {*} req 
 * @param {*} res 
 */
function getDeviceId(req,res){

    var deviceId = req.params.token;

    Device.find({id : deviceId},['user','name','project','variables'], (err,device) => {
        if(err){
            res.status(500).send({ message: "Error "+ err});
        }else{
            if(!device){
                res.status(404).send({ message: "No existe el dispositivo"});
            }else if(device.length == 0){
                res.status(200).send({ message: "No existe un dispositivo con ese id"});
            }else{
                res.status(200).send({ device });
            }
        }
    })
}

/**
 * Método para consultar los dispositivos por id.
 * @param {*} req 
 * @param {*} res 
 */
function getDeviceId(req,res){
    
    var deviceUser = req.params.id;

    Device.find({user : deviceUser},['user','name','project','variables'], (err,device) => {
        if(err){
            res.status(500).send({ message: "Error "+ err});
        }else{
            if(!device){
                res.status(404).send({ message: "Este usuario no existe"});
            }else if(device.length == 0){
                res.status(200).send({ message: "Este usuario no tiene dispositivos"});
            }else{
                res.status(200).send({ device });
            }
        }
    })
}

/**
 * Método para consultar los dispositivos de un usuario.
 * @param {*} req 
 * @param {*} res 
 */
function getDeviceUser(req,res){
    
    var deviceUser = req.params.user;

    Device.find({user : deviceUser},['user','name','project','variables'], (err,device) => {
        if(err){
            res.status(500).send({ message: "Error "+ err});
        }else{
            if(!device){
                res.status(404).send({ message: "Este usuario no existe"});
            }else if(device.length == 0){
                res.status(200).send({ message: "Este usuario no tiene dispositivos"});
            }else{
                res.status(200).send({ device });
            }
        }
    })
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
function getDeviceProject(req,res){

    var deviceProject = req.params.project;

    Device.find({project: deviceProject},['user','name','project','variables'], (err,project) =>{
        if(err){
            res.status(500).send({message: "Error " + err});
        }else{
            if(!device){
                res.status(404).send({message: "Este usuario no existe"});
            }else if(device.length == 0){
                res.status(200).send({message: "Este proyecto no tiene dispositivos"});
            }else{
                res.status(200).send({device});
            }
        }
    })
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
function postDevice(req, res){
    var device = new Device();
    var params = req.body;

    device.name = params.name;
    device.user = params.user;
    device.project = params.project;
    device.variables = params.variables;

    device.save((err, deviceStored) => {
        if(err){
            res.status(500).send({ message: 'Error ' + err});
        }else{
            res.status(200).send({ device: deviceStored });
        }
    });
}

function updateDevice(req, res){
    var deviceId = req.params.id;
    var update = req.body;

    Device.findByIdAndUpdate(deviceId, update, (err,deviceUpdate) => {
        if(err){
            res.status(500).send({ message: 'Error al actualizar'});
        }else{
            res.status(200).send({ deviceUpdate });
        }
    });
}

function deleteDevice(req,res){

    var deviceId = req.params.id;

    Device.find({id : deviceId},(err, device) => {
        if(err){
            res.status(500).send({ message: "Error "});
        }

        if(!device){
            res.status(500).send({ message: "No existe"});
        }else{
            device.remove((err) => {
                if(err){
                    res.status(500).send({ message: "ERROR AL ELIMINAR"});
                }else{
                    res.status(200).send({ message: "Dispositivo eliminado"});
                }
            });
        }
    });
}

module.exports = {
    getDevices,
    getDeviceUser,
    getDeviceId,
    getDeviceProject,
    postDevice,
    updateDevice,
    deleteDevice
}