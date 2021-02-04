// apollo-server permite crear servidores de GraphQL
// Nodemon reinicia constantemente el servidor cuando se realizan cambios
// GraphQL devuelve unicamente lo que se pide (no un endpoint completo como REST)
// dotenv permite crear las variables de entorno
// mongoDB compass para visualizar los datos

const { ApolloServer } = require('apollo-server');

const typeDefs = require('./db/schema');
const resolvers = require('./db/resolvers');

// importacion de la funcion para conectar a DB
const conectarDB = require('./config/db');


// llamado a  la funcion conectarDB
conectarDB();

// Creo una nueva instancia de apollo server, toma dos parametros typedefinitiosn y resolvers
const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then( ({url}) => {
    console.log(`servidor listo en la URL ${url}`)
})