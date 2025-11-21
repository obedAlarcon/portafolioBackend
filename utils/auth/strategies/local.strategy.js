const express = require('express')
const {Strategy} = require('passport-local');
const AuthService = require('./../../../services/auth.service')
const service = new AuthService();

const LocalStrategy = new Strategy({
  usernameField: 'email',
  passwordField: 'password' // ✅ Asegúrate de incluir esto
}, async (email, password, done) => {
  try {
    const user = await service.getUser(email, password);
    
    if (!user) {
      // ✅ Usuario no encontrado o credenciales inválidas
      return done(null, false, { message: 'Invalid email or password' });
    }
    
    // ✅ Autenticación exitosa
    return done(null, user);
  } catch (error) {
    // ✅ Error del servidor
    return done(error, false);
  }
});

module.exports = LocalStrategy;