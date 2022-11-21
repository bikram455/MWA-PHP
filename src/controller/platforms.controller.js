const platformController = {};
const dbUtils = require('../utilities/db.utils');
const systemUtils = require('../utilities/system.utils');
const GAME_CONSTANTS = require('../constants/game.constants');
const Game = require('mongoose').model(process.env.GAME_MODEL);
const SYSTEM_CONSTANTS = require('../constants/system.constants');
const PLATFORM_CONSTANTS = require('../constants/platform.constants');

const _updatePlatform = function (req, res, response) {
    _getGameById(req.params.gameId)
        .then(game => {
            const platform = game.platforms.id(req.params.platformId);
            const platformBody = {
                name: req.body.name || platform.name,
                year: req.body.year || platform.year
            };
            if (platform) {
                platform.set(platformBody);
                _saveGame(game, platform);
            } else {
                throw ({ status: process.env.NOT_FOUND_STATUS_CODE, error: PLATFORM_CONSTANTS.PLATFORM_NOT_FOUND });
            }
        })
        .then(game => response.status = 204)
        .catch(err => systemUtils.setError(response, err.status, err.error))
        .finally(() => systemUtils.sendResponse(res, response));
}

const _getGameById = function (gameId) {
    return new Promise((resolve, reject) => {
        Game.findById(gameId).exec().then((game) => {
            if (game) {
                resolve(game);
            } else {
                reject({ status: process.env.NOT_FOUND_STATUS_CODE, error: GAME_CONSTANTS.GAME_NOT_FOUND });
            }
        }).catch((err) => {
            reject({ status: process.env.INTERNAL_SERVER_ERROR_STATUS_CODE, error: err });
        });
    });
}

const _saveGame = function (game, platform) {
    return new Promise((resolve, reject) => {
        game.save()
            .then(res => resolve(res))
            .catch(err => reject({ status: process.env.INTERNAL_SERVER_ERROR_STATUS_CODE, error: err }))
    });
}

const _addPlatform = function (req, res, response) {
    const platform = {
        name: req.body.name,
        year: req.body.year
    };
    _getGameById(req.params.gameId)
        .then(game => {
            game.platforms.push(platform);
            _saveGame(game, platform);
        })
        .then(game => response.status = 201)
        .catch(err => systemUtils.setError(response, err.status, err.error))
        .finally(() => systemUtils.sendResponse(res, response));
}

const _deletePlatform = function (req, res, response) {
    const platformId = req.params.platformId;
    _getGameById(req.params.gameId)
        .then(game => {
            const platform = game.platforms.id(platformId);
            if (platform) {
                game.platforms.id(platformId).remove();
                _saveGame(game, platform);
            } else {
                throw ({ status: process.env.NOT_FOUND_STATUS_CODE, error: PLATFORM_CONSTANTS.PLATFORM_NOT_FOUND });
            }
        })
        .then(game => response.body = { message: PLATFORM_CONSTANTS.PLATFORM_DELETE_SUCCESS })
        .catch(err => systemUtils.setError(response, err.status, err.error))
        .finally(() => systemUtils.sendResponse(res, response));
}

const _sendPlatforms = function (req, res, response) {
    _getGameById(req.params.gameId)
        .then((game) => response.body = { data: game[PLATFORM_CONSTANTS.PLATFORMS] })
        .catch((err) => systemUtils.setError(response, err.status, err.error))
        .finally(() => systemUtils.sendResponse(res, response));
}

const _sendPlatform = function (req, res, response, game) {
    _getGameById(req.params.gameId)
        .then((game) => {
            platform = game.platforms.id(req.params.platformId);
            if (platform) {
                response.body = { data: platform };
            } else {
                systemUtils.setError(response, process.env.NOT_FOUND_STATUS_CODE, PLATFORM_CONSTANTS.PLATFORM_NOT_FOUND);
            }
        })
        .catch((err) => systemUtils.setError(response, err.status, err.error))
        .finally(() => systemUtils.sendResponse(res, response));
}

platformController.getPlatforms = function (req, res) {
    const response = systemUtils.getResponse(process.env.SUCCESS_STATUS_CODE);
    dbUtils.setErrorForInvalidGameId(req.params.gameId, response, GAME_CONSTANTS.GAME);
    if (response.status === process.env.SUCCESS_STATUS_CODE) {
        _sendPlatforms(req, res, response);
    } else {
        systemUtils.sendResponse(res, response);
    }
}

platformController.getPlatform = function (req, res) {
    const response = systemUtils.getResponse(process.env.SUCCESS_STATUS_CODE);
    dbUtils.setErrorForInvalidGameId(req.params.gameId, response);
    dbUtils.setErrorForInvalidPlatformId(req.params.platformId, response);
    if (response.status === process.env.SUCCESS_STATUS_CODE) {
        _sendPlatform(req, res, response);
    } else {
        systemUtils.sendResponse(res, response);
    }
}

platformController.addPlatform = function (req, res) {
    const response = systemUtils.getResponse(process.env.SUCCESS_STATUS_CODE, PLATFORM_CONSTANTS.PLATFORM_ADD_SUCCESS);
    dbUtils.setErrorForInvalidGameId(req.params.gameId, response, GAME_CONSTANTS.GAME);
    if (response.status === process.env.SUCCESS_STATUS_CODE) {
        if (!systemUtils.isObjectEmpty(req.body) && req.body.name && req.body.year) {
            _addPlatform(req, res, response);
        } else {
            systemUtils.setError(response, process.env.BAD_REQUEST_STATUS_CODE, PLATFORM_CONSTANTS.PLATFORM_VALIDATION_ERROR);
        }
    }
    systemUtils.sendIfError(res, response);
}

platformController.deletePlatform = function (req, res) {
    const response = systemUtils.getResponse(process.env.SUCCESS_STATUS_CODE);
    dbUtils.setErrorForInvalidGameId(req.params.gameId, response, GAME_CONSTANTS.GAME);
    dbUtils.setErrorForInvalidPlatformId(req.params.platformId, response);
    if (response.status === process.env.SUCCESS_STATUS_CODE) {
        _deletePlatform(req, res, response);
    } else {
        systemUtils.sendResponse(res, response);
    }
}

platformController.partialUpdatePlatform = function (req, res) {
    const response = systemUtils.getResponse(process.env.SUCCESS_STATUS_CODE, PLATFORM_CONSTANTS.PLATFORM_UPDATE_SUCCESS);
    dbUtils.setErrorForInvalidGameId(req.params.gameId, response, GAME_CONSTANTS.GAME);
    dbUtils.setErrorForInvalidPlatformId(req.params.platformId, response);
    if (response.status === process.env.SUCCESS_STATUS_CODE) {
        if (!systemUtils.isObjectEmpty(req.body) && ((req.body.name && typeof (req.body.name) == 'string') || (req.body.year && typeof (req.body.year) == 'number'))) {

            _updatePlatform(req, res, response);
        } else {
            systemUtils.setError(response, process.env.BAD_REQUEST_STATUS_CODE, PLATFORM_CONSTANTS.PLATFORM_VALIDATION_ERROR);
            systemUtils.sendResponse(res, response);
        }
    } else {
        systemUtils.sendResponse(res, response);
    }
}


platformController.fullUpdatePlatform = function (req, res) {
    const response = systemUtils.getResponse(process.env.SUCCESS_STATUS_CODE, PLATFORM_CONSTANTS.PLATFORM_UPDATE_SUCCESS);
    dbUtils.setErrorForInvalidGameId(req.params.gameId, response, GAME_CONSTANTS.GAME);
    dbUtils.setErrorForInvalidPlatformId(req.params.platformId, response);
    if (response.status === process.env.SUCCESS_STATUS_CODE) {
        if (!systemUtils.isObjectEmpty(req.body) && (req.body.name && typeof (req.body.name) == SYSTEM_CONSTANTS.STRING) && (req.body.year && typeof (req.body.year) == SYSTEM_CONSTANTS.NUMBER)) {

            _updatePlatform(req, res, response);
        } else {
            systemUtils.setError(response, process.env.BAD_REQUEST_STATUS_CODE, PLATFORM_CONSTANTS.PLATFORM_VALIDATION_ERROR);
            systemUtils.sendResponse(res, response);
        }
    } else {
        systemUtils.sendResponse(res, response);
    }
}

module.exports = platformController;