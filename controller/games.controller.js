const gamesController = {};
const dbUtils = require('../utilities/db.utils');
const systemUtils = require('../utilities/system.utils');
const GAME_CONSTANTS = require('../constants/game.constants');
const Game = require('mongoose').model(process.env.GAME_MODEL);

gamesController.getGames = function(req, res) {
    const response = systemUtils.getResponse();
    Game.find().exec(function(err, games) {
        if(err) {
            response.body = {error: err};
        } else {
            response.body = {games};
        }
        systemUtils.sendResponse(res, response);
    });
}

gamesController.getGame = function(req, res) {
    if(!dbUtils.checkValidObjectId(req.params.gameId)) {
        res.status(parseInt(process.env.BAD_REQUEST_STATUS_CODE)).json({message: GAME_CONSTANTS.INVALID_GAME_ID});
    } else {
        const response = systemUtils.getResponse();
        Game.findById(req.params.gameId).exec(function(err, game) {
            if(err) {
                response.status = process.env.BAD_REQUEST_STATUS_CODE;
                response.body = {error: GAME_CONSTANTS.GAMEID_REQUIRED};
            } else {
                if(!game) {
                    response.status = process.env.BAD_REQUEST_STATUS_CODE;
                    response.body = {error: GAME_CONSTANTS.GAME_NOT_FOUND};
                } else {
                    response.body = {game: game['_doc']};
                }
            }
            systemUtils.sendResponse(res, response);
        });
    }
}

gamesController.addgame = function(req, res) {
    const response = systemUtils.getResponse(GAME_CONSTANTS.GAME_ADD_SUCCESS);
    if(systemUtils.isObjectEmpty(req.body) || !dbUtils.isAModel(req.body, Game.schema.paths)) {
        response.status = process.env.BAD_REQUEST_STATUS_CODE;
        response.body = {error: GAME_CONSTANTS.GAME_VALIDATION_ERROR};
        systemUtils.sendResponse(res, response);
    } else {
        const game = {
            name: req.body.name,
            publisher: req.body.publisher,
            platforms: req.body.platforms
        };
        const body = new Game(game);
        body.save(function(err, success) {
            if(err) {
                response.status = process.env.INTERNAL_SERVER_ERROR_STATUS_CODE;
                response.body = {error: GAME_CONSTANTS.GAME_ADD_FAIL};
            } 
            systemUtils.sendResponse(res, response);
        });
    }
};

gamesController.deleteGame = function(req, res) {
    if(!dbUtils.checkValidObjectId(req.params.gameId)) {
        res.status(parseInt(process.env.BAD_REQUEST_STATUS_CODE)).json({message: GAME_CONSTANTS.INVALID_GAME_ID});
    } else {
        const response = systemUtils.getResponse(GAME_CONSTANTS.GAME_DELETE_SUCCESS);
        Game.deleteOne({'_id': req.params.gameId}).exec(function(err, success) {
            if(err) {
                response.status = process.env.INTERNAL_SERVER_ERROR_STATUS_CODE;
                response.body = {error: GAME_CONSTANTS.GAME_DELETE_ERROR};
            } else if(success['deletedCount'] === 0) {
                response.status = parseInt(process.env.NOT_FOUND_STATUS_CODE);
                response.body =  {error: GAME_CONSTANTS.GAME_NOT_FOUND};
            }
            res.status(parseInt(response.status)).json(response.body);
        });
    }
}

gamesController.updateGame = function(req, res) {
    const response = systemUtils.getResponse(GAME_CONSTANTS.GAME_UDATE_SUCCESS);
    if(!dbUtils.checkValidObjectId(req.params.gameId)) {
        response.status = process.env.BAD_REQUEST_STATUS_CODE;
        response.body = {error: GAME_CONSTANTS.INVALID_GAME_ID};
    } else {
        if(!systemUtils.isObjectEmpty(req.body) && dbUtils.isAnUpdateModel(req.body, Game.schema.paths)) {
            const gameBody = dbUtils.getUpdateBody(req.body, Game.schema.paths);
            Game.findByIdAndUpdate(req.params.gameId, gameBody).exec(function(err, game) {
                if(!err) {
                    if(game) {
                        response.body = {message: GAME_CONSTANTS.GAME_UPDATE_SUCCESS};
                    } else {
                        response.status = process.env.BAD_REQUEST_STATUS_CODE;
                        response.body = {error: GAME_CONSTANTS.GAME_NOT_FOUND};
                    }
                } else {
                    response.status = process.env.INTERNAL_SERVER_ERROR_STATUS_CODE;
                    response.body = {error: GAME_CONSTANTS.GAME_UPDATE_ERROR};
                }
                systemUtils.sendResponse(res, response);
            });
            return;
        } else {
            response.status = process.env.BAD_REQUEST_STATUS_CODE;
            response.body = {message: GAME_CONSTANTS.GAME_UPDATE_BODY_INVALID};
        }
    }
    systemUtils.sendResponse(res, response);
}

module.exports = gamesController;