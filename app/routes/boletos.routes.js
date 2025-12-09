const { Router } = require('express');
const boletosController = require('../controllers/boletos.controller');

const route = new Router();

route.post('/', boletosController.createBoleto);
route.get('/', boletosController.getBoletos);
route.post('/validar/:codigo_qr', boletosController.validateBoletoById); 
// route.put('/:id', boletosController.updateBoletoById);
route.delete('/:id', boletosController.deleteBoleto);


module.exports = route;