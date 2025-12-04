const { Router } = require('express');
const usuariosController = require('../controllers/usuarios.controller');

const route = new Router();

route.post('/', usuariosController.createUsuario);
route.get('/', usuariosController.getUsuarios);
route.get('/:id', usuariosController.getUsuarioById); 
route.get('/saldo/:id', usuariosController.getUsuarioSaldoById); 
route.put('/:id', usuariosController.updateUsuario);
route.delete('/:id', usuariosController.deleteUsuario);
route.post('/login', usuariosController.loginUsuario);

module.exports = route;