const { Router } = require('express');
const router = Router();
const gamesController = require('../controller/games.controller');

router.route('/games')
    .get(gamesController.getGames)
    .post(gamesController.addgame);

router.route('/games/:gameId')
    .get(gamesController.getGame)
    .put();

module.exports = router;