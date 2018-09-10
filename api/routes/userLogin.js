var express = require("express");
var router = express.Router();
var passport = require("passport");
var api = express.Router();
var jwt = require("jsonwebtoken");
var Userlogin = require("../models/userLogin");
const config = require('../config/database');

//var auth = jwt({secret: 'MY_SECRET',userProperty: 'payload'});

//REGISTRO
router.post('/register',(req, res, next) => {
    let newUser = new Userlogin({
        user: req.body.user,
        name: req.body.name,
        password: req.body.password
    });

    Userlogin.addUser(newUser, (err, user) => {
        if(err){
            res.json({success: false, msg: 'Fallo en el registro'});
        }else{
            res.json({success: true, msg: "Usuario registrado"});
        }
    });
});

//AUTH
router.post('/auth', (req, res, next) => {
    var username = req.body.user;
    var password = req.body.password;

    Userlogin.getUserByUsername(username, (err, user) => {
        if(err) throw err;
        if(!user){
            return res.json({success: false, msg: 'USUARIO NO ENCONTRADO' + user + username});
        }

        Userlogin.comparePassword(password, user.password, (err, isMatch) => {
            if(err) throw err;
            if(isMatch){
                const token = jwt.sign({data: user}, config.secret, {
                    expiresIn: 604800 // Una semana
                });

                res.json({
                    success: true,
                    token: `Bearer ${token}`,
                    user: {
                        id: user._id,
                        user: user.user,
                        name: user.name
                    }
                });
            }else{
                return res.json({success: false, msg: 'Contraseña incorrecta'});
            }
        });
    });
});

//PERFIL
router.get('/profile', passport.authenticate('jwt', {session:false}), (req, res, next) => {
    res.json({user: req.user});
});

module.exports = router;



/*
var ctrlProfile = require("../controllers/profile");
var ctrlAuth = require("../controllers/authentication");

//profile
api.get('/profile', auth, ctrlProfile.profileRead);

//auth
api.post('/register', ctrlAuth.register);
api.post('/login', ctrlAuth.login);

module.exports = api;*/