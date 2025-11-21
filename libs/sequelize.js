const { Sequelize } = require('sequelize');
const { config } = require('./../config/config');
const setupModels = require('./../db/models');

console.log('🔍 Debug - Entorno:', config.env);
console.log('🔍 Debug - DATABASE_URL presente:', !!config.databaseUrl);

const isProduction = config.env === 'production';

let sequelize;

if (isProduction) {
  console.log('🔌 Conectando a base de datos en Render...');
  
  if (!config.databaseUrl) {
    console.error('❌ DATABASE_URL es undefined en producción');
    console.error('Variables de entorno disponibles:');
    console.error('- NODE_ENV:', process.env.NODE_ENV);
    console.error('- DATABASE_URL:', process.env.DATABASE_URL ? 'PRESENTE' : 'AUSENTE');
    throw new Error('DATABASE_URL no está definida en producción');
  }
  
  sequelize = new Sequelize(config.databaseUrl, {
    dialect: 'postgres',
    logging: true,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  });
} else {
  console.log('💻 Conectando a base de datos local...');
  const USER = encodeURIComponent(config.dbUser);
  const PASSWORD = encodeURIComponent(config.dbPassword);
  const URI = `postgres://${USER}:${PASSWORD}@${config.dbHost}:${config.dbPort}/${config.dbName}`;
  
  sequelize = new Sequelize(URI, {
    dialect: 'postgres',
    logging: true,
  });
}

// ✅ CONFIGURAR MODELOS
setupModels(sequelize);

// ✅ AUTENTICACIÓN Y SINCRONIZACIÓN
sequelize.authenticate()
  .then(() => {
    console.log('🟢 Conexión a la base de datos exitosa');
    
    // ✅ SINCRONIZAR TABLAS
    return sequelize.sync({ alter: true });
  })
  .then(() => {
    console.log('✅ Tablas sincronizadas correctamente');
  })
  .catch(err => {
    console.error('❌ Error al conectar con la base de datos:', err);
    process.exit(1);
  });

// ✅ EXPORTAR LA INSTANCIA (ESTO ES LO QUE FALTABA)
module.exports = sequelize;