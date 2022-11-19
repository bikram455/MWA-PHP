const { Router } = require('express');
const gamesRoutes = require('./games.routes');
const usersRoutes = require('./users.routes');

const router = Router();

router.use('/users', usersRoutes);

router.use('/games', gamesRoutes);

module.exports = router;