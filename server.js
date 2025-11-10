const app = require('./app/app');
const config = require('dotenv').config();
const conexion = require('./app/config/db');


conexion.connect();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${config.parsed.PORT}`);
});