const { Router } = require('express');
const boletosController = require('../controllers/boletos.controller');

const route = new Router();

route.post('/', boletosController.createBoleto);
route.get('/', boletosController.getBoletos);
route.post('/:codigo_qr', boletosController.validateBoletoById); // valida y actualiza boleto
// route.put('/:id', boletosController.updateBoletoById);
route.delete('/:id', boletosController.deleteBoleto);


module.exports = route;