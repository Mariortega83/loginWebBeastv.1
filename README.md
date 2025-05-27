# Login Web con React, Vite, Material UI y cookies

He hecho la interfaz de la web ya implemetando el Login, el user manda las creddenciales, el servidor verifica y manda la respuesta. Almacenamos el token en una cookie que usamos para mantener la sesión abierta, aunque hay que decodificar el token para poder verificar si esta marcado como vencido o cumplido, la cosa es que si lo esta hay que establecer el estado de auth a falso y retirar el token de los headers. Falta conexion a BD y verificacion de token/cookie.

js-cookie
jwt-decode
material ui
material ui icons 
axios para peticiones