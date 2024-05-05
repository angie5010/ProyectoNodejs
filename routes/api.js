'use strict'
const express = require('express');
const {body} = require ('express-validator');
var api = express.Router();
var middleware = require("../middleware/middleware"); //instancia del middleware
var UsersController = require("../controllers/users");
var AuthController = require("../controllers/auth")
    //Login
    api.post('/login',[ //el login no lleva middleware
      body("email").not().isEmpty(),
      body("password").not().isEmpty()
     ], AuthController.login_user );
    api.post('/logout', middleware.userprotectUrl, AuthController.logout); //pero el logout si lleva middleware porque debiste hacer un login para poder hacer logout

    //Usuarios
    api.get('/user', middleware.userprotectUrl, UsersController.userlist); //añadir middleware a la ruta específica a la que va a proteger
    api.get('/user/:iduser', middleware.userprotectUrl,UsersController.userSingular); 
    api.post('/user', middleware.userprotectUrl,[
      body("iduser").not().isEmpty(),
      body("name").not().isEmpty(),
      body("Apellido").not().isEmpty(),
      body("Edad").not().isEmpty(),
      body("email").not().isEmpty(),
      body("password").not().isEmpty()

  ],UsersController.createuser); 

    api.put('/user/:iduser', middleware.userprotectUrl,[
      body("iduser").not().isEmpty(),
      body("name").not().isEmpty(),
      body("Apellido").not().isEmpty(),
      body("Edad").not().isEmpty(),
      body("email").not().isEmpty(),
      body("password").not().isEmpty()
  ],UsersController.updateuser); 

    api.delete('/user/:iduser',middleware.userprotectUrl,  UsersController.deleteuser); 

    module.exports = api;