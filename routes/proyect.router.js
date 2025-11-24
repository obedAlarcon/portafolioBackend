const express = require('express');
const ProyectService = require('../services/proyect.service');
const upload = require('../middlewares/multer');
const { createProyectSchema, updateProyectSchema, getProyectSchema } = require('../schemas/proyect.schema');
const validatorHandler = require('../middlewares/validatorHandler');
const passport = require('passport');
const { checkRoles } = require('../middlewares/auth.handler');
const path = require('path');
const fs = require('fs');

const router = express.Router();
const service = new ProyectService();

// Función para construir la URL de la imagen
const buildImgUrl = (req, imageName) => {
  if (!imageName) return null;
  return `${req.protocol}://${req.get('host')}/uploads/${imageName}`;
};

// GET - Obtener todos
router.get('/', async (req, res, next) => {
  try {
    const proyectos = await service.find();
    const response = proyectos.map(p => ({
      ...p.dataValues,
      image: buildImgUrl(req, p.image)
    }));

    res.json(response);
  } catch (error) {
    next(error);
  }
});

// POST - Crear proyecto + imagen
router.post('/',
  upload.single('image'),
  validatorHandler(createProyectSchema, 'body'),
  async (req, res, next) => {
    try {
      const body = req.body;

      if (req.file) {
        body.image = req.file.filename;
      }

      const newProyect = await service.create(body);

      newProyect.dataValues.image = buildImgUrl(req, newProyect.image);

      res.status(201).json(newProyect);
    } catch (error) {
      next(error);
    }
  }
);

// PATCH - Actualizar proyecto
router.patch('/:id',
  upload.single('image'),
  validatorHandler(getProyectSchema, 'params'),
  validatorHandler(updateProyectSchema, 'body'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const body = req.body;

      if (req.file) {
        body.image = req.file.filename;
      }

      const updated = await service.update(id, body);

      updated.dataValues.image = buildImgUrl(req, updated.image);

      res.json(updated);
    } catch (error) {
      next(error);
    }
  }
);

// DELETE - Eliminar
router.delete('/:id',
  passport.authenticate('jwt', { session: false }),
  checkRoles('admin'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const proyect = await service.findOne(id);

      if (proyect.image) {
        const uploadDir = process.env.NODE_ENV === 'production'
          ? '/tmp/uploads'
          : path.join(process.cwd(), 'uploads');

        const imgPath = path.join(uploadDir, proyect.image);

        fs.unlink(imgPath, () => {});
      }

      await service.delete(id);

      res.json({ message: 'Proyecto eliminado', id });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
