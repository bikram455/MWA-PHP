const platformController = {};
const dbUtils = require('../utilities/db.utils');
const systemUtils = require('../utilities/system.utils');
const GAME_CONSTANTS = require('../constants/game.constants');
const Game = require('mongoose').model(process.env.GAME_MODEL);
const SYSTEM_CONSTANTS = require('../constants/system.constants');
const PLATFORM_CONSTANTS = require('../constants/platform.constants');

platformController.getPlatforms = function(req, res) {
    const response = systemUtils.getResponse();
    if(!dbUtils.checkValidObjectId(req.params.gameId)) {
        response.status = process.env.BAD_REQUEST_STATUS_CODE;
        response.body = {message: GAME_CONSTANTS.INVALID_GAME_ID};
        systemUtils.sendResponse(res, response);
    } else {
        Game.findById(req.params.gameId).exec(function(err, game) {
            if(err) {
                response.status = process.env.BAD_REQUEST_STATUS_CODE;
                response.body = {message: PLATFORM_CONSTANTS.PLATFORMS_GET_ERROR};
            } else {
                if(game) {
                    let offset = 0;
                    let count = 10;
                    let validCount = true;
                    if(req.query && req.query.count) {
                        count = parseInt(req.query.count);
                        if(count > 10) {
                            validCount = false;
                            response.status = process.env.BAD_REQUEST_STATUS_CODE;
                            response.body = {message: SYSTEM_CONSTANTS.COUNT_EXCEEDED};
                        }
                    }
                    if(req.query && req.query.offset) {
                        offset = count * parseInt(req.query.offset);
                    }
                    if(validCount) {
                        response.body = {platforms: game[PLATFORM_CONSTANTS.PLATFORMS].slice(offset, offset + count)};
                    }
                } else {
                    response.status = process.env.NOT_FOUND_STATUS_CODE;
                    response.body = {message: GAME_CONSTANTS.GAME_NOT_FOUND};
                }
            }
            systemUtils.sendResponse(res, response);
        });
    }
}

platformController.addPlatform = function(req, res) {
    const response = systemUtils.getResponse();
    if(!dbUtils.checkValidObjectId(req.params.gameId)) {
        response.status = process.env.BAD_REQUEST_STATUS_CODE;
        response.body = {message: GAME_CONSTANTS.INVALID_GAME_ID};
    } else {
        if(systemUtils.isObjectEmpty(req.body) || (!dbUtils.isAModel(req.body, Game.schema.paths[PLATFORM_CONSTANTS.PLATFORMS].schema.paths))) {
            response.status = process.env.BAD_REQUEST_STATUS_CODE;
            response.body = {message: PLATFORM_CONSTANTS.PLATFORM_VALIDATION_ERROR};
        } else {
            Game.findById(req.params.gameId).exec(function(err, game) {
                if(err) {
                    response.status = process.env.BAD_REQUEST_STATUS_CODE;
                    response.body = {message: PLATFORM_CONSTANTS.PLATFORMS_GET_ERROR};
                } else {
                    if(game) {
                        const platform = {
                            name: req.body.name,
                            year: req.body.year
                        };
                        game.platforms.push(platform);
                        game.save(function(err, success) {
                            if(err) {
                                response.status = process.env.INTERNAL_SERVER_ERROR_STATUS_CODE;
                                response.body = {message: PLATFORM_CONSTANTS.PLATFORM_ADD_ERROR};  
                            } else {
                                response.body = {message: PLATFORM_CONSTANTS.PLATFORM_ADD_SUCCESS};
                            }
                            systemUtils.sendResponse(res, response);
                        });
                        return;
                    } else {
                        response.status = process.env.NOT_FOUND_STATUS_CODE;
                        response.body = {message: GAME_CONSTANTS.GAME_NOT_FOUND};
                    }
                }
                systemUtils.sendResponse(res, response);
            });
            return;
        }
    }
    systemUtils.sendResponse(res, response);
}

platformController.deletePlatform = function(req, res) {
    const response = systemUtils.getResponse(PLATFORM_CONSTANTS.PLATFORM_DELETE_SUCCESS);
    if(!dbUtils.checkValidObjectId(req.params.gameId)) {
        response.status = process.env.BAD_REQUEST_STATUS_CODE;
        response.body = {error: GAME_CONSTANTS.INVALID_GAME_ID};
    } else if(!dbUtils.checkValidObjectId(req.params.platformId)) {
        response.status = process.env.BAD_REQUEST_STATUS_CODE;
        response.body = {error: PLATFORM_CONSTANTS.INVALID_PLATFORM_ID};
    } else {
        Game.findById(req.params.gameId).exec(function(err, game) {
            if(err) {
                response.status = process.env.INTERNAL_SERVER_ERROR_STATUS_CODE;
                response.body = {message: PLATFORM_CONSTANTS.PLATFORM_DELETE_ERROR};  
            }
            if(game) {
                const platform = game.platforms.id(req.params.platformId);
                if(platform) {
                    game.platforms.id(req.params.platformId).remove();
                    game.save(function(err) {
                        if(err) {
                            response.status = process.env.INTERNAL_SERVER_ERROR_STATUS_CODE;
                            response.body = {message: PLATFORM_CONSTANTS.PLATFORM_DELETE_ERROR};  
                        }
                        systemUtils.sendResponse(res, response);
                    });
                    return;
                } else {
                    response.status = process.env.NOT_FOUND_STATUS_CODE;
                    response.body = {message: PLATFORM_CONSTANTS.PLATFORM_NOT_FOUND};  
                }
            } else {
                response.status = process.env.NOT_FOUND_STATUS_CODE;
                response.body = {message: GAME_CONSTANTS.GAME_NOT_FOUND};
            }
            systemUtils.sendResponse(res, response);
        });
        return;
    }
    systemUtils.sendResponse(res, response);
}

platformController.updatePlatform = function(req, res) {
    const response = systemUtils.getResponse(PLATFORM_CONSTANTS.PLATFORM_UPDATE_SUCCESS);
    if(!dbUtils.checkValidObjectId(req.params.gameId)) {
        response.status = process.env.BAD_REQUEST_STATUS_CODE;
        response.body = {message: GAME_CONSTANTS.INVALID_GAME_ID};
    } else if(!dbUtils.checkValidObjectId(req.params.platformId)) {
        response.status = process.env.BAD_REQUEST_STATUS_CODE;
        response.body = {message: PLATFORM_CONSTANTS.INVALID_PLATFORM_ID};
    } else {
        if(!systemUtils.isObjectEmpty(req.body) && dbUtils.isAnUpdateModel(req.body, Game.schema.paths[PLATFORM_CONSTANTS.PLATFORMS].schema.paths)) {
            Game.findById(req.params.gameId).exec(function(err, game) {
                if(game) {
                    const platform = game.platforms.id(req.params.platformId);
                    if(platform) {
                        const platformBody = dbUtils.getUpdateBody(req.body, Game.schema.paths[PLATFORM_CONSTANTS.PLATFORMS].schema.paths);
                        platform.set(platformBody);
                        game.save(function(err, success) {
                            if(err) {
                                response.status = process.env.INTERNAL_SERVER_ERROR_STATUS_CODE;
                                response.body = {message: PLATFORM_CONSTANTS.PLATFORM_UPDATE_ERROR};  
                            }
                            systemUtils.sendResponse(res, response);
                        });
                        return;
                    } else {
                        response.status = process.env.NOT_FOUND_STATUS_CODE;
                        response.body = {message: PLATFORM_CONSTANTS.PLATFORM_NOT_FOUND};
                    }
                } else {
                    response.status = process.env.NOT_FOUND_STATUS_CODE;
                    response.body = {message: GAME_CONSTANTS.GAME_NOT_FOUND};
                }
                systemUtils.sendResponse(res, response);
            });
            return;
        } else {
            response.status = process.env.BAD_REQUEST_STATUS_CODE;
            response.body = {error: PLATFORM_CONSTANTS.PLATFORM_UPDATE_BODY_INVALID};
        }
    }
    systemUtils.sendResponse(res, response);
}

module.exports = platformController;