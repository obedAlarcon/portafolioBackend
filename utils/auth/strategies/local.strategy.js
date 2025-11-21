const express = require('express')
const {Strategy}=require('passport-local');

const AuthService=require('./../../../services/auth.service')
const service = new AuthService();




const LocalStrategy = new Strategy({
 usernameField:'email',
 

},async (email,password,done)=>{

try {
    // le decimos que nos busque por email 
  const user= await  service.getUser(email,password)
 
  done(null,user)
} catch (error) {
    // si algo sale masl ejecutamos el done y mandamos el error y le decimos que no fue pocible 
    done(error, false)
    
}

});





module.exports = LocalStrategy