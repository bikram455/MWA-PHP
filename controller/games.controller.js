const dbUtils = require('../utilities/db.utils');
const systemUtils = require('../utilities/system.utils');
const Game = require('mongoose').model(process.env.GAME_MODEL);
const SYSTEM_CONSTANTS = require('../constants/system.constants');
const gamesController = {};

gamesController.getGames = function(req, res) {
    const response = {
        status: parseInt(process.env.SUCCESS_STATUS_CODE)
    };
    Game.find().exec(function(err, games) {
        if(err) {
            response.body = err;
        } else {
            response.body = games;
        }
        res.status(response.status).json({games: response.body});
    });
}

gamesController.getGame = function(req, res) {
    if(!dbUtils.checkValidObjectId(req.params.gameId)) {
        res.status(parseInt(process.env.BAD_REQUEST_STATUS_CODE)).json({message: 'Invalid game id.'});
        return;
    }
    
    const response = {
        status: parseInt(process.env.SUCCESS_STATUS_CODE)
    };
    Game.findById(req.params.gameId).exec(function(err, game) {
        if(err) {
            response.status = parseInt(process.env.BAD_REQUEST_STATUS_CODE);
            response.body = {'error': SYSTEM_CONSTANTS.GAMEID_REQUIRED};
        } else {
            if(!game) {
                response.status = parseInt(process.env.BAD_REQUEST_STATUS_CODE);
                response.body = {'error': SYSTEM_CONSTANTS.GAME_NOT_FOUND};
            } else {
                response.body = game['_doc'];
            }
        }
        res.status(response.status).json(response.body);
    });
}

gamesController.addgame = function(req, res) {
    if(!systemUtils.isObjectEmpty(req.body)) {
        if(!dbUtils.isAModel(req.body, Game.schema.paths)) {
            res.status(parseInt(process.env.BAD_REQUEST_STATUS_CODE)).json({message: SYSTEM_CONSTANTS.GAME_VALIDATION_ERROR});
        } else {
            const response = {
                status: parseInt(process.env.SUCCESS_STATUS_CODE),
                message: SYSTEM_CONSTANTS.GAME_ADD_SUCCESS
            };
            const game = {
                name: req.body.name,
                publisher: req.body.publisher,
                platforms: req.body.platforms
            };
            const body = new Game(game);
            body.save(function(err, success) {
                if(err) {
                    response.status = process.env.INTERNAL_SERVER_ERROR_STATUS_CODE;
                    response.message = SYSTEM_CONSTANTS.GAME_ADD_FAIL;
                } 
                res.status(response.status).json({message: response.message});
            });
        }
        return;
    }
    res.status(parseInt(process.env.BAD_REQUEST_STATUS_CODE)).json({message: SYSTEM_CONSTANTS.GAME_VALIDATION_ERROR});
};

module.exports = gamesController;