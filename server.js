const app = require('./app/app');
const config = require('dotenv').config();
const connectDB = require('./app/config/db');


connectDB();

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor corriendo en el puerto ${config.parsed.PORT}`);
});