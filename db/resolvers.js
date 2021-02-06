// ** Los resolvers son funciones responsables de retornar los valores de mi schema(typeDefs)
// lo que tenga dentro de los typeDefs tengo que tenerlo dentro de los resolvers
/*** Para leer los datos del input dentro de Mutation:
 la funcion crearUsuario recibe 4 parametros: 
    root( _ )  -->  se nombra como root o "_" es el resultado del type anterior o type padre(usualmente no se lo usa)
    {input}    -->  permite leer los datos ingresados
    ctx        -->  el context es un objeto que se comparte en todos los resolvers, sirve para revisar que usuario esta autenticado --> GraphQLExtensionStack
    info       -->  informacion relevante al query actual(no se usa)
** cuando ejecute graphical voy a poder ver los datos en la consola
*/
// ** Hashear passwords instalo la dependecia --> ``npm i bcryptjs``
// ** Crear un json web token ``npm i jsonwebtoken`` 
// JWT contienen una firma, una fecha de expiracion y permiten almacenar informacion, forma segura para asegurarnos que iniciaron sesion en nuestro sitio web
/*** La funcion autenticarUsuario deber retornar un token y recibe 3 parametros, defino tambien esa funcion
 --> parametros que recibe: usuario(nombre, email, password), palabra secreta(en variables.env), tiempo expiracion del token

    return {
        token: () => crearToken(existeUsuario, process.env.SECRETA, '2hr')
    }
** Para firmar el JWT se pasan como payload -> id y el email, 
                         la palabra secreta -> secreta, 
                              y como objeto -> expiresIn
** Las consultas se realizan en el Query mientras que Crear, Editar y Eliminar en los mutations!
*/ 


// Importacion de los modelos
const Usuario = require('../models/Usuario');
const Proyecto = require('../models/Proyecto');
// Dependecias
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: 'variables.env' });    // la ruta siempre se especifica desde la raiz

// Crea y firma un JWT
const crearToken = ( usuario, secreta, expiresIn ) => {
    console.log(usuario)
    // extraigo id, email de usuario y se van a pasar como payload
    const { id, email } = usuario;

    // utilizando el metodo sign firmo el jwt y le paso id, email como payload, palabra secreta, y como objeto expiresIn
    return jwt.sign( { id, email }, secreta, { expiresIn } );
}


const resolvers = {
    Query: {

        // Consultar proyectos: root(no se requiere), input sin entradas(obtiene todos los proyectos), ctx tre solo proyectos del usuario autenticado 
        obtenerProyectos: async ( _, {}, ctx ) => {
            // requiere como parametro el usuario creador
            const proyectos = await Proyecto.find({ creador: ctx.usuario.id })

            // retornar todos los proyectos
            return proyectos;
        }

    },

    Mutation: {
        crearUsuario: async ( _, {input} ) => {
            const { email, password } = input;

            // comprobar que el usuario no este registrado, traigo datos de '../models/Usuario' y busca si existe un email que coincida en la DB
            const existeUsuario = await Usuario.findOne({ email });

            // Si el usuario existe muestra un error
            if(existeUsuario) {
                throw new Error('El usuario ya esta registrado');
            }

            // Almacenar en la DB
            try {

                // Hashear password, genSalt genera una nueva cadena dificil de hackear, y luego realizo el hasheo
                const salt = await bcryptjs.genSalt(10);
                input.password = await bcryptjs.hash(password, salt);

                // Registrar nuevo Usuario --> creo una nueva instancia(objeto) de Usuario, se ejecuta el modelo de UsuarioSchema y se completan todos los campos
                // Usuario debe recibir el input porque ahi vienen nombre, email y password, por defecto agrega _id
                const nuevoUsuario = new Usuario(input);
                // console.log(nuevoUsuario);

                // guardo el nuevoUsuario en la DB
                nuevoUsuario.save();
                
                // si ocurriera un error .save() lo atraparia el catch por lo tanto la siguiente linea es segura
                // en schema la funcion crearUsuario recibe un input y luego retorna un String que defino aqui abajo
                return "Usuario creado correctamente";

            } catch (error) {
                console.log(error);
            }
        },
        // Funcion para autenticacion, tambien debe estar en el schema
        autenticarUsuario: async ( _, {input} ) => {
            const { email, password } = input;

            const existeUsuario = await Usuario.findOne({ email });

            // Revisar si el usuario existe, caso contrario mostrar un error
            if( !existeUsuario ) {
                throw new Error('El usuario no existe');
            }

            // Revisar si password es correcto, gracias a compare revisa que el password ingresado en el input,
            // sea igual al que contiene el usuario que ya fue registrado y esta hasheado, en graphical me da true o false a passwordCorrecto
            const passwordCorrecto = await bcryptjs.compare( password, existeUsuario.password );
            if( !passwordCorrecto ) {
                throw new Error('Password incorrecto');
            }

            // Dar acceso a la app, si la comprobacion es correcta se firma el token!
            return {
                token: () => crearToken(existeUsuario, process.env.SECRETA, '2hr')
            }

        },
        nuevoProyecto: async ( _, {input}, ctx ) => {
            console.log('desde resolver', ctx)

            try {
                
                // creo una nueva instancia de Proyecto, recibe el input como argumento
                const proyecto = new Proyecto(input)

                // Asociar el creador al proyecto, usuario viene en el context
                // desde '../index.js' en --> const server = new ApolloServer({ typeDefs, resolvers, context: () => {}
                proyecto.creador = ctx.usuario.id;

                // Almanceno en DB
                const resultado = await proyecto.save();
                
                // debe retornar un Proyecto, el resultado(nuevo proyecto) fue almacenado en la DB por eso lo retorno
                // el resultado puede tener mucha informacion pero gracias al type Proyecto de schema, solo consulta nombre y id
                return resultado;

            } catch (err) {
                console.log(err)
            }
        },
        actualizarProyecto: async ( _, {id, input}, ctx ) => {

            // Revisar si el proyecto existe
            let proyecto = await Proyecto.findById(id)

            // si el proyecto no exite muestra un error
            if( !proyecto ) {
                throw new Error('Proyecto no encontrado');
            }

            // Revisar que la persona que intenta editarlo sea el creador, proyecto.creador viene como Object --> console.log(typeof proyecto.creador);
            // tengo que convertirlo en String, si es diferente al id que viene en ctx.usuario.id muestro un error
            if( proyecto.creador.toString() !== ctx.usuario.id ) {
                throw new Error('No tienes las credenciales para editar');
            }

            // Guardar el proyecto, para encontrarlo necesita el id, el input con el nuevo nombre, y como opciones new true para retornar el nuevo resultado
            proyecto = await Proyecto.findOneAndUpdate( { _id:id }, input, { new: true } )

            // Retorna el proyecto(con nombre y id) como se especifica en el schema
            return proyecto; 
        },
        eliminarProyecto: async ( _, { id }, ctx ) => {
            
            // Revisar si el proyecto existe, solo se requiere el id
            let proyecto = await Proyecto.findById(id)

            // si el proyecto no exite muestra un error
            if( !proyecto ) {
                throw new Error('Proyecto no encontrado');
            }

            // Revisar que la persona que intenta editarlo sea el creador, proyecto.creador viene como Object --> console.log(typeof proyecto.creador);
            // tengo que convertirlo en String, si es diferente al id que viene en ctx.usuario.id muestro un error
            if( proyecto.creador.toString() !== ctx.usuario.id ) {
                throw new Error('No tienes las credenciales para eliminar');
            }

            // Eliminar, tambien se puede usar --> .findByIdAndRemove()
            await Proyecto.findByIdAndDelete( {_id: id} );

            // Retorna un String como se especifica en el schema
            return "Proyecto eliminado";
        }
    }
}

module.exports = resolvers;