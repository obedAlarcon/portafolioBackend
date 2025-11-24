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
// En tu multer configuration, verifica los permisos
console.log('📁 Upload path:', uploadPath);
console.log('📁 Permisos de carpeta:', fs.existsSync(uploadPath) ? 'EXISTE' : 'NO EXISTE');
console.log('📁 Puede escribir:', fs.existsSync(uploadPath) ? (fs.accessSync(uploadPath, fs.constants.W_OK) ? 'SI' : 'NO') : 'NO EXISTE');

const upload = multer({ storage });

module.exports = upload;
