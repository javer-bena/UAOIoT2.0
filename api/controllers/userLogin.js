'use strict'

var UserLogin = require('../models/userLogin');

/**
 * Metodo para consultar todos los uusarios de la base de datos.
 * @param {*} req 
 * @param {*} res 
 */
function getUsers(req, res) {

    UserLogin.find({}, (err, users) => {
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

module.exports = {

    getUsers,
    
}