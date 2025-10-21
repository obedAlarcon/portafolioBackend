const { Sequelize } = require('sequelize');
const { config } = require('./../config/config');
const setupModels = require('./../db/models');

const isProduction = config.env === 'production';

let sequelize;

if (isProduction) {
  //  PRODUCCIÓN (Render)
  console.log('🔌 Conectando a base de datos en Render...');
  sequelize = new Sequelize(config.databaseUrl, {
    dialect: 'postgres',
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  });
} else {
  // 💻 LOCAL
  console.log('💻 Conectando a base de datos local...');
  const USER = encodeURIComponent(config.dbUser);
  const PASSWORD = encodeURIComponent(config.dbPassword);
  const URI = `postgres://${USER}:${PASSWORD}@${config.dbHost}:${config.dbPort}/${config.dbName}`;
  
  sequelize = new Sequelize(URI, {
    dialect: 'postgres',
    logging: false,
  });
}

setupModels(sequelize);
sequelize.authenticate()
  .then(() => console.log('🟢 Conexión a la base de datos exitosa'))
  .catch(err => console.error('❌ Error al conectar con la base de datos:', err));
module.exports = sequelize;
