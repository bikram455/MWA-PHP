const { Router } = require('express');
const router = Router();
const gamesController = require('../controller/games.controller');
const platformsController = require('../controller/platforms.controller');

router.route('/games')
    .get(gamesController.getGames)
    .post(gamesController.addgame);

router.route('/games/:gameId')
    .get(gamesController.getGame)
    .put(gamesController.updateGame)
    .delete(gamesController.deleteGame);

router.route('/games/:gameId/platforms')
    .get(platformsController.getPlatforms)
    .post(platformsController.addPlatform);

router.route('/games/:gameId/platforms/:platformId')
    .get(platformsController.getPlatform)
    .put(platformsController.updatePlatform)
    .delete(platformsController.deletePlatform);

module.exports = router;