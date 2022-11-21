const { Router } = require('express');
const router = Router();
const gamesController = require('../controller/games.controller');
const authController = require('../controller/authentication.controller');
const platformsController = require('../controller/platforms.controller');

router.route('/')
    .get(gamesController.getGames)
    .post(gamesController.addgame);

router.route('/:gameId')
    // .get(authController.authenticate, gamesController.getGame)
    .get(gamesController.getGame)
    .put(gamesController.fullUpdateGame)
    .patch(gamesController.partialUpdateGame)
    .delete(gamesController.deleteGame);

router.route('/:gameId/platforms')
    .get(platformsController.getPlatforms)
    .post(platformsController.addPlatform);

router.route('/:gameId/platforms/:platformId')
    .get(platformsController.getPlatform)
    .patch(platformsController.partialUpdatePlatform)
    .put(platformsController.fullUpdatePlatform)
    .delete(platformsController.deletePlatform);

module.exports = router;