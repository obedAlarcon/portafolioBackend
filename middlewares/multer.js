// Crear carpeta si no existe
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
  console.log(`📁 Carpeta de uploads creada en: ${uploadPath}`);
}

// SIEMPRE servir archivos estáticos
app.use('/uploads', express.static(uploadPath));
console.log(`📁 Sirviendo archivos estáticos desde: ${uploadPath}`);
