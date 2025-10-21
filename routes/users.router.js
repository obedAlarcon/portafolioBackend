

// (SINGLE RESPONSIBILITY PRINCIPLE)
// Principio de una sola resposibilidad 


const express = require ('express')

// traemos loa servicios del archivo user.service,js
const UserService = require('../services/user.service') // esta es la clese de user.service llamada UserService

// traemos el schema del user con sus valores 
const {getUserSchema, updateUserSchema,createUserSchema}= require('../schemas/user.schema');
const validatorHandler = require('../middlewares/validatorHandler');



// creamos el router 

const router=express.Router();


// taremos el servicio 
const service = new UserService()

// gestion de las rutas 

router.get('/',async(req, res, next)=>{
    // esta es nuestra ruta por defecto y trae todo los elementos de las rutas 
    // 
    try {
        const users =await service.find()
        res.json(users)
        
    } catch (error) {
        next(error)
    }
})

router.get('/:id',async (req,res,next)=>{
    try {
        const {id}=req.params
        const users =await service.findOne(id)
        res.json(users)
    } catch (error) {
        next(error)
    }
})


router.post('/', async (req,res,next)=>{
    validatorHandler(createUserSchema,'body')
    try {
        const body = req.body
        const newUser = await service.create(body)
        res.status(201).json(newUser)
        
    } catch (error) {
        next (error)
        
    }
})

router.patch('/:id',
    
    validatorHandler(getUserSchema,'params'),
    validatorHandler(updateUserSchema,'body'),

    async(req,res,next)=>{
      
    try {
        const {id}=req.params;
        const body=req.body;
        const users= await service.update(id,body)
        res.json(users)
    } catch (error) {
        next(error)
    }
})

router.delete('/:id',
    
    async(req,res,next)=>{
    try {
        const {id}=req.params
        await service.delete(id)
        res.status(201).json({id})
    } catch (error) {
        next(error)
    }
})
module.exports=router