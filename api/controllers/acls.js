'use strict'

var Acls = require('../models/acls');


function getAcls(req, res) {
    var aclsId = req.params.id;

    User.findById(aclsId, (err, acls) => {
        if (err) {
            res.status(500).send({ message: "Error" });
        } else {
            if (!user) {
                res.status(404).send({ message: 'No existen acls' });
            } else {
                res.status(200).send({ acls });
            }
        }

    })

}

function getAclss(req, res) {

    Acls.find({}, (err, aclss) => {
        if (err) {
            res.status(500).send({ message: 'Error al buscar' });
        } else {
            if (!aclss) {
                res.status(404).send({ message: 'No existen acls' });
            } else {
                res.status(200).send({ aclss });
            }
        }

    });

}

function postAcls(req, res) {
    var acls = new acls();
    var params = req.body;

    acls.id = params.id;
    acls.user = params.user;
    acls.topic = params.topic;
    acls.permission = params.permission;

    acls.save((err, aclsStored) => {
        if (err) {
            res.status(500).send({ message: 'Error al guardar' });
        } else {
            res.status(200).send({ user: aclsStored });
        }

    });
}


function updateAcls(req, res) {
    var aclsId = req.params.id;
    var update = req.body;

    Acls.findByIdAndUpdate(aclsId, update, (err, aclsUpdate) => {
        if (err) {
            res.status(500).send({ message: 'Error al actualizar' });
        } else {
            res.status(200).send({ aclsUpdate });
        }
    });
}

function deleteAcls(req, res) {
    var aclsId = req.params.id;

    Acls.findById(aclsId, (err, user) => {
        if (err) {
            res.status(500).send({ message: "Error" });
        }

        if (!acls) {
            res.status(404).send({ message: 'No existen acls' });
        } else {
            acls.remove((err) => {
                if (err) {
                    res.status(500).send({ message: "Error al borrar" });
                } else {
                    res.status(200).send({ message: "acls eliminado" });
                }
            });
        }
    });
}

module.exports = {
    getAcls,
    getAclss,
    postAcls,
    updateAcls,
    deleteAcls
}