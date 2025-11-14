const { Router } = require('express');
const rutasController = require('../controllers/rutas.controller');

const route = new Router();

route.post('/', rutasController.createRuta);
route.get('/', rutasController.getRuta);
route.put('/:id', rutasController.updateRuta);
route.delete('/:id', rutasController.deleteRuta);

module.exports = route;