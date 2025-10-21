
const boom =require('@hapi/boom')
const {models}=require('./../libs/sequelize')

class ProyectService{

async create(data){
    const newProyect =await models.Proyect.create(data) 
    
    return newProyect;
}

async find(){
    const response = await models.Proyect.findAll()
    return response
}

async findOne(id){
    const proyect = await models.Proyect.findByPk(id)
    if(!proyect){
        throw boom.notFound('Proyect not found')
    }
    return proyect
}
async update(id,changes){
    const proyect = await this.findOne(id);
    const response = await proyect.update(changes);
    return response
}
async delete(id){
    const proyect = await this.findOne(id);
    await proyect.destroy();
    return {id};
}
}
module.exports=ProyectService;
