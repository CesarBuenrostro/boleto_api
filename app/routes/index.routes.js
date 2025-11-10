const { Router } = require('express');
const boletosRouter = require('./boletos.routes');

const router = Router();

router.use('/boletos', boletosRouter);

module.exports = router;



