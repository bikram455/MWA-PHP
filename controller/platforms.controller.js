const platformController = {};
const dbUtils = require('../utilities/db.utils');
const systemUtils = require('../utilities/system.utils');
const GAME_CONSTANTS = require('../constants/game.constants');
const Game = require('mongoose').model(process.env.GAME_MODEL);
const PLATFORM_CONSTANTS = require('../constants/platform.constants');

platformController.getPlatforms = function(req, res) {
    if(!dbUtils.checkValidObjectId(req.params.gameId)) {
        res.status(parseInt(process.env.BAD_REQUEST_STATUS_CODE)).json({message: 'Invalid game id.'});
        return;
    }
    const response = {
        status: process.env.SUCCESS_STATUS_CODE
    };
    Game.findOne({_id: req.params.gameId}).exec(function(err, game) {
        if(err) {
            response.status = process.env.BAD_REQUEST_STATUS_CODE;
            response.body = {message: PLATFORM_CONSTANTS.PLATFORMS_GET_ERROR};
        } else {
            if(game) {
                response.body = {platforms: game['platforms']};
            } else {
                response.status = process.env.NOT_FOUND_STATUS_CODE;
                response.body = {message: GAME_CONSTANTS.GAME_NOT_FOUND};
            }
        }
        res.status(parseInt(response.status)).json(response.body);
    });
}

platformController.addPlatform = function(req, res) {
    if(!dbUtils.checkValidObjectId(req.params.gameId)) {
        res.status(parseInt(process.env.BAD_REQUEST_STATUS_CODE)).json({message: 'Invalid game id.'});
        return;
    }
    if(!systemUtils.isObjectEmpty(req.body)) {
        if(!dbUtils.isAModel(req.body, Game.schema.paths['platforms'].schema.paths)) {
            res.status(parseInt(process.env.BAD_REQUEST_STATUS_CODE)).json({message: PLATFORM_CONSTANTS.PLATFORM_VALIDATION_ERROR});
        } else {
            const response = {
                status: process.env.SUCCESS_STATUS_CODE
            };
            Game.findOne({_id: req.params.gameId}).exec(function(err, game) {
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
                            res.status(parseInt(response.status)).json(response.body);
                        });
                        return;
                    } else {
                        response.status = process.env.NOT_FOUND_STATUS_CODE;
                        response.body = {message: GAME_CONSTANTS.GAME_NOT_FOUND};
                    }
                }
                res.status(parseInt(response.status)).json(response.body);
            });
        }
        return;
    }
    res.status(parseInt(process.env.BAD_REQUEST_STATUS_CODE)).json({message: PLATFORM_CONSTANTS.PLATFORM_VALIDATION_ERROR});
}

platformController.deletePlatform = function(req, res) {
    if(!dbUtils.checkValidObjectId(req.params.gameId)) {
        res.status(parseInt(process.env.BAD_REQUEST_STATUS_CODE)).json({message: GAME_CONSTANTS.INVALID_GAME_ID});
        return;
    }

    if(!dbUtils.checkValidObjectId(req.params.platformId)) {
        res.status(parseInt(process.env.BAD_REQUEST_STATUS_CODE)).json({message: PLATFORM_CONSTANTS.INVALID_PLATFORM_ID});
        return;
    }
    const response = {
        status: process.env.SUCCESS_STATUS_CODE,
        body: {message: PLATFORM_CONSTANTS.PLATFORM_DELETE_SUCCESS}
    }
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
                    res.status(parseInt(response.status)).json(response.body);
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
        
        res.status(parseInt(response.status)).json(response.body);
    });
}

platformController.updatePlatform = function(req, res) {
    if(!dbUtils.checkValidObjectId(req.params.gameId)) {
        res.status(parseInt(process.env.BAD_REQUEST_STATUS_CODE)).json({message: GAME_CONSTANTS.INVALID_GAME_ID});
        return;
    }

    if(!dbUtils.checkValidObjectId(req.params.platformId)) {
        res.status(parseInt(process.env.BAD_REQUEST_STATUS_CODE)).json({message: PLATFORM_CONSTANTS.INVALID_PLATFORM_ID});
        return;
    }
    const response = systemUtils.getResponse(PLATFORM_CONSTANTS.PLATFORM_UPDATE_SUCCESS);
    if(!systemUtils.isObjectEmpty(req.body) && dbUtils.isAnUpdateModel(req.body, Game.schema.paths['platforms'].schema.paths)) {
        Game.findById(req.params.gameId).exec(function(err, game) {
            if(game) {
                const platform = game.platforms.id(req.params.platformId);
                if(platform) {
                    const platformBody = dbUtils.getUpdateBody(req.body, Game.schema.paths['platforms'].schema.paths);
                    platform.set(platformBody);
                    game.save(function(err, success) {
                        if(err) {
                            response.status = process.env.INTERNAL_SERVER_ERROR_STATUS_CODE;
                            response.body = {message: PLATFORM_CONSTANTS.PLATFORM_UPDATE_ERROR};  
                        }
                        res.status(parseInt(response.status)).json(response.body);
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
            res.status(parseInt(response.status)).json(response.body);
        });
        return;
    } else {
        response.status = process.env.BAD_REQUEST_STATUS_CODE;
        response.body = {error: PLATFORM_CONSTANTS.PLATFORM_UPDATE_BODY_INVALID};
    }
    res.status(parseInt(response.status)).json(response.body);
}

module.exports = platformController;