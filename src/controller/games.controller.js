const gamesController = {};
const dbUtils = require('../utilities/db.utils');
const systemUtils = require('../utilities/system.utils');
const GAME_CONSTANTS = require('../constants/game.constants');
const Game = require('mongoose').model(process.env.GAME_MODEL);
const SYSTEM_CONSTANTS = require('../constants/system.constants');

const _updateGame = function(req, res, response) {
    Game.findById(req.params.gameId).exec(function(err, game) {
        if(err) {
            systemUtils.setError(response, process.env.INTERNAL_SERVER_ERROR_STATUS_CODE, err);
        }
        if(game) {
            dbUtils.getPartialUpdateBody(req.body, game);
            game.save(function(err, updateGame){
                if(err) {
                    systemUtils.setError(response, process.env.INTERNAL_SERVER_ERROR_STATUS_CODE, err);
                }
                systemUtils.sendResponse(res, response);
            });
        } else {
            systemUtils.setError(response, process.env.BAD_REQUEST_STATUS_CODE, GAME_CONSTANTS.GAME_NOT_FOUND);
        }
        systemUtils.sendIfError(res, response);
    });
}

const _partialUpdate = function(req, res, response) {
    if(!req.body.name && !req.body.publisher) {
        systemUtils.setError(response, process.env.BAD_REQUEST_STATUS_CODE, GAME_CONSTANTS.GAME_UPDATE_BODY_INVALID);
    } else {
        _updateGame(req, res, response);
    }
}

const _fullUpdate = function(req, res, response) {
    if(!req.body.name || !req.body.publisher) {
        systemUtils.setError(response, process.env.BAD_REQUEST_STATUS_CODE, GAME_CONSTANTS.GAME_UPDATE_BODY_INVALID);
    } else {
        _updateGame(req, res, response);
    }
}

const _checkAndUpdateGame = function(req, res, updateFunction) {
    const response = systemUtils.getResponse(process.env.SUCCESS_STATUS_CODE, GAME_CONSTANTS.GAME_UPDATE_SUCCESS);
    dbUtils.setErrorForInvalidGameId(req.params.gameId, response);
    if(req.body && response.status === process.env.SUCCESS_STATUS_CODE) {
        updateFunction(req, res, response);
    }
    systemUtils.sendIfError(res, response);
}

gamesController.getGames = function(req, res) {
    let offset = process.env.MIN_COUNT;
    let count = process.env.MAX_COUNT;
    const response = systemUtils.getResponse(process.env.SUCCESS_STATUS_CODE );
    if(req.query && req.query.count) {
        count = parseInt(req.query.count);
        if(count > parseInt(process.env.MAX_COUNT) || count <= parseInt(process.env.MIN_COUNT)) {
            systemUtils.setError(response, process.env.BAD_REQUEST_STATUS_CODE, SYSTEM_CONSTANTS.COUNT_INVALID);
        }
    }
    if(req.query && req.query.offset) {
        offset = parseInt(req.query.offset);
    }
    if(response.status === process.env.SUCCESS_STATUS_CODE) {
        Game.find().skip(offset).limit(count).exec(function(err, games) {
            if(err) {
                systemUtils.setError(response, process.env.INTERNAL_SERVER_ERROR_STATUS_CODE, err);
            } else {
                response.body = {data: games};
            }
            systemUtils.sendResponse(res, response);
        });
    } 
    systemUtils.sendIfError(res, response);
}

gamesController.getGame = function(req, res) {
    const response = systemUtils.getResponse(process.env.SUCCESS_STATUS_CODE );
    dbUtils.setErrorForInvalidGameId(req.params.gameId, response);
    if(req.body && response.status === process.env.SUCCESS_STATUS_CODE) {
        Game.findById(req.params.gameId).exec(function(err, game) {
            if(err) {
                systemUtils.setError(response, process.env.INTERNAL_SERVER_ERROR_STATUS_CODE, err);
            } else {
                if(!game) {
                    systemUtils.setError(response, process.env.BAD_REQUEST_STATUS_CODE, GAME_CONSTANTS.GAME_NOT_FOUND);                    
                } else {
                    response.body = {data: game['_doc']};
                }
            }
            systemUtils.sendResponse(res, response);
        });
    }
    systemUtils.sendIfError(res, response);
}

gamesController.addgame = function(req, res) {
    const response = systemUtils.getResponse(process.env.SUCCESS_STATUS_CODE, GAME_CONSTANTS.GAME_ADD_SUCCESS);
    if(!req.body.name || !req.body.publisher) {
        systemUtils.setError(response, process.env.BAD_REQUEST_STATUS_CODE, GAME_CONSTANTS.GAME_VALIDATION_ERROR);
    } else {
        const game = {
                    name: req.body.name,
                    publisher: req.body.publisher,
                    platforms: req.body.platforms
        };
        Game.create(game, function(err, addedGame) {
            if(err) {
                systemUtils.setError(response, process.env.INTERNAL_SERVER_ERROR_STATUS_CODE, err);
            }
            systemUtils.sendResponse(res, response);
        });
    }
    systemUtils.sendIfError(res, response);
};

gamesController.deleteGame = function(req, res) {
    const response = systemUtils.getResponse(process.env.SUCCESS_STATUS_CODE, GAME_CONSTANTS.GAME_DELETE_SUCCESS);
    dbUtils.setErrorForInvalidGameId(req.params.gameId, response);
    if(response.status === process.env.SUCCESS_STATUS_CODE) {
        Game.deleteOne({'_id': req.params.gameId}).exec(function(err, success) {
            if(err) {
                systemUtils.setError(response, process.env.INTERNAL_SERVER_ERROR_STATUS_CODE, err);
            } else if(success['deletedCount'] === 0) {
                systemUtils.setError(response, process.env.NOT_FOUND_STATUS_CODE, GAME_CONSTANTS.GAME_NOT_FOUND);
            }
            systemUtils.sendResponse(res, response);
        });
    }
    systemUtils.sendIfError(res, response);
}

gamesController.fullUpdateGame = function(req, res) {
    _checkAndUpdateGame(req, res, _fullUpdate);
}

gamesController.partialUpdateGame = function(req, res) {
    _checkAndUpdateGame(req, res, _partialUpdate);
}

module.exports = gamesController;