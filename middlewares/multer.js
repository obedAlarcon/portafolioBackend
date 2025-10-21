// Archivo de configuración de multer
const multer = require('multer');

// Configuración de almacenamiento de multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');  // Establecer la carpeta donde se guardarán las imágenes
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);  // Asignar un nombre único al archivo
  }
});

// Configurar multer para una sola imagen
const upload = multer({ storage: storage }).single('image');  // Solo una imagen
module.exports = upload;
