const boom = require('@hapi/boom')
const UserService = require('./user.service')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const service =  new UserService()
const {config}= require('./../config/config')
const nodemailer= require('nodemailer')

 class AuthService{


  
   async getUser(email,password){
  const user=await service.findByEmail(email)
  if(!user){
    throw boom.unauthorized()
  }
  const isMatch=await bcrypt.compare(password,user.password)
  if(!isMatch){
    throw boom.unauthorized()
  }
delete user.dataValues.password
return user;
    }

    signToken(user){
        const payload={
sub:user.id,
role:user.role
        }
        const token = jwt.sign(payload,config.jwtSecret)    
        return {
           user,
           token
        }
    }

    async sendRecovery(email) {
  const user = await service.findByEmail(email);
  if (!user) {
    throw boom.unauthorized();  
  }

  const payload = { sub: user.id };
  const token = jwt.sign(payload, config.jwtSecret, { expiresIn: '15min' });

  // Detecta si está en producción o en local
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:4200';

  const link = `${frontendUrl}/recovery?token=${token}`;

  await service.update(user.id, { recoveryToken: token });

  const mail = {
    from: config.smtpEmail,
    to: user.email,
    subject: "Recuperación de contraseña",
    html: `<b>Haz clic para recuperar tu contraseña:</b><br><a href="${link}">${link}</a>`,
  };

  const rta = await this.sendMail(mail);
  return rta;
}


// este es el endpoint para recuérar password
async changePassword(token,newPassword){
  try {
    const payload = jwt.verify(token, config.jwtSecret)
    const user = await service.findOne(payload.sub)
    if(user.recoveryToken !== token){
      throw boom.unauthorized()
    }
    const hash = await bcrypt.hash(newPassword,10)
    await service.update(user.id, {recoveryToken:null,password:hash})
    return {message: 'password changed'}
  } catch (error) {
    throw boom.unauthorized()
  }

}








async sendMail(infoMail){

    
 const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true for port 465, false for other ports
    auth: {
      user:config.smtpEmail, // tremos las veriables de ambiente desde .env, config/config.js
      pass: config.smtpPassword
    }, 
 })
await transporter.sendMail(infoMail)
return {massege:'mail sent'}
    // send mail with defined transport object
}
}
 
 module.exports =AuthService