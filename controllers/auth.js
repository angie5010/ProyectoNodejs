"use strict";

require("dotenv").config();
var jwt = require("jsonwebtoken"); // se importa jwt
const { validationResult } = require("express-validator");
const bcrypt = require('bcrypt');

var Users = require("../models/users"); //Se importa el modelo
var Sessions = require("../models/accesstoken");

var controller = {
  login_user: function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send({ status: 400, errors: errors.array() });
    }
    var data = req.body;
    Users.findOne({
      email: data.email, //si no se coloca el parse no trae la data porque no reconoce el id
    })
      .then((usuarios) => {

        // bcrypt
        bcrypt.compare(data.password, usuarios.password, function (err, result){
                if (result) {
                    const payload = {
                    //aquí s eecunetra la información del usuario y esto formará parte del token
                    user: usuarios,
                    };
                    let acces_token = jwt.sign(payload, process.env.KEY, {
                    expiresIn: "1d",
                    });
        
                    let today = new Date().toISOString();
        
                    let update_session = {
                    user: usuarios.email,
                    key: acces_token,
                    creationDate: today,
                    expirationDate: "1d",
                    active: true,
                    };
                    Sessions.findOneAndUpdate(
                    {
                        user: usuarios.email, //si no se coloca el parse no trae la data porque no reconoce el id
                    },
                    update_session,
                    { upsert: true, new: true }
                    )
                    .then((session) => {
                        // usuarios es una colección de la base de datos
        
                        if (!session) {
                        return res.status(401).send({
                            status: 401,
                            message: "Usuario no encontrado",
                        });
                        }
        
                        return res.status(200).send({
                        status: 200,
                        message: "Login correcto",
                        token: acces_token,
                        });
                    })
                    .catch((error) => {
                        console.error(error);
                        return res.status(500).send({
                        status: 500,
                        message: "Error detectado",
                        });
                    });
                } else {
                    return res.status(401).send({
                    status: 401,
                    message: "Datos no validos",
                    });
                }
                });

 
      })
      .catch((error) => {
        console.error(error);
        return res.status(401).send({
          status: 401,
          message: "Datos no validos",
        });
      });
  },

  logout: function (req, res) {
    const token = req.headers['x-curso2024-access-token'];
    console.log(token);
    Sessions.findOneAndDelete({
      user: req.decoded.user.email, key: token
    })
      .then((session) => {
        if (!session) {
          return res.status(200).send({
            status: 200,
            message: "Token invalido",
          });
        }
        return res.status(200).send({
          status: 200,
          message: "Sesion finalizada",
        });
      })
      .catch((error) => {
        console.error(error);
        return res.status(500).send({
          status: 500,
          message: "Token invalido",
        });
      });
  },
};

module.exports = controller;
