// Busca en el documento HTML el formulario que tenga el ID "registerForm" y lo guarda en una variable
const formulario =
document.getElementById(
    "registerForm"
);
// verifica el momento en que el usuario envía el formulario (hace click en registrar o presiona Enter)
formulario.addEventListener(
    "submit",

    async (e)=>{
// Evita que la página se recargue automáticamente, que es el comportamiento normal de los formularios
        e.preventDefault();
// Busca la caja de texto del usuario por su ID y guarda el texto que escribió el usuario (.value)
        const usuario =
        document.getElementById(
            "usuario"
        ).value;
// Busca la caja de texto de la contraseña por su ID y guarda el texto que escribió el usuario (.value)
        const clave =
        document.getElementById(
            "clave"
        ).value;

        try{
// Hace una petición de red asíncrona (fetch) hacia la ruta '/register' de tu servidor
            const respuesta =
            await fetch(

                '/register',

                {
// Define que se enviarán datos mediante el método POST
                    method:'POST',
// Le avisa al servidor que los datos que se le envían van en formato JSON
                    headers:{

                        'Content-Type':
                        'application/json'

                    },
// Convierte el usuario y la clave en un texto plano con formato JSON para que el servidor lo entienda
                    body:
                    JSON.stringify({

                        usuario,
                        clave

                    })

                }
            );
// Espera a que el servidor responda y extrae el texto del mensaje recibido (ej: "Usuario registrado correctamente")
            const mensaje =
            await respuesta.text();
// Busca el elemento HTML con el ID 'mensaje' donde se mostrará la respuesta al usuario
            const contenedor =
            document.getElementById(
                'mensaje'
            );
// Inserta el texto recibido del servidor dentro de ese elemento HTML
            contenedor.innerHTML =
            mensaje;
// Comprueba si la respuesta del servidor fue exitosa (códigos HTTP entre 200 y 299)
            if(respuesta.ok){
// Si todo salió bien, pinta el texto del mensaje de color verde
                contenedor.style.color =
                'green';

            }else{
// Si hubo un error (como usuario duplicado), pinta el texto de color rojo
                contenedor.style.color =
                'red';
            }

        }catch(error){
// Si no hay conexión a internet o el servidor está apagado, entra a este bloque de error
            document.getElementById(
                'mensaje'
            ).innerHTML =
            'Error del servidor';

        }

});