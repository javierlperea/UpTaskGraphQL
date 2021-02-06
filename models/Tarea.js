/* Modelo que van a tener los tareaas en la DB
** Creador permite indentificar que usuario creo el proyecto
    creador: { 
        type: mongoose.Schema.Types.ObjectId,   --> toma unicamente los valores que estan dentro del ObjectI(MongoDBCompass)
        ref: 'Usuario'                          --> para saber en que Usuario buscar
    }  

** Proyecto permite identifica a que proyecto van a pertenecer las tareas
    proyecto: {
        type :mongoose.Schema.Types.ObjectId,   --> toma unicamente los valores que estan dentro del ObjectI(MongoDBCompass)
        ref: 'Proyecto'                         --> para saber en que Proyecto buscar
    }

** Estado permite saber si una tarea ha sido completada o esta incompleta
    estado: {
        type: Boolean,
        default: false
    }
*/

const mongoose = require('mongoose');

const TareaSchema = mongoose.Schema({
    nombre:{
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
    },
    proyecto: {
        type :mongoose.Schema.Types.ObjectId,
        ref: 'Proyecto'
    },
    estado: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model( 'Tarea', TareaSchema );