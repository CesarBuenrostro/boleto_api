const { Router } = require('express');
const boletosRouter = require('./boletos.routes.js');
const usuariosRouter = require('./usuarios.routes.js');

const router = Router();

router.use('/boletos', boletosRouter)
router.use('/usuarios', usuariosRouter)

module.exports = router;



