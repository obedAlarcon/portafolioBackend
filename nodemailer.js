const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD
  }
});

async function sendMail({ name, email, message }) {
  const info = await transporter.sendMail({
    from: `"Portafolio Web" <${process.env.SMTP_EMAIL}>`,
    to: process.env.SMTP_EMAIL,
    subject: "Nuevo mensaje de contacto",
    html: `
      <h3>Nuevo mensaje desde el formulario</h3>
      <p><strong>Nombre:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Mensaje:</strong> ${message}</p>
    `,
    replyTo: email
  });

  console.log("Correo enviado:", info.messageId);
}

module.exports = sendMail;
