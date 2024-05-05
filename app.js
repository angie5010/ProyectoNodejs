"use strict";
const express = require("express"); //manejo de los web, el puerto entre otros
const app = express();
var bodyParser = require("body-parser"); // Nos ayuda a parsear las entradas vía el body del request (eso se puede observar en el postman)
var routes = require("./routes/api"); //manejo de rutas
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(
  bodyParser.json({
    parameterLimit: 100000, // es para que no nos hagan caer el servicios enviando json muy extensos
    limit: "50mb",
    extended: false,
  })
);
//Errores de json (este middleware se ejecuta antesde las peticiones, antes de acceder a las rutas, antes de todo)
app.use((err, req, res,next)=> {
  if( err instanceof SyntaxError && err.status === 400 && 'body' in err)  {// si tengo error de sintaxis y erros de estatus
    return res.status(400).send({ status:400, message: err.message});

  }
  next();
  });

app.use("", routes);
module.exports = app;
