// middlewares/multer.js

const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Asegurar que la carpeta uploads exista
const uploadPath = path.join(__dirname, "..", "uploads");

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
  console.log("📁 Carpeta uploads creada:", uploadPath);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath); 
  },

  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + "-" + Math.round(Math.random() * 1e9) + ext);
  }
});

// 👇 ESTA ES LA INSTANCIA CORRECTA
const upload = multer({ storage });

// 👇 ESTA ES LA EXPORTACIÓN CORRECTA PARA REQUIRE()
module.exports = upload;
