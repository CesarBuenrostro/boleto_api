const { Router } = require('express');
const unidadesController = require('../controllers/unidades.controller');

const route = new Router();

route.post('/', unidadesController.createUnidad);
route.get('/', unidadesController.getUnidades);
route.put('/:id', unidadesController.updateUnidad);
route.delete('/:id', unidadesController.deleteUnidad);


module.exports = route;