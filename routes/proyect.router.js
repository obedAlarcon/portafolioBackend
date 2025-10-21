const express = require('express');
const ProyectService = require('./../services/proyect.service');
const multer = require('multer');
const { createProyectSchema, updateProyectSchema, getProyectSchema } = require('./../schemas/proyect.schema');
const path = require('path');
const fs = require('node:fs');
const validatorHandler = require('./../middlewares/validatorHandler');
const passport = require('passport');
const {checkRoles}=require('./../middlewares/auth.handler')


const router = express.Router();

// Configuración de almacenamiento de multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');  // Establecer la carpeta donde se guardarán las imágenes
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);  // Asignar un nombre único al archivo
  }
});

// Inicializamos el middleware de multer para subir varias imágenes (máximo 3 imágenes)
const upload = multer({ storage: storage }).single('image');


// Servicio de proyectos
const service = new ProyectService();

// Ruta para obtener todos los proyectos
router.get('/', async (req, res, next) => {
  try {
    const proyect = await service.find();
    const baseUrl = `${req.protocol}://${req.get('host')}`;

    proyect.forEach((proyect) => {
      if (proyect.image) {
        // Convertir la ruta relativa a una URL completa
        proyect.image = `${baseUrl}/${proyect.image.replace(/\\/g, '/')}`;
      }
    });

    res.json(proyect);
  } catch (error) {
    next(error);
  } 
});

// Ruta para obtener un proyecto por ID
router.get('/:id', 
/*

// aqui velidamos el usuario y el tipo de usuario o (ROL)
  passport.authenticate('jwt',{session: false}),
  checkRoles(F'admin'),
  validatorHandler(createProyectSchema, 'body'),
      */
  async (req, res, next) => {
  try {
    const { id } = req.params;
    const proyect = await service.findOne(id);
    res.json(proyect);
     console.log(image);
  } catch (error) {
    next(error);
  }
});

// Ruta para crear un nuevo proyecto (con imágenes)
// Ruta para crear un nuevo proyecto (con una sola imagen)
router.post('/upload', upload,  
  // aqui protejemos la ruta
  
  passport.authenticate('jwt',{session: false}), 
   // no necesitamos sessiones lo manejamos por jwt
  // suando ahcemo login nos dan un tokem lo autorizamos en postnan para poder crear el proyecto!
    checkRoles('admin'),// traemos los clushures del roles, el arry puede llevar admin y customer y vendedor o solo uno
    validatorHandler(createProyectSchema, 'body'),
      
           
  async (req, res, next) => {
    
  try {
   
    

    // Verificar si se ha subido un archivo
    console.log('Archivo subido:', req.file);  // Verifica qué datos están siendo enviados

    if (!req.file) {
      return res.status(400).json({ message: 'No se ha subido ninguna imagen.' });
    }

    const filePath = req.file.path;
    const body = req.body;
    body.image = filePath; // Guardar la ruta de la imagen

    const newProyect = await service.create(body);
    res.status(201).json(newProyect);
  } catch (error) {
    next(error);
  }
});

// Ruta para actualizar un proyecto con una nueva imagen
// Si solo vas a manejar una imagen para actualizar el proyecto, usa upload.single('image') en lugar de upload.array.
router.patch('/:id',  upload,
  validatorHandler(updateProyectSchema, 'body'), 
  validatorHandler(getProyectSchema, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const body = req.body;

      if (req.file) {
        // Si se sube una nueva imagen, actualizamos el campo 'image'
        body.image = req.file.path;
      }

      const proyect = await service.update(id, body);
      res.json(proyect);
    } catch (error) {
      next(error);
    }
});

// Ruta para eliminar un proyecto
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const proyect = await service.findOne(id);  // Buscar el proyecto para obtener la imagen

    // Eliminar la imagen si existe
    if (proyect.image) {
      fs.unlink(proyect.image, (err) => {
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

module.exports = router;
