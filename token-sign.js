const jwt= require('jsonwebtoken');
const secret = 'myProyect'

const payload={
    // este es el usuario
    sub:1,
    // cual es su scope o role
    role:'admin'

}

function signToken(payload, secret){
    //con esta funcion le decimos que queremos crear o generar un token
    return jwt.sign(payload, secret); //y firmamos el token y le mandanos el payload y el crecret

}

const token = signToken(payload, secret)
console.log(token)