require ('dotenv').config();

const config = {
 


env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 5000,
  apiKey: process.env.API_KEY,
  jwtSecret: process.env.JWT_SECRET,
  smtpEmail: process.env.SMTP_EMAIL,
  smtpPassword: process.env.SMTP_PASSWORD,
  
  dbUser: process.env.DB_USER,
  dbPassword: process.env.DB_PASSWORD,
  dbHost: process.env.DB_HOST,
  dbPort: process.env.DB_PORT,
  dbName: process.env.DB_NAME,
  
  databaseUrl: process.env.DATABASE_URL,

}
module.exports={config}



