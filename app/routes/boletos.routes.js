const { Router } = require('express');
const boletosController = require('../controllers/boletos.controller');

const route = new Router();

route.post('/', boletosController.createBoleto);
route.get('/', boletosController.getBoletos);
route.put('/:id', boletosController.validateBoletoById);
// route.put('/:id', boletosController.updateBoleto);
route.delete('/:id', boletosController.deleteBoleto);


module.exports = route;