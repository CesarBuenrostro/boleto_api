const mysql =require('mysql2/promise');
const dotenv = require('dotenv');
dotenv.config();

const connectDB = async () => {
  try{
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      port: process.env.DB_PORT || 3306,
      database: process.env.DB_NAME,
    });
    console.log('Conexión a la base de datos exitosa');
    return connection;
  } catch (error) {
    console.error('Error al conectar a la base de datos: ', error);
    process.exit(1);
  }
}


module.exports = connectDB;
