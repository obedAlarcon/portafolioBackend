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

// 🚀 GET - Obtener todos
router.get('/', async (req, res, next) => {
  try {
    const proyectos = await service.find();
    const baseUrl = `${req.protocol}://${req.get('host')}`;

    const response = proyectos.map(p => ({
      ...p.dataValues,
      image: p.image ? `${baseUrl}/uploads/${p.image}` : null
    }));

    res.json(response);
  } catch (error) {
    next(error);
  }
});

// 🚀 POST - Crear proyecto + imagen
router.post("/upload", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No se recibió ningún archivo" });
  }

  return res.status(200).json({
    message: "Imagen subida correctamente",
    file: req.file.filename,
    url: `/uploads/${req.file.filename}`
  });
});


// 🚀 PATCH - Actualizar proyecto
router.patch('/:id',
  upload.single('image'),
  validatorHandler(updateProyectSchema, 'body'),
  validatorHandler(getProyectSchema, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const body = req.body;

      if (req.file) {
        body.image = req.file.filename;
      }

      const updated = await service.update(id, body);

      const baseUrl = `${req.protocol}://${req.get('host')}`;
      updated.image = `${baseUrl}/uploads/${updated.image}`;

      res.json(updated);
    } catch (error) {
      next(error);
    }
  }
);

// 🚀 DELETE - Eliminar
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
          : path.join(__dirname, '../uploads');

        const imagePath = path.join(uploadDir, proyect.image);
        fs.unlink(imagePath, () => {});
      }

      await service.delete(id);
      res.json({ message: 'Proyecto eliminado', id });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
