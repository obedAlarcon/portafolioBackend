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
    logging: false,
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
    logging: false,
  });
}

// ✅ CONFIGURAR MODELOS
setupModels(sequelize);

// ✅ AUTENTICACIÓN, SINCRONIZACIÓN Y CREACIÓN DE USUARIO
sequelize.authenticate()
  .then(() => {
    console.log('🟢 Conexión a la base de datos exitosa');
    
    // ✅ SINCRONIZAR TABLAS
    return sequelize.sync({ alter: true });
  })
  .then(() => {
    console.log('✅ Tablas sincronizadas correctamente');
    
    // ✅ CREAR USUARIO AUTOMÁTICAMENTE
    return createInitialUser();
  })
  .then(() => {
    console.log('🎉 Base de datos inicializada completamente');
  })
  .catch(err => {
    console.error('❌ Error al conectar con la base de datos:', err);
    process.exit(1);
  });

// ✅ FUNCIÓN PARA CREAR USUARIO INICIAL
async function createInitialUser() {
  try {
    const { User } = require('./../db/models/user.model');
    const bcrypt = require('bcrypt');
    
    console.log('🔍 Verificando si existe el usuario...');
    const userCount = await User.count();
    console.log(`📊 Usuarios en la base de datos: ${userCount}`);
    
    if (userCount === 0) {
      console.log('🔄 Creando usuario administrador...');
      const hashedPassword = await bcrypt.hash('admin12345', 10);
      
      const user = await User.create({
        email: 'desarrolloc20@gmail.com',
        password: hashedPassword,
        role: 'admin'
      });
      
      console.log('✅ Usuario administrador creado exitosamente');
      console.log('📧 Email:', user.email);
      console.log('🔑 Password: admin12345');
    } else {
      console.log('✅ Usuario ya existe en la base de datos');
    }
  } catch (error) {
    console.error('❌ Error creando usuario:', error);
  }
}

// ✅ EXPORTAR LA INSTANCIA
module.exports = sequelize;