const { Router } = require('express');
const pagosController = require('../controllers/pagos.controller');

const route = new Router();

// Crear un pago (aunque normalmente lo harás dentro de crear boletos)
route.post('/', pagosController.createPago);

// Obtener todos los pagos
route.get('/', pagosController.getPagos);

// Obtener pagos por usuario
route.get('/usuario/:id_usuario', pagosController.getPagosByUser);

// Eliminar un pago (solo si no tiene boletos asociados)
route.delete('/:id', pagosController.deletePago);

module.exports = route;
