'use strict'

const mongoose = require('mongoose'); // es importante para poder conectar con la base de datos
var Schema = mongoose.Schema;

var AccestokenSchema = Schema({
    user: {type: String, require: true, unique:true}, // este valor no se va a repetir
    key: String,
    creationDate: Date,
    expirationDate: String,
    active: Boolean
});

module.exports = mongoose.model('accesstoken',AccestokenSchema);