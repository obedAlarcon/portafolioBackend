const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // true for port 465, false for other ports
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD
  }, 
});

// async..await is not allowed in global scope, must use a wrapper
async function sendMail() {
  // send mail with defined transport object
 const info = await transporter.sendMail({
  from: '"Portafolio Web" <desarrolloc20@gmail.com>', // el que autenticaste
  to: "desarrolloc20@gmail.com", // tu mismo, para recibir
  subject: "Nuevo mensaje de contacto",
  text: "El usuario dejó un mensaje",
  replyTo: "usuarioformulario@mail.com" // aquí sí pones el correo de quien escribió
});


  console.log("Message sent: %s", info.messageId);
  // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
}

sendMail()
