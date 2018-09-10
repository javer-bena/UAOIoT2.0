'use strict'

var Device = require('../models/device');

/**
 * Método para consultar un dispositivo por su ID.
 * @param {*} req 
 * @param {*} res 
 */
function getDeviceId(req,res){

    var deviceId = req.params.token;

    Device.finde({id : deviceId},['token','user','name'], (err,device) => {
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
 * Método para consultar los dispositivos de un usuario.
 * @param {*} req 
 * @param {*} res 
 */
function getDeviceUser(req,res){
    
    var deviceUser = req.params.user;

    Device.find({user : deviceUser},['user','tken','name'], (err,device) => {
        if(err){
            res.status(500).send({ message: "Error "+ err});
        }else{
            if(!device){
                res.status(404).send({ message: "Este usuario no existe"});
            }else if(device.length == 0){
                res.status(200).sedm({ message: "Este usuario no tiene dispositivos"});
            }else{
                res.status(200).send({ device });
            }
        }
    })
}

function postDevice(req, res){
    var device = new Device();
    var params = req.body;

    deviceid = params.token;
    device.name = parmas.name;
    device.user = params.user;

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
    getDeviceUser,
    getDeviceId,
    postDevice,
    deleteDevice
}