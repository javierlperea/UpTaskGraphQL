/* Modelo que van a tener los proyectos en la DB
**  creador: { 
        type: mongoose.Schema.Types.ObjectId,   --> toma unicamente los valores que estan dentro del ObjectI(MongoDBCompass)
        ref: 'Usuario'                          --> para saber en que Usuario buscar
    }  

*/

const mongoose = require('mongoose');

const ProyectoSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    creador: {  
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario'
    },
    creado: {
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model( 'Proyecto', ProyectoSchema );