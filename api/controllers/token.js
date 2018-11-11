'use strict'

var Token = require('../models/token');

function postToken(req,res){
    var token = new Token();
    var params = req.body;

    token.value = params.value;
    token.user = parmas.user;

    token.save((err, tokenStored) =>{
        if(err){
            res.status(500).send({message: 'Error ' + err});
        }else{
            res.status(200).send({token: tokenStored});
        }
    });
}

/**
 * Método para consultar los dispositivos de un usuario.
 * @param {*} req 
 * @param {*} res 
 */
function getTokenUser(req,res){
    
    var tokenUser = req.params.user;

    Token.find({user : tokenUser},['value','user'], (err,token) => {
        if(err){
            res.status(500).send({ message: "Error "+ err});
        }else{
            if(!token){
                res.status(404).send({ message: "Este usuario no existe"});
            }else if(device.length == 0){
                res.status(200).send({ message: "Este usuario no tiene token"});
            }else{
                res.status(200).send({ token });
            }
        }
    })
}

module.exports = {
    getTokenUser,
    postToken
}

