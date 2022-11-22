const { Router } = require('express');
const gamesRoutes = require('./games.routes');
const usersRoutes = require('./users.routes');

const router = Router();

router.use(process.env.USERS_ROUTES, usersRoutes);
router.use(process.env.GAMES_ROUTES, gamesRoutes);

module.exports = router;