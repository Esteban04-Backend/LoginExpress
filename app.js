// Importa Express para crear el servidor web
const express = require('express');
// Importa MySQL2 con soporte de promesas para usar async/await con la base de datos
const mysql = require('mysql2/promise');
// Importa Path para manejar y asegurar las rutas de archivos en el sistema
const path = require('path');
// Inicializa la aplicación de Express
const app = express();
// Define el puerto 3000 donde se ejecutará el servidor
const port = 3000;
// Sirve de forma automática archivos estáticos (HTML, CSS, JS) desde la carpeta 'public'
app.use(express.static('public'));
// Permite al servidor entender y procesar datos que lleguen en formato JSON
app.use(express.json());
// Permite al servidor entender datos enviados desde formularios HTML tradicionales
app.use(express.urlencoded({
    extended: true
}));
// Crea un grupo de conexiones (Pool) a MySQL con las credenciales del servidor local
const connection = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'logintest',
});
// Función asíncrona para comprobar que la base de datos funciona bien
async function verificarConexion() {

    try {
// Intenta pedir una conexión al pool
        const conexion =
            await connection.getConnection();

        console.log(
            '✓ Conectado a MySQL'
        );
// Libera la conexión para que otros procesos puedan usarla
        conexion.release();

    } catch(error){
// Muestra el error en consola si la conexión falla
        console.error(error);

    }

}
// Ejecuta la función de verificación al iniciar el script
verificarConexion();
// Genera las peticiones GET en la raíz del sitio '/'
app.get('/', (req, res) => {
// Envía el archivo 'index.html' ubicado dentro de la carpeta 'public' al navegador del usuario
    res.sendFile(
        path.join(
            __dirname,
            'public',
            'index.html'
        )
    );

});
// Escucha peticiones POST en '/login' para validar usuarios
app.post('/login', async (req, res) => {
 // Extrae el usuario y la clave enviados por el cliente
    const {
        usuario,
        clave
    } = req.body;

    try {
// Busca en la base de datos si existe un usuario con ese nombre y contraseña exactos
        const [results] =
            await connection.query(

            `SELECT * FROM usuarios
             WHERE usuario = ?
             AND clave = ?`,

            [usuario,
             clave]

        );
// Si encontró al menos un registro, las credenciales son válidas
        if(results.length > 0){

            res.status(200).send(
                'Inicio de Sesión Correcto'
            );

        }else{
// Si no hay coincidencias, devuelve un error 401 (No autorizado)
            res.status(401).send(
                'Datos Incorrectos'
            );

        }

    } catch(error){
// Maneja cualquier falla del código o de la base de datos enviando un error 500
        console.error(error);

        res.status(500).send(
            'Error interno del servidor'
        );

    }

});
// Escucha peticiones POST en '/register' para crear cuentas nuevas
app.post('/register', async (req, res) => {
// Extrae los datos del nuevo usuario
    const {
        usuario,
        clave
    } = req.body;

    try {
// Verifica primero si el nombre de usuario ya está tomado
        const [usuarioExiste] =
            await connection.query(

                `SELECT *
                 FROM usuarios
                 WHERE usuario = ?`,

                [usuario]
            );
// Si el usuario ya existe, detiene el proceso y avisa con un código 409 (Conflicto)
        if(usuarioExiste.length > 0){

            return res
            .status(409)
            .send(
                'El usuario ya existe'
            );

        }
// Si el nombre está libre, inserta el nuevo usuario y contraseña en la base de datos
        await connection.query(

            `INSERT INTO usuarios
             (usuario, clave)
             VALUES (?, ?)`,

            [
                usuario,
                clave
            ]
        );
// Responde con un código 201 (Creado con éxito)
        res
        .status(201)
        .send(
            'Usuario registrado correctamente'
        );

    } catch(error){
// Maneja fallas internas del proceso de registro
        console.error(error);

        res
        .status(500)
        .send(
            'Error interno del servidor'
        );
    }

});
// Activa el servidor para que empiece a escuchar las visitas en el puerto definido
app.listen(port, () => {

    console.log(
        `Servidor corriendo en:
        http://localhost:${port}`
    );

});