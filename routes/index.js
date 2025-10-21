const express = require('express');

// llamanos todos los archivos de las rutas
const usersRouter = require('./users.router')
const proyectRouter=require('./proyect.router')
const authRouter=require('./auth.router')
const contactRouter= require('./contact.router')

function routerApi(app){
   console.log('En routerApi. typeof app:', typeof app);
   console.log('Tiene app.use?', typeof app.use);
   
   const router = express.Router();

   app.use('/api/v1',router); // esta es la ruta maestra para un facil mantenimiento de los endpoint
   
      router.use('/users',usersRouter);
      router.use('/proyect',proyectRouter)
      router.use('/auth',authRouter)
      router.use('/contact', contactRouter)

}
module.exports= routerApi;