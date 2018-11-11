'use strict'

var UserLogin = require('../models/userLogin');
var bcrypt = require("bcryptjs");

function postUserLogin(req,res){

    var userLogin = new UserLogin();
    var params = req.body;

    userLogin.user = params.user;
    userLogin.name = params.name;
    userLogin.password = params.password;

    console.log("POST USERLOGIN PASS: " + userLogin.password);

    bcrypt.genSalt(10, (err, salt) =>{
        bcrypt.hash(userLogin.password, salt, (err, hash) =>{
            if(err) throw err;

            userLogin.password = hash;

            userLogin.save((err, userLoginStored) =>{
                if(err){
                    res.status(500).send({ message: 'Error al guardar ' + err});
                }else{
                    
                    console.log("POST USERLOGIN: " + hash);
                    res.status(200).send({userLogin: userLoginStored});
                }
            })


        })

    })
}

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

function getUserByName(req,res){
    
    var userName = req.params.user;

    UserLogin.findOne({user : userName},['user','name','password'],(err,user)=>{
        if(err){
            res.status(500).send({message:"ERROR"});
        }else{
            if(!user){
                res.status(404).send({ message: 'No existen usuarios' });
            }else{
                res.status(200).send({ message: user });
                console.log(userName);
                console.log(user);
            }
        }
    });

    
}

module.exports = {

    getUsers,
    getUserByName,
    postUserLogin
    
}