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
router.post('/upload',
  passport.authenticate('jwt', { session: false }),
  checkRoles('admin'),
  upload.single('image'),
  validatorHandler(createProyectSchema, 'body'),
  async (req, res, next) => {
    try {
      console.log('📤 Archivo subido:', req.file);
      console.log('📝 Body recibido:', req.body);

      if (!req.file) {
        return res.status(400).json({ message: 'No se ha subido ninguna imagen.' });
      }

      const body = req.body;
      
      // GUARDAR SOLO EL NOMBRE DEL ARCHIVO en la base de datos
      body.image = req.file.filename;

      const newProyect = await service.create(body);
      
      // Construir URL completa para la respuesta
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      const responseProyect = {
        ...newProyect.dataValues,
        image: `${baseUrl}/uploads/${req.file.filename}`
      };

      res.status(201).json({
        message: 'Proyecto creado exitosamente',
        proyect: responseProyect
      });
    } catch (error) {
      next(error);
    }
  }
);

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
