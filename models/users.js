'use strict'

const mongoose = require('mongoose'); // es importante para poder conectar con la base de datos
var Schema = mongoose.Schema;

var UserSchema = Schema({
    iduser: Number,
    name: String,
    Edad: Number,
    Apellido: String,
    email: String,
    password: String,
    grupos: Array,
    materias: Array
});

module.exports = mongoose.model('usuarios',UserSchema);