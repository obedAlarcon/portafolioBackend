const express = require('express');
const AuthService = require('../services/auth.service');
const { config } = require('../config/config');

const service = new AuthService();
const router = express.Router();

router.post('/', async (req, res, next) => {
  try {
    const { nombre, email, mensaje } = req.body;

    if (!nombre || !email || !mensaje) {
      return res.status(400).json({
        error: 'Todos los campos son obligatorios'
      });
    }

    const mail = {
      from: `"Contacto desde el portafolio" <${config.smtpEmail}>`,
      to: config.smtpEmail, // te envías a ti mismo
      subject: 'Nuevo mensaje desde tu portafolio',
      text: `Has recibido un mensaje de ${nombre} (${email}): ${mensaje}`,
      html: `
        <h3>Has recibido un nuevo mensaje</h3>
        <p><strong>Nombre:</strong> ${nombre}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Mensaje:</strong></p>
        <p>${mensaje}</p>
      `,
      replyTo: email
    };

    const result = await service.sendMail(mail);
    res.json({ success: true, result });

  } catch (error) {
    console.error("❌ Error en /contact:", error);
    res.status(500).json({ error: "Error al enviar el correo" });
  }
});

module.exports = router;
