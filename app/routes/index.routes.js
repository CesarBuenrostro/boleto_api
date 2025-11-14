const { Router } = require('express');
const boletosRouter = require('./boletos.routes.js');
const usuariosRouter = require('./usuarios.routes.js');
const unidadesRouter = require('./unidades.routes.js');
const rutasRouter = require('./rutas.routes.js')

const router = Router();

router.use('/boletos', boletosRouter);
router.use('/usuarios', usuariosRouter);
router.use('/unidades', unidadesRouter);
router.use('/rutas', rutasRouter);

module.exports = router;



