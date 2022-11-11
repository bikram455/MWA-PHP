const platformController = {};
const dbUtils = require('../utilities/db.utils');
const systemUtils = require('../utilities/system.utils');
const GAME_CONSTANTS = require('../constants/game.constants');
const Game = require('mongoose').model(process.env.GAME_MODEL);
const SYSTEM_CONSTANTS = require('../constants/system.constants');
const PLATFORM_CONSTANTS = require('../constants/platform.constants');

const _getGameById = function(req, res, response, callback) {
    Game.findById(req.params.gameId).exec(function(err, game) {
        if(err) {
            systemUtils.setError(response, process.env.INTERNAL_SERVER_ERROR_STATUS_CODE, err);
        } else {
            if(game) {
                callback(req, res, response, game);
            } else {
                systemUtils.setError(response, process.env.NOT_FOUND_STATUS_CODE, GAME_CONSTANTS.GAME_NOT_FOUND);
            }
        }
        systemUtils.sendIfError(res, response);
    });
}

const _updatePlatform = function(res, platformBody, response, game) {
    platform.set(platformBody);
    game.save(function(err, update) {
        if(err) {
            systemUtils.setError(response, process.env.INTERNAL_SERVER_ERROR_STATUS_CODE, err);
        }
        systemUtils.sendResponse(res, response);
    });
}

const _fullUpdate = function(req, res, response, game) {
    platform = game.platforms.id(req.params.platformId);
    if(platform) {
        const platformBody = {
            name: req.body.name,
            year: req.body.year
        };
        _updatePlatform(res, platformBody, response, game);
    } else {
        systemUtils.setError(response, process.env.NOT_FOUND_STATUS_CODE, PLATFORM_CONSTANTS.PLATFORM_NOT_FOUND);
    }
}

const _partialUpdate = function(req, res, response, game) {
    platform = game.platforms.id(req.params.platformId);
    if(platform) {
        const platformBody = {
            name: req.body.name || platform.name,
            year: req.body.year || platform.year
        };
        _updatePlatform(res, platformBody, response, game);
    } else {
        systemUtils.setError(response, process.env.NOT_FOUND_STATUS_CODE, PLATFORM_CONSTANTS.PLATFORM_NOT_FOUND);
    }
}

const _addPlatform = function(req, res, response, game) {
    const platform = {
        name: req.body.name,
        year: req.body.year
    };
    game.platforms.push(platform);
    game.save(function(err, success) {
        if(err) {
            systemUtils.setError(response, process.env.INTERNAL_SERVER_ERROR_STATUS_CODE, err);
        }
        systemUtils.sendResponse(res, response);
    });
}

const _deleteGame = function(req, res, response, game) {
    const platformId = req.params.platformId;
    const platform = game.platforms.id(platformId);
    if(platform) {
        game.platforms.id(platformId).remove();
        game.save(function(err) {
            if(err) {
                systemUtils.setError(response, process.env.INTERNAL_SERVER_ERROR_STATUS_CODE, err);
            }
            systemUtils.sendResponse(res, response);
        });
    } else {
        systemUtils.setError(response, process.env.NOT_FOUND_STATUS_CODE, PLATFORM_CONSTANTS.PLATFORM_NOT_FOUND);
    }
}

const _sendPlatforms = function(req, res, response, game) {
    response.body = {data: game[PLATFORM_CONSTANTS.PLATFORMS]};
    systemUtils.sendResponse(res, response);
}

const _sendPlatform = function(req, res, response, game) {
    platform = game.platforms.id(req.params.platformId);
    if(platform) {
        response.body = {data: platform};
        systemUtils.sendResponse(res, response);
    } else {
        systemUtils.setError(response, process.env.NOT_FOUND_STATUS_CODE, PLATFORM_CONSTANTS.PLATFORM_NOT_FOUND);
    }
}

platformController.getPlatforms = function(req, res) {
    const response = systemUtils.getResponse(process.env.SUCCESS_STATUS_CODE);
    dbUtils.setErrorForInvalidGameId(req.params.gameId, response, GAME_CONSTANTS.GAME);
    if(response.status === process.env.SUCCESS_STATUS_CODE) {
        _getGameById(req, res, response, _sendPlatforms);
    }
    systemUtils.sendIfError(res, response);
}

platformController.getPlatform = function(req, res) {
    const response = systemUtils.getResponse(process.env.SUCCESS_STATUS_CODE);
    dbUtils.setErrorForInvalidGameId(req.params.gameId, response);
    dbUtils.setErrorForInvalidPlatformId(req.params.platformId, response);
    if(response.status === process.env.SUCCESS_STATUS_CODE) {
        _getGameById(req, res, response, _sendPlatform);
    }
    systemUtils.sendIfError(res, response);
}

platformController.addPlatform = function(req, res) {
    const response = systemUtils.getResponse(process.env.SUCCESS_STATUS_CODE, PLATFORM_CONSTANTS.PLATFORM_ADD_SUCCESS);
    dbUtils.setErrorForInvalidGameId(req.params.gameId, response, GAME_CONSTANTS.GAME);
    if(response.status === process.env.SUCCESS_STATUS_CODE) {
        if(!systemUtils.isObjectEmpty(req.body) && req.body.name && req.body.year) {
            _getGameById(req, res, response, _addPlatform);
        } else {
            systemUtils.setError(response, process.env.BAD_REQUEST_STATUS_CODE, PLATFORM_CONSTANTS.PLATFORM_VALIDATION_ERROR);
        }
    }
    systemUtils.sendIfError(res, response);
}

platformController.deletePlatform = function(req, res) {
    const response = systemUtils.getResponse(process.env.SUCCESS_STATUS_CODE, PLATFORM_CONSTANTS.PLATFORM_DELETE_SUCCESS);
    dbUtils.setErrorForInvalidGameId(req.params.gameId, response, GAME_CONSTANTS.GAME);
    dbUtils.setErrorForInvalidPlatformId(req.params.platformId, response);
    if(response.status === process.env.SUCCESS_STATUS_CODE) {
        _getGameById(req, res, response, _deleteGame);
    }
    systemUtils.sendIfError(res, response);
}

platformController.partialUpdatePlatform = function(req, res) {
    const response = systemUtils.getResponse(process.env.SUCCESS_STATUS_CODE, PLATFORM_CONSTANTS.PLATFORM_UPDATE_SUCCESS);
    dbUtils.setErrorForInvalidGameId(req.params.gameId, response, GAME_CONSTANTS.GAME);
    dbUtils.setErrorForInvalidPlatformId(req.params.platformId, response);
    if(response.status === process.env.SUCCESS_STATUS_CODE) { 
        if(!systemUtils.isObjectEmpty(req.body) && ((req.body.name && typeof(req.body.name) == 'string') || (req.body.year && typeof(req.body.year) == 'number'))) {
            _getGameById(req, res, response, _partialUpdate);
        } else {
            systemUtils.setError(response, process.env.BAD_REQUEST_STATUS_CODE, PLATFORM_CONSTANTS.PLATFORM_VALIDATION_ERROR);
        }
    }
    systemUtils.sendIfError(res, response);
}


platformController.fullUpdatePlatform = function(req, res) {
    const response = systemUtils.getResponse(process.env.SUCCESS_STATUS_CODE, PLATFORM_CONSTANTS.PLATFORM_UPDATE_SUCCESS);
    dbUtils.setErrorForInvalidGameId(req.params.gameId, response, GAME_CONSTANTS.GAME);
    dbUtils.setErrorForInvalidPlatformId(req.params.platformId, response);
    if(response.status === process.env.SUCCESS_STATUS_CODE) {
        if(!systemUtils.isObjectEmpty(req.body) && (req.body.name && typeof(req.body.name) == SYSTEM_CONSTANTS.STRING) && (req.body.year && typeof(req.body.year) == SYSTEM_CONSTANTS.NUMBER)) {
            _getGameById(req, res, response, _fullUpdate);
        } else {
            systemUtils.setError(response, process.env.BAD_REQUEST_STATUS_CODE, PLATFORM_CONSTANTS.PLATFORM_VALIDATION_ERROR);
        }
    }
    systemUtils.sendIfError(res, response);
}

module.exports = platformController;