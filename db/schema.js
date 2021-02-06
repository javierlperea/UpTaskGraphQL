/*** Aca se definen los typedefinitios, de esta forma se da estructura a los datos que va a mostrar el cliente
** Los typedefinitios son estrucutras de datos en los que se define su tipo (String)
El unico que es obligatorio es type Query y va a contener las funciones que tambien deben estar en los resolvers
Los querys son las funciones que se encargan de consultar la DB
** type Curso { titulo: String }     <-- Pide el titulo de tipo string que se encuentra en los cursos
** type Query { obtenerCursos: [Curso] }    <-- retorna muchos cursos gracias a la sintaxis de array, si lo quisiera un curso
necesitaria usar un filter en la funcion de los resolvers -->        obtenerCursos: () => cursos
** Cuando defino dentro Query --> obtenerCursos: [Curso] ó obtenerTecnologia: [Tecnologia] 
debo definir arriba type Curso{} y type Tecnologia{} especificando el tipo de dato que debe retornar
** type Mutation { crearUsuario: String} tiene una funcion que devuelve un mensaje de texto(String)
** DEFINIR UN INPUT en GraphQL sirve para simular la entrada de los datos( es la forma de pasar argumentos o parametros hacia los resolvers)
input UsuarioInput { nombre email password }  va a tener la entrada de datos para la creacion de usuario, para que los datos sean 
obligatorios se agrega un "!" al final de la linea -->  input UsuarioInput { nombre: String!  email: String!  password: String! }
** RECIBIR LOS DATOS DEL INPUT EN LA FUNCION MUTATION -->  crearUsuario(input: UsuarioInput) : String   <--  va a retornar un String
*** EJECUTARLO EN GRAPHICAL (npm run dev --> localhost) 
mutation {
  crearUsuario(input: {
    nombre: "Javier"
    email: "javier@gmail.com"
    password: "123456"
  })
} 
*** La funcion autenticarUsuario(input: AutenticarInput) : String debe tener un input diferente al del registro porque solo utiliza email y password
*** Con JWT autenticarUsuario ahora retorna un Token, por lo que debo definirlo --> type Token {}
*** nuevoProyecto(input: ProyectoInput) : Proyecto  --> Debe retornar un proyecto completo(nombre y ID)
*** Para la entrada --> input ProyectoInput { nombre: String! } solo requiere el nombre el id lo asigna Mongo
*** type Proyecto { nombre: String id: ID }--> Define la forma en la que vienen los datos       
*** Para actualizar un proyecto actualizarProyecto(id: ID!, input: ProyectoInput) : Proyecto --> el id para saber que proyecto actualizar, es obligatorio
*/

const { gql } = require('apollo-server');


const typeDefs = gql`

    type Token {
        token: String
    }

    type Proyecto {
        nombre: String
        id: ID
    }

    type Tarea {
        nombre: String
        id: ID
        proyecto: String
        estado: Boolean
    }

    type Query {
        # Obtener todos los proyectos
        obtenerProyectos: [Proyecto]

        # Obtener todas las tareas que pertenecen a un proyecto especifico (filtrando por id de proyecto)
        obtenerTareas(input: ProyectoIDInput) : [Tarea]
    }

    input ProyectoIDInput {
        proyecto: String!
    }

    input UsuarioInput {
        nombre: String!
        email: String!
        password: String!
    }

    input AutenticarInput {
        email: String!
        password: String!
    }

    input ProyectoInput {
        nombre: String!
    }

    input TareaInput {
        nombre: String!
        proyecto: String!
    }

    type Mutation {

        # Proyectos
        crearUsuario(input: UsuarioInput) : String
        autenticarUsuario(input: AutenticarInput) : Token
        nuevoProyecto(input: ProyectoInput) : Proyecto
        actualizarProyecto(id: ID!, input: ProyectoInput) : Proyecto
        eliminarProyecto(id: ID!) : String

        # Tareas
        nuevaTarea(input: TareaInput) : Tarea
        actualizarTarea(id: ID!, input: TareaInput, estado: Boolean) : Tarea
        eliminarTarea(id: ID!) : String
    }

`;

module.exports = typeDefs;