const express = require('express');
const ProyectService = require('./../services/proyect.service');
const upload = require('./../middlewares/multer');
const { createProyectSchema, updateProyectSchema, getProyectSchema } = require('./../schemas/proyect.schema');
const path = require('path');
const fs = require('node:fs');
const validatorHandler = require('./../middlewares/validatorHandler');
const passport = require('passport');
const {checkRoles}=require('./../middlewares/auth.handler')


const router = express.Router();

// Agrega esto temporalmente en tu proyect.router.js - ANTES de las otras rutas
router.get('/debug/upload-test', (req, res) => {
  const fs = require('fs');
  const path = require('path');
  
  // Todas las rutas posibles
  const pathsToCheck = [
    '/tmp/uploads',
    path.join(__dirname, '../uploads'),
    path.join(process.cwd(), 'uploads'),
    './uploads'
  ];
  
  const results = {};
  
  pathsToCheck.forEach(checkPath => {
    try {
      const absolutePath = path.resolve(checkPath);
      results[checkPath] = {
        exists: fs.existsSync(absolutePath),
        absolutePath: absolutePath,
        canWrite: false,
        files: []
      };
      
      if (results[checkPath].exists) {
        results[checkPath].files = fs.readdirSync(absolutePath);
        // Test de escritura
        try {
          const testFile = path.join(absolutePath, 'test-write.txt');
          fs.writeFileSync(testFile, 'test');
          fs.unlinkSync(testFile);
          results[checkPath].canWrite = true;
        } catch (e) {
          results[checkPath].canWrite = false;
          results[checkPath].writeError = e.message;
        }
      }
    } catch (error) {
      results[checkPath] = { error: error.message };
    }
  });
  
  // Información del sistema
  results.system = {
    cwd: process.cwd(),
    __dirname: __dirname,
    NODE_ENV: process.env.NODE_ENV,
    platform: process.platform
  };
  
  res.json(results);
});
const service = new ProyectService();
// Ruta para obtener todos los proyectos
router.get('/', async (req, res, next) => {
  try {
    const proyectos = await service.find();
    const baseUrl = `${req.protocol}://${req.get('host')}`;

    const proyectosConImagen = proyectos.map(proyecto => {
      if (proyecto.image) {
        // En producción, la imagen ya está en /tmp/uploads
        return {
          ...proyecto.dataValues,
          image: `${baseUrl}/uploads/${path.basename(proyecto.image)}`
        };
      }
      return proyecto;
    });

    res.json(proyectosConImagen);
  } catch (error) {
    next(error);
  }
});

// Ruta para crear proyecto

router.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No se recibió imagen' });
  }

  const fileUrl = `/uploads/${req.file.filename}`;

  res.json({
    message: 'Imagen subida',
    url: fileUrl
  });
});

// Ruta para probar (NO sube imagen)
router.get('/upload-test', (req, res) => {
  res.json({
    message: 'Ruta funcionando',
    ruta_absoluta_uploads: path.join(__dirname, '../uploads'),
  });
});

// Ruta para actualizar proyecto
router.patch('/:id',
  upload.single('image'),
  validatorHandler(updateProyectSchema, 'body'),
  validatorHandler(getProyectSchema, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const body = req.body;

      if (req.file) {
        // Guardar solo el nombre del archivo
        body.image = req.file.filename;
      }

      const proyect = await service.update(id, body);
      
      // Construir URL completa para la respuesta
      if (proyect.image) {
        const baseUrl = `${req.protocol}://${req.get('host')}`;
        proyect.image = `${baseUrl}/uploads/${proyect.image}`;
      }
      
      res.json(proyect);
    } catch (error) {
      next(error);
    }
  }
);

// Ruta para eliminar proyecto
router.delete('/:id',
  passport.authenticate('jwt', { session: false }),
  checkRoles('admin'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const proyect = await service.findOne(id);

      // Eliminar la imagen si existe
      if (proyect.image) {
        const uploadDir = process.env.NODE_ENV === 'production' 
          ? '/tmp/uploads' 
          : path.join(__dirname, '../uploads');
        const imagePath = path.join(uploadDir, proyect.image);
        
        fs.unlink(imagePath, (err) => {
          if (err) {
            console.error('Error al eliminar la imagen:', err);
          } else {
            console.log('✅ Imagen eliminada:', imagePath);
          }
        });
      }

      await service.delete(id);
      res.status(200).json({ 
        message: 'Proyecto eliminado exitosamente',
        id: id 
      });
    } catch (error) {
      next(error);
    }
  }
);

// Ruta de diagnóstico MEJORADA
router.get('/debug/upload-status', (req, res) => {
  const uploadDir = process.env.NODE_ENV === 'production' 
    ? '/tmp/uploads' 
    : path.join(__dirname, '../uploads');
  
  const exists = fs.existsSync(uploadDir);
  let files = [];
  
  if (exists) {
    files = fs.readdirSync(uploadDir);
  }
  
  res.json({
    environment: process.env.NODE_ENV,
    uploadFolderExists: exists,
    uploadPath: uploadDir,
    filesCount: files.length,
    files: files,
    absolutePath: path.resolve(uploadDir)
  });
});

module.exports = router;
