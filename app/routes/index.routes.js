const { Router } = require('express');
const boletosRouter = require('./boletos.routes.js');
const usuariosRouter = require('./usuarios.routes.js');
const unidadesRouter = require('./unidades.routes.js');
const rutasRouter = require('./rutas.routes.js');
const pagosRouter = require('./pagos.routes.js');

const router = Router();

router.use('/boletos', boletosRouter);
router.use('/usuarios', usuariosRouter);
router.use('/unidades', unidadesRouter);
router.use('/rutas', rutasRouter);
router.use('/pagos', pagosRouter);


module.exports = router;