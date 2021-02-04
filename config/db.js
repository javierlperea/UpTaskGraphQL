// ACA TENGO TODA LA CONFIGURACION DE LA BASE DE DATOS
// mongoose permite trabajar con la diferentes acciones que se pueden realizar en una base de datos,
// como crear registros, ejecutarlos, eliminarlos, buscarlos
// para instalarlo ``npm i mongoose`` y ademas usar la libreria ``npm i dotenv`` para crear las variables de entorno

const mongoose = require('mongoose');
// importacion de variables.env con el metodo config y dentro las opciones --> el path de ubicacion
require('dotenv').config({ path: 'variables.env' });

// funcion para conectar a la DB
const conectarDB = async () => {
    try {
        // conectarse a la DB, de esta forma puede leer los datos del archivo variables.env y paso opciones
        await mongoose.connect(process.env.DB_MONGO, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true
        });
        
        // Conexion correcta, ejecuta lo siguiente
        console.log('DB conectada');

    } catch (err) {
        console.log('Hubo un error');
        console.log(err);
        process.exit(1);   // Detiene la app
    }
}

module.exports = conectarDB;