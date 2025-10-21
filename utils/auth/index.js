const passport = require('passport');
// aqui empezamos a definir que estrategiaas vamos a utilizar

const LocalStrategy=require('./strategies/local.strategy')
const JwtStrategy=require('./strategies/jwt.strategy')


passport.use(LocalStrategy);
passport.use(JwtStrategy);

module.exports = passport;