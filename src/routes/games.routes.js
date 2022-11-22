const { Router } = require('express');
const router = Router();
const gamesController = require('../controller/games.controller');
const authController = require('../controller/authentication.controller');
const platformsController = require('../controller/platforms.controller');

router.route(process.env.ROOT_ROUTE)
    .get(gamesController.getGames)
    .post(gamesController.addgame);

router.route(process.env.GAME_ROUTES)
    .get(gamesController.getGame)
    .put(gamesController.fullUpdateGame)
    .patch(gamesController.partialUpdateGame)
    .delete(gamesController.deleteGame);

router.route(process.env.PLATFORMS_ROUTES)
    .get(platformsController.getPlatforms)
    .post(platformsController.addPlatform);

router.route(process.env.PLATFORM_ROUTES)
    .get(platformsController.getPlatform)
    .patch(platformsController.partialUpdatePlatform)
    .put(platformsController.fullUpdatePlatform)
    .delete(platformsController.deletePlatform);

module.exports = router;