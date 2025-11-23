const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Carpeta donde se guardarán las imágenes
const uploadPath = process.env.NODE_ENV === 'production'
  ? '/tmp/uploads'                       // Render
  : path.join(process.cwd(), 'uploads');  // Local

// Crear la carpeta si no existe
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

// Configuración de Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadPath),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

module.exports = upload;
