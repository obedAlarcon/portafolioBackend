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
    const proyect = await service.find();
    const baseUrl = `${req.protocol}://${req.get('host')}`;

    proyect.forEach((proyect) => {
      if (proyect.image) {
        // Convertir la ruta relativa a una URL completa
        proyect.image = `${baseUrl}/uploads/${proyect.image.replace(/\\/g, '/')}`;
      }
    });

    res.json(proyect);
  } catch (error) {
    next(error);
  } 
});

// Ruta para obtener un proyecto por ID
router.get('/:id', 
  async (req, res, next) => {
  try {
    const { id } = req.params;
    const proyect = await service.findOne(id);
    
    // Construir URL completa para la imagen
    if (proyect.image) {
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      proyect.image = `${baseUrl}/uploads/${proyect.image.replace(/\\/g, '/')}`;
    }
    
    res.json(proyect);
  } catch (error) {
    next(error);
  }
});

// Ruta para crear un nuevo proyecto (con una sola imagen)
router.post('/upload', 
  passport.authenticate('jwt', {session: false}), 
  checkRoles('admin'),
  upload.single('image'), // Aplicar .single() aquí
  validatorHandler(createProyectSchema, 'body'),       
  async (req, res, next) => {
    try {
      console.log('📤 Archivo subido:', req.file);
      console.log('📝 Body recibido:', req.body);

      if (!req.file) {
        return res.status(400).json({ message: 'No se ha subido ninguna imagen.' });
      }

      const body = req.body;
      // Guardar solo el nombre del archivo
      body.image = req.file.filename;

      const newProyect = await service.create(body);
      
      // Construir URL completa para la respuesta
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      newProyect.dataValues.image = `${baseUrl}/uploads/${req.file.filename}`;

      res.status(201).json({
        message: 'Proyecto creado exitosamente',
        proyect: newProyect
      });
    } catch (error) {
      next(error);
    }
  }
);

// Ruta para actualizar un proyecto con una nueva imagen
router.patch('/:id',  
  upload.single('image'), // Aplicar .single() aquí
  validatorHandler(updateProyectSchema, 'body'), 
  validatorHandler(getProyectSchema, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const body = req.body;

      if (req.file) {
        // Si se sube una nueva imagen, actualizamos el campo 'image'
        body.image = req.file.filename; // Solo el nombre del archivo
      }

      const proyect = await service.update(id, body);
      
      // Construir URL completa para la respuesta
      if (proyect.image) {
        const baseUrl = `${req.protocol}://${req.get('host')}`;
        proyect.image = `${baseUrl}/uploads/${proyect.image.replace(/\\/g, '/')}`;
      }
      
      res.json(proyect);
    } catch (error) {
      next(error);
    }
  }
);

// Ruta para eliminar un proyecto
router.delete('/:id', 
  passport.authenticate('jwt', {session: false}),
  checkRoles('admin'),
  async (req, res, next) => {
  try {
    const { id } = req.params;
    const proyect = await service.findOne(id);  // Buscar el proyecto para obtener la imagen

    // Eliminar la imagen si existe
    if (proyect.image) {
      const imagePath = path.join(__dirname, '../uploads', proyect.image);
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error('Error al eliminar la imagen', err);
        } else {
          console.log('Imagen eliminada');
        }
      });
    }

    await service.delete(id);  // Eliminar el proyecto
    res.status(201).json({ id });
  } catch (error) {
    next(error);
  }
});

// Ruta de diagnóstico para verificar uploads
router.get('/debug/upload-status', (req, res) => {
  const uploadPath = path.join(__dirname, '../uploads');
  const exists = fs.existsSync(uploadPath);
  
  let files = [];
  if (exists) {
    files = fs.readdirSync(uploadPath);
  }
  
  res.json({
    uploadFolderExists: exists,
    uploadPath: uploadPath,
    filesCount: files.length,
    files: files
  });
});

module.exports = router;
