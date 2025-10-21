


const { type } = require('os');
const {Model, Sequelize, DataTypes}=require('sequelize');


const USER_TABLE ='users';

const UserSchema={
   id:{
      allowNull:false,
      autoIncrement:true,
      primaryKey:true,
      type:DataTypes.INTEGER
   },

   email:{
       allowNull:false,
       type:DataTypes.STRING,
       unique:true
   },
   password:{
      allowNull:false,
      type:DataTypes.STRING

   },
  recoveryToken:{
   field:'recovery_token',
   allowNull:true,
   type:DataTypes.STRING
  },
   role:{
      allowNull:false,
      type:DataTypes.STRING,
      defaultValue:'admin'

   },
  
  createdAt:{
   allowNull:false,
   type:DataTypes.DATE,
   field:'created_at',
   defaultValue:Sequelize.NOW
  },
  // COMPORTAMIENTO EN CASCADA U ACTUALIAZ EL ID
  updatedAt: {
   allowNull: false,
   type: DataTypes.DATE,
   field: 'updated_at',
   defaultValue: Sequelize.NOW,
 }
     //PERO QUE PASA SI HAY ONDELETE
   
   // Desactiva la columna updatedAt // Asegúrate de que el nombre de la tabla sea correcto

}

class User extends Model{
   static associate(models){

   }

   static config (sequelize){
      return{
         sequelize,
         tableName:USER_TABLE,
         modelName:'User',
         timeStamps:false
      }
   }
}

module.exports={
   USER_TABLE,
   UserSchema,
   User
}