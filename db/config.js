





const {config} = require('./../config/config');
// traemos el archivo de sequelize 

   const USER = encodeURIComponent(config.dbUser);
   const PASSWORD =encodeURIComponent(config.dbPassword);
    const URI=`postgres://${USER}:${PASSWORD}@${config.dbHost}:${config.dbPort}/${config.dbName}`
   
//traemos los parametros de sequelize



//configuramos la URL Y EL TIPO DE DB
//configuracion por defectof
//CON ESTA CONFIGURAION PODEMOA EMPEZAR ACREAR MEGRACIONES
  module.exports= {
    
    development: {
        url:URI,
         dialect:{
          dialect: 'postgres',
        
         }
                           
    },
    production:{
        url:URI,
        dialect:{

          dialect: 'postgres'
        }            
    }
  }

  // con esta configuracion ya podemos gestionar y correr migraciones

  // el comando para correlas migraciones es : npm run migrations:run
  // b con las migraciones poddemos hacer cambios en las tablas paro saing no se puede