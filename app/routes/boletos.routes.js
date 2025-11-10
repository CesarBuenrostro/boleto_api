const { Router } = require('express');

const route = new Router();

route.get('/boletos', (req, res) => {
    res.send('Lista de boletos');
});

module.exports = route;