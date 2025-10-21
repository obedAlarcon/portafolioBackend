const {Strategy, ExtractJwt}=require('passport-jwt');
const {config}=require('../../../config/config');


const options={
    // de aqui se saca el token
    jwtFromRequest:ExtractJwt.fromAuthHeaderAsBearerToken(),
    // de aqui vemos si el secret es valido o no 
    secretOrKey:config.jwtSecret
}
const JwtStrategy = new Strategy(options, (payload, done)=>{// startegy sale de la libreria de passport
    return done(null, payload);
});
module.exports= JwtStrategy;

// EN LA ESTATEGI LE ENVIAMOS LAS PRIMEREAS OPCIONES
// PAYLOAD RESPONDE CON UNA FUNCIOON DONE EL PAYLOAD ES EL MISMO TOKEN

//