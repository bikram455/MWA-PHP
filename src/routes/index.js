const { Router } = require('express');
const router = Router();
const gamesController = require('../controller/games.controller');
const usersController = require('../controller/users.controller');
const platformsController = require('../controller/platforms.controller');

router.route('/games')
    .get(gamesController.getGames)
    .post(gamesController.addgame);

router.route('/users')
    .post(usersController.register);

router.route('/user')
    .post(usersController.login1);

router.route('/games/:gameId')
    .get(gamesController.getGame)
    .put(gamesController.fullUpdateGame)
    .patch(gamesController.partialUpdateGame)
    .delete(gamesController.deleteGame);

router.route('/games/:gameId/platforms')
    .get(platformsController.getPlatforms)
    .post(platformsController.addPlatform);

router.route('/games/:gameId/platforms/:platformId')
    .get(platformsController.getPlatform)
    .patch(platformsController.partialUpdatePlatform)
    .put(platformsController.fullUpdatePlatform)
    .delete(platformsController.deletePlatform);

module.exports = router;