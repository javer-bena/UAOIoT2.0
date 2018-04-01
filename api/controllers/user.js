'use strict'

var User = require('../models/user');

/**
 * Metodo para consultar un usuario de la base de datos mediante su id.
 * @param {*} req 
 * @param {*} res 
 */
function getUser(req, res) {
    var userId = req.params.id;

    User.findById(userId, (err, user) => {
        if (err) {
            res.status(500).send({ message: "Error" });
        } else {
            if (!user) {
                res.status(404).send({ message: 'No existen usuarios' });
            } else {
                res.status(200).send({ user });
            }
        }

    })

}
/**
 * Metodo para consultar todos los uusarios de la base de datos.
 * @param {*} req 
 * @param {*} res 
 */
function getUsers(req, res) {

    User.find({}, (err, users) => {
        if (err) {
            res.status(500).send({ message: 'Error al buscar' });
        } else {
            if (!users) {
                res.status(404).send({ message: 'No existen usuarios' });
            } else {
                res.status(200).send({ users });
            }
        }

    });

}

/**
 * Función POST para guardar usuarios en la base de datos.
 * @param {*} req 
 * @param {*} res 
 */
function postUser(req, res) {
    var user = new user();
    var params = req.body;

    user.id = params.id;
    user.login = params.login;
    user.password = params.password;

    user.save((err, userStored) => {
        if (err) {
            res.status(500).send({ message: 'Error al guardar' });
        } else {
            res.status(200).send({ user: userStored });
        }

    });
}

/**
 * Metodo para actualizar un usuario de la base de datos.
 * @param {*} req 
 * @param {*} res 
 */
function updateUser(req, res) {
    var userId = req.params.id;
    var update = req.body;

    User.findByIdAndUpdate(userId, update, (err, userUpdate) => {
        if (err) {
            res.status(500).send({ message: 'Error al actualizar' });
        } else {
            res.status(200).send({ userUpdate });
        }
    });
}

/**
 * Metodo para eliminar un usuario de la base de datos.
 * @param {*} req 
 * @param {*} res 
 */
function deleteUser(req, res) {
    var userId = req.params.id;

    User.findById(userId, (err, user) => {
        if (err) {
            res.status(500).send({ message: "Error" });
        }

        if (!user) {
            res.status(404).send({ message: 'No existen usuarios' });
        } else {
            user.remove((err) => {
                if (err) {
                    res.status(500).send({ message: "Error al borrar" });
                } else {
                    res.status(200).send({ message: "Usuario eliminado" });
                }
            });
        }
    });
}

module.exports = {
    getUser,
    getUsers,
    postUser,
    updateUser,
    deleteUser
}