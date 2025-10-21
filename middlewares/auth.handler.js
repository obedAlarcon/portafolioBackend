
const boom = require('@hapi/boom')
const {config}=require('./../config/config')

function checkApiKey(req,res,next){
    const apiKey =req.headers['api']
    if(apiKey === config.apiKey){// llega desde config   pero biene desde .env
       
        next()

    }else{
        next(boom.unauthorized());
    }
}

// esta fucntion es para dar permiso a los rolres propiamente al admin
//esta es una function por cada role
/*
function checkAdminRole (req,res,next){
    const user = req.user
    if(user.role === 'admin'){

        next()
    }else{
        next(boom.unauthorized())
    }

}
*/

// esta function es para crear u  array de roles s i en la app tenemos varios roles
// ejemplo: customer, seler, admin, especial 

// creamos la function cons los clushures o(GRUPOS), en este casio de roles
function checkRoles(...roles){

    return (req,res,next)=>{
        const user= req.user
        if(roles.includes(user.role)){
            next()
        }else{
            next(boom.unauthorized())
        }
    }

}

module.exports={checkApiKey,  checkRoles};