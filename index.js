const express = require('express');
const { logErrors, errorHandler, ormErrorHandler } = require('./middlewares/error.handler');
const swaggerUi = require('swagger-ui-express');
const path = require('path');
const sequelize = require('./libs/sequelize')
const fs = require('fs');
const { checkApiKey } = require('./middlewares/auth.handler');
const passport = require('passport');
const routerApi = require('./routes');  // Asegúrate que las rutas estén bien configuradas
const swaggerDoc = require('./swagger.json');  // Asegúrate de que tu archivo swagger.json esté en el lugar correcto
const cors = require('cors');
const port = process.env.PORT || 5000;

const app = express();

// Middleware para parsear JSON
app.use(express.json());

app.use(cors({
  origin: true,
  credentials: true
}));


// Asegúrate de importar correctamente la instancia de Sequelize
// este es el codigo para cincronizar las tabls
/*
sequelize.sync({ alter: true })  // O { force: true } si quieres eliminar tablas existentes y recrearlas
  .then(() => {
    console.log(' Tablas sincronizadas con Sequelize');
  })
  .catch(err => {
    console.error('❌ Error al sincronizar tablas:', err);
  });*/

// Iniciar passport
app.use(passport.initialize());
require('./utils/auth');  // Asegúrate que este archivo de autenticación esté correcto

// Directorio para subir archivos
// Middleware para servir archivos estáticos desde la carpeta "uploads"

if (process.env.NODE_ENV === 'production') {
  const tmpUploads = '/tmp/uploads';
  // Crear carpeta si no existe
  if (!fs.existsSync(tmpUploads)) {
    fs.mkdirSync(tmpUploads, { recursive: true });
  }
  app.use('/uploads', express.static(tmpUploads));
  console.log('🔧 Sirviendo archivos desde /tmp/uploads');
} else {
  // Desarrollo local
  app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
  console.log('🔧 Sirviendo archivos desde uploads/ local');
}
// Rutas de la API
routerApi(app)

// Ruta principal
app.get('/', (req, res) => {
  res.send('Hola mi server en express');
});

// Nueva ruta protegida con checkApiKey
app.get('/nueva-ruta', checkApiKey, (req, res) => {
  res.send('Hola, soy una nueva ruta');
});

// Configuración de Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));

// Middlewares para manejo de errores
app.use(logErrors);
app.use(errorHandler);
app.use(ormErrorHandler);

// Levantar servidor
app.listen(port, () => {
  console.log(`Aplicación corriendo en el puerto: ${port}`);
});
