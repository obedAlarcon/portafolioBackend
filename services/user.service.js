const boom = require('@hapi/boom');
const bcrypt=require('bcrypt');//taremos la password encriptada
const {models}=require('./../libs/sequelize')
// este servicio es como el controlador en atras apps
class UserService{
    // creamos el usuario 
    // equivalente al metodo (POST)

    async create(data){
        const hash = await bcrypt.hash(data.password,10);// password biene de data.password
        const newUser = await models.User.create({
            ...data, //clonamos todo el objeto 
            password:hash // el passwor cambia por el (HASH)
        });
        delete newUser.dataValues.password; // aqui se quita la password del para que no se vea 
        // esta password no la puede ver nadia ni el admin de la db, esta va directamente a la DB 
        // SE CREA DIRECTAMENTE EL LA DB HASHCHEADA
        return newUser;
    }



    async find(){ // encontrar los usuarios 
         const response = await models.User.findAll({ // encontrar todos los uasurios 
       
        })

        return response;
    }

    async findByEmail(email){ //encontramos por email
        const response = await models.User.findOne({ // encontramos a uno por (ID)
            // traemos el usuario y el emeil pero solo uno y unico
            where:{  
                email
            }
            
        })
        
        return response
    }

   async findOne(id){ // encontramos a uno por (ID)
    const user = await models.User.findByPk(id) // encontramos por llave primaria (PRIMAYKEY)
    if(!user){
        throw boom.notFound('user not found')
    }
    delete user.dataValues.password; // aqui se quita la password del para que no se vea 
    // esta password no la puede ver nadia ni el admin de la db, esta va directamente a la DB 
    // SE CREA DIRECTAMENTE EL LA DB HASHCHEADA
  
    return user;
   }
  // estas cambio se realiza por cada uno y por el (  ID)
    async update(id,changes){
        const user= await this.findOne(id)
        const response = await user.update(changes)
        return response;

    }
  // ESTA SE EÑLIMINA POR EL (iD DE CADA UNO )
     async delete(id){
        const user= await this.findOne(id)
        await user.destroy()
        return {id}
     }
    }

    module.exports=UserService;

