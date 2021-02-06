// apollo-server permite crear servidores de GraphQL
// Nodemon reinicia constantemente el servidor cuando se realizan cambios
// GraphQL devuelve unicamente lo que se pide (no un endpoint completo como REST)
// dotenv permite crear las variables de entorno
// mongoDB compass para visualizar los datos

const { ApolloServer } = require('apollo-server');
// Dependencias
const typeDefs = require('./db/schema');
const resolvers = require('./db/resolvers');
// para leer el token
const jwt = require('jsonwebtoken');
// para verificar el token 
require('dotenv').config('variables.env')

// importacion de la funcion para conectar a DB
const conectarDB = require('./config/db');


// llamado a  la funcion conectarDB
conectarDB();

// Creo una nueva instancia de apollo server, toma dos parametros typedefinitiosn y resolvers, por ultimo el context
// el context es una funcion presente en todos los resolvers
const server = new ApolloServer({
    typeDefs, 
    resolvers,
    context: ({ req }) => {
        // si hay un usuario autenticado el token tiene la authorization, sino es un string vacio
        const token = req.headers['authorization'] || '';

        // si hay token ejecuta lo siguiente
        if( token ) {
            try {
                // Verifico el token (para leer el token necesito jwt)
                const usuario = jwt.verify( token, process.env.SECRETA );

                // retorna el token y lo recibo en el resolver
                return {
                    usuario
                } 

            } catch (error) {
                console.log(error)
            }
        }
    }
});

server.listen().then( ({url}) => {
    console.log(`servidor listo en la URL ${url}`)
})