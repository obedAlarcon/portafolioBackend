

const {User, UserSchema} =require('./user.model');
const {Proyect, ProyectSchema}=require('./proyect.model')


function setupModels(sequelize){

    User.init(UserSchema,User.config(sequelize))
    Proyect.init(ProyectSchema,Proyect.config(sequelize))
    


    User.associate(sequelize.models)
}

module.exports=setupModels