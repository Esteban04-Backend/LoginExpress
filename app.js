const express = require('express');
const mysql = require('mysql2/promise');
const path = require('path');

const app = express();
const port = 3000;

app.use(express.static('public'));
app.use(express.json());

app.use(express.urlencoded({
    extended: true
}));

const connection = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'logintest',
});

async function verificarConexion() {

    try {

        const conexion =
            await connection.getConnection();

        console.log(
            '✓ Conectado a MySQL'
        );

        conexion.release();

    } catch(error){

        console.error(error);

    }

}

verificarConexion();

app.get('/', (req, res) => {

    res.sendFile(
        path.join(
            __dirname,
            'public',
            'index.html'
        )
    );

});

app.post('/login', async (req, res) => {

    const {
        usuario,
        clave
    } = req.body;

    try {

        const [results] =
            await connection.query(

            `SELECT * FROM usuarios
             WHERE usuario = ?
             AND clave = ?`,

            [usuario,
             clave]

        );

        if(results.length > 0){

            res.status(200).send(
                'Inicio de Sesión Correcto'
            );

        }else{

            res.status(401).send(
                'Datos Incorrectos'
            );

        }

    } catch(error){

        console.error(error);

        res.status(500).send(
            'Error interno del servidor'
        );

    }

});

app.post('/register', async (req, res) => {

    const {
        usuario,
        clave
    } = req.body;

    try {

        const [usuarioExiste] =
            await connection.query(

                `SELECT *
                 FROM usuarios
                 WHERE usuario = ?`,

                [usuario]
            );

        if(usuarioExiste.length > 0){

            return res
            .status(409)
            .send(
                'El usuario ya existe'
            );

        }

        await connection.query(

            `INSERT INTO usuarios
             (usuario, clave)
             VALUES (?, ?)`,

            [
                usuario,
                clave
            ]
        );

        res
        .status(201)
        .send(
            'Usuario registrado correctamente'
        );

    } catch(error){

        console.error(error);

        res
        .status(500)
        .send(
            'Error interno del servidor'
        );
    }

});

app.listen(port, () => {

    console.log(
        `Servidor corriendo en:
        http://localhost:${port}`
    );

});