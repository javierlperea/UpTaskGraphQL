// Mongoose utiliza modelos que iteractuan constantemente con nuestra base de datos
// Esta es la forma que va a tener mi DB, dentro del metodo Schema va un objeto con las opciones de configuracion
// Con este modelo los usuarios van a poder registrarse y tambien iniciar sesion
// Cada campo va a tener cierta configuracion como tipo de dato, dato obligatorio, dato unico, etc.
// Aqui modelo la informacion que va a tener mongo gracias al metodo .model( 'Usuario', UsuariosSchema ) y lo exporto
// Esta sintaxis es propia de MongoDB, no de GraphQL

const mongoose = require('mongoose');


const UsuariosSchema = mongoose.Schema({
    nombre: {
        type: String,       // Tipo de dato
        required: true,     // dato obligatorio
        trim: true          // elimina espacios
    },
    email: {
        type: String,       // Tipo de dato
        required: true,     // dato obligatorio
        trim: true,         // elimina espacios
        unique: true,       // solo un email por cuenta 
        lowercase: true     // todo en minusculas
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    registro: {
        type: Date,
        default: Date.now()     // fecha exacta en el momento del registro
    }
});


module.exports = mongoose.model( 'Usuario', UsuariosSchema );
