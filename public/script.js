const formulario =
document.getElementById(
    "loginForm"
);

formulario.addEventListener(
    "submit",

    async (e) => {

        e.preventDefault();

        const usuario =
        document.getElementById(
            "usuario"
        ).value;

        const clave =
        document.getElementById(
            "clave"
        ).value;

        try {

            const respuesta =
            await fetch(
                '/login',

                {
                    method: 'POST',

                    headers: {
                        'Content-Type':
                        'application/json'
                    },

                    body:
                    JSON.stringify({

                        usuario,
                        clave

                    })
                }
            );

            const mensaje =
            await respuesta.text();

            const contenedor =
            document.getElementById(
                "mensaje"
            );

            contenedor.innerHTML =
            mensaje;

            if(
                respuesta.ok
            ){

                contenedor.style.color =
                "green";

            }else{

                contenedor.style.color =
                "red";
            }

        } catch(error){

            document.getElementById(
                "mensaje"
            ).innerHTML =
            "Error de conexión";
        }
});