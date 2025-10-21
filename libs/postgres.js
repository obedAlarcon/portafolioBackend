const { Client } = require('pg');

async function getConnection() {
  const isProduction = process.env.NODE_ENV === 'production';

  const connectionOptions = isProduction
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      }
    : {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
      };

  const client = new Client(connectionOptions);
  await client.connect();

  console.log(` Conectado a PostgreSQL (${isProduction ? 'Render' : 'Local'})`);
  return client;
}

module.exports = getConnection;
