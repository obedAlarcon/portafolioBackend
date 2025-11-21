const { Sequelize } = require('sequelize');
const { config } = require('./../config/config');
const setupModels = require('./../db/models');

console.log('🔍 Debug - Entorno:', config.env);
console.log('🔍 Debug - DATABASE_URL presente:', !!config.databaseUrl);

const isProduction = config.env === 'production';

let sequelize;

if (isProduction) {
  console.log('🔌 Conectando a base de datos en Render...');
  
  // ✅ VALIDACIÓN CRÍTICA
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
  // Configuración local...
}

// Resto del código...