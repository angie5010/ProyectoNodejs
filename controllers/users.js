"use strict";
const {validationResult} = require('express-validator');

const bcrypt = require('bcrypt');

var Users = require("../models/users");

var controller = {
  userlist: function (req, res) {
    //método para listar usuarios

    Users.find({
      /*name:"Oscar"*/ // ejemplo de parámetro de búsqueda
    }) // find acepta un json de búsqueda
      .then((usuarios) => { // usuarios es una colección de la base de datos
        //console.log(usuarios);
        return res.status(200).send({
            status: 200,
            message: "Usuarios listados",
            data:usuarios
        });
      })
      .catch((error) => {
        console.error(error);
        return res.status(500).send({
            status:500,
            message: "Error detectado"
        });
      });

   // return res.send("Hola mundo desde el controller");
  },

  userSingular: function(req, res){
    var params = req.params;
    console.log(params);
    var iduser = params.iduser;
    Users.findOne({
       iduser:parseInt(iduser) //si no se coloca el parse no trae la data porque no reconoce el id
      }) 
        .then((usuarios) => { // usuarios es una colección de la base de datos
          console.log(usuarios);
          return res.status(200).send({
              status: 200,
              message: "Información de usuario",
              data:usuarios
          });
        })
        .catch((error) => {
          console.error(error);
          return res.status(500).send({
              status:500,
              message: "Error detectado"
          });
        });
  },

  createuser: function (req, res) {

    const errors= validationResult(req);
    if(!errors.isEmpty()){
      return res.status(400).send({ status:400, errors: errors.array()});
    }

    var data = req.body;
    //usuario existente
    Users.findOne({
      iduser: data.iduser
     }) 
       .then((usuarios) => { // usuarios es una colección de la base de datos??
         //validación de usuario replicado
          if(usuarios){
          return res.status(400).send({
             status: 400,
              message: "Usuario ya existe"
             
          });
         }
         // Crypt de password
        const saltRounds = 10;
        bcrypt.genSalt(saltRounds, function(err, salt){
          bcrypt.hash(data.password, salt, function(err, hash){
              //
              var create_user = new Users(); //inicializamos la variable para tener la capacidad de asignarle valores
              create_user.iduser = data.iduser;
              create_user.name = data.name; //Asignamos un valor al modelo
              create_user.Edad = data.Edad;
              create_user.Apellido = data.Apellido;
              create_user.email = data.email;
              create_user.grupos = data.grupos;
              create_user.materias = data.materias;
              create_user.password = hash;
              create_user.save() //Aqu;i se guarda los valores asignados al modelo
              .then((result) => {
                  return res.status(200).send({
                    status: 200,
                    message: "Usuario almacenado",
                    data:result
                  });
              } )
              .catch(error => {
                  console.error(error);
                  return res.status(500).send({
                      status:500,
                      message: "Error detectado"
                  });
                });
          });
        });
        
        

       


       })
       .catch((error) => {
         console.error(error);
         return res.status(500).send({
             status:500,
             message: "Error detectado"
         });
       });
    // console.log(data);
    // console.log(data.name);
    // console.log(data.Edad);

    
   
  },

  updateuser: function(req, res){
    const errors= validationResult(req);
    if(!errors.isEmpty()){
      return res.status(400).send({ status:400, errors: errors.array()});
    }

    var params = req.params;
    var iduser = params.iduser;
    var data = req.body;
    // Crypt de password
    const saltRounds = 10;
    bcrypt.genSalt(saltRounds, function(err, salt){
      bcrypt.hash(data.password, salt, function(err, hash){
        var update_user = {
          iduser : data.iduser,
          name :data.name,
          Edad : data.Edad,
          Apellido: data.Apellido,
          email: data.email,
          password: hash,
          grupos : data.grupos,
          materias :  data.materias
        }
    
        Users.findOneAndUpdate({
           iduser:parseInt(iduser) //si no se coloca el parse no trae la data porque no reconoce el id
          }, update_user) 
            .then((usuarios) => { // usuarios es una colección de la base de datos
    
              if(!usuarios){
                return res.status(200).send({
                  status: 200,
                  message: "Usuario no encontrado"
                  
              });
              }
              console.log(usuarios);
              return res.status(200).send({
                  status: 200,
                  message: "Usuario actualizado"
                  
              });
            })
            .catch((error) => {
              console.error(error);
              return res.status(500).send({
                  status:500,
                  message: "Error detectado"
              });
            });
      });

    });  


  },

  deleteuser: function(req, res){
    var params = req.params;
    var iduser = params.iduser;
    Users.findOneAndDelete({
      iduser:parseInt(iduser) //si no se coloca el parse no trae la data porque no reconoce el id
     }) 
       .then((usuarios) => { // usuarios es una colección de la base de datos
        if(!usuarios){
          return res.status(200).send({
            status: 200,
            message: "Usuario no encontrado"
            
        });
        }
         return res.status(200).send({
             status: 200,
             message: "Usuario eliminado"
             
         });
       })
       .catch((error) => {
         console.error(error);
         return res.status(500).send({
             status:500,
             message: "Error detectado"
         });
       });
    
  }
};

module.exports = controller;
