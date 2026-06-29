// Localiza en el documento HTML el formulario con el ID "loginForm" y lo guarda en una variable
const formulario =
document.getElementById(
    "loginForm"
);
// Detecta el momento en que el usuario envía el formulario (al hacer clic en ingresar o pulsar Enter)
formulario.addEventListener(
    "submit",

    async (e) => {
// Cancela la recarga automática de la página, reteniendo el control con JavaScript
        e.preventDefault();
// Accede al campo de texto del usuario por su ID y extrae el texto escrito (.value)
        const usuario =
        document.getElementById(
            "usuario"
        ).value;
// Accede al campo de texto de la contraseña por su ID y extrae el texto escrito (.value)
        const clave =
        document.getElementById(
            "clave"
        ).value;

        try {
// Realiza una solicitud de red asíncrona hacia la ruta '/login' de la aplicación
            const respuesta =
            await fetch(
                '/login',
// Especifica que se enviará la información a través del método POST
                {
                    method: 'POST',
// Informa al servidor que el contenido del mensaje viaja en formato JSON
                    headers: {
                        'Content-Type':
                        'application/json'
                    },
// Transforma el usuario y la clave en un texto plano con estructura JSON para el servidor
                    body:
                    JSON.stringify({

                        usuario,
                        clave

                    })
                }
            );
// Aguarda la respuesta y extrae el mensaje de texto devuelto (ej: "Inicio de Sesión Correcto")
            const mensaje =
            await respuesta.text();
// Localiza el elemento HTML con el ID "mensaje" reservado para las notificaciones
            const contenedor =
            document.getElementById(
                "mensaje"
            );
// Coloca el texto recibido del servidor dentro de ese elemento visual
            contenedor.innerHTML =
            mensaje;
// Evalúa si el servidor respondió de manera exitosa (código de estado correcto)
            if(
                respuesta.ok
            ){
// Si el acceso es concedido, cambia el color del texto a verde
                contenedor.style.color =
                "green";

            }else{
// Si las credenciales fallan, cambia el color del texto a rojo
                contenedor.style.color =
                "red";
            }

        } catch(error){
// Entra en este bloque si hay un fallo en la red o si el servidor está apagado
            document.getElementById(
                "mensaje"
            ).innerHTML =
            "Error de conexión";
        }
});