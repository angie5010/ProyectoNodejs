'use strict'
require ('dotenv').config();
var jwt = require("jsonwebtoken"); 
var Sessions = require('../models/accesstoken');
var middleware = {
    userprotectUrl: function(req,res,next){
        const token = req.headers['x-curso2024-access-token'];
        if (token){
            jwt.verify(token, process.env.KEY, (err, decoded)=> { //decodifica el token y asigna la data a la variable req.decoded
                if(err){
                    return res.status(401).send({
                        status: 401,
                        message: "Token no valido"
                    }); 
                }else{
                    req.decoded = decoded;
                    Sessions.findOne({
                        user:req.decoded.user.email, key: token, active: true
                       }) 
                         .then(session => { // usuarios es una colección de la base de datos????
                           console.log(session);

                           if(!session){
                            return res.status(401).send({
                              status: 401,
                              message: "Session no encontrada"
                              
                                });
                            }

                        //    return res.status(200).send({
                        //        status: 200,
                        //        message: "Información de usuario",
                        //        data:usuarios
                        //    });
                            next();
                         })
                         .catch((error) => {
                           console.error(error);
                           return res.status(500).send({
                               status:500,
                               message: "Error detectado"
                           });
                         });
                    
                }
            } );
        }else {
            return res.status(401).send({
                status: 401,
                message: "Datos no válidos"
            });
        }

        
    }
};

module.exports = middleware;