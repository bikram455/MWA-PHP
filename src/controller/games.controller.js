const gamesController = {};
const dbUtils = require('../utilities/db.utils');
const systemUtils = require('../utilities/system.utils');
const GAME_CONSTANTS = require('../constants/game.constants');
const Game = require('mongoose').model(process.env.GAME_MODEL);
const SYSTEM_CONSTANTS = require('../constants/system.constants');

const _mainUpdate = function(req, game) {
    return new Promise((resolve, reject) => {
        if(game) {
            dbUtils.getPartialUpdateBody(req.body, game);
            game.save()
            .then(() => resolve())
            .catch((err) => reject(err));
        } else {
            reject(GAME_CONSTANTS.GAME_NOT_FOUND);
        }
    });
}
const _updateGame = function(req, res, response) {
    Game.findById(req.params.gameId).exec()
    .then((game) => _mainUpdate(req, game))
    .catch((err) => systemUtils.setError(response, process.env.INTERNAL_SERVER_ERROR_STATUS_CODE, err))
    .finally(() => systemUtils.sendResponse(res, response));
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

const _sendGames = function(response, data) {
    response.body = {data: data[0], count: data[1]}
}

gamesController.getGames = function(req, res) {
    let offset = process.env.MIN_COUNT;
    let count = 5;
    // let count = process.env.MAX_COUNT;
    const response = systemUtils.getResponse(process.env.SUCCESS_STATUS_CODE );
    const query = {};
    if(req.query && req.query.count) {
        count = parseInt(req.query.count);
        if(count > parseInt(process.env.MAX_COUNT) || count <= parseInt(process.env.MIN_COUNT)) {
            systemUtils.setError(response, process.env.BAD_REQUEST_STATUS_CODE, SYSTEM_CONSTANTS.COUNT_INVALID);
        }
    }
    if(req.query && req.query.offset) {
        offset = parseInt(req.query.offset);
    }
    if(req.query && req.query.title) {
        query.name = new RegExp(`${req.query.title}`, 'i');
    }
    if(response.status === process.env.SUCCESS_STATUS_CODE) {console.log(query)
        const gamesPromise = Game.find(query).skip(offset).limit(count).collation({'locale':'en'}).sort({name: 1}).exec();
        const countPromise = Game.find(query).count();
        Promise.all([gamesPromise, countPromise]).then((data) => _sendGames(response, data))
        .catch((err) => systemUtils.setError(response, process.env.INTERNAL_SERVER_ERROR_STATUS_CODE, err))
        .finally(() => systemUtils.sendResponse(res, response));
    } 
    systemUtils.sendIfError(res, response);
}

const _sendGame = function(response, game) {
    if(!game) {
        systemUtils.setError(response, process.env.BAD_REQUEST_STATUS_CODE, GAME_CONSTANTS.GAME_NOT_FOUND);                    
    } else {
        response.body = {data: game['_doc']};
    }
}
gamesController.getGame = function(req, res) {
    const response = systemUtils.getResponse(process.env.SUCCESS_STATUS_CODE );
    dbUtils.setErrorForInvalidGameId(req.params.gameId, response);
    if(req.body && response.status === process.env.SUCCESS_STATUS_CODE) {
        Game.findById(req.params.gameId).exec().then((game) => _sendGame(response, game))
        .catch((err) => systemUtils.setError(response, process.env.INTERNAL_SERVER_ERROR_STATUS_CODE, err))
        .finally(() => systemUtils.sendResponse(res, response));
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
        Game.create(game)
        .catch((err) => systemUtils.setError(response, process.env.INTERNAL_SERVER_ERROR_STATUS_CODE, err))
        .finally(() => systemUtils.sendResponse(res, response));
    }
    systemUtils.sendIfError(res, response);
};

gamesController.deleteGame = function(req, res) {
    const response = systemUtils.getResponse(process.env.SUCCESS_STATUS_CODE, GAME_CONSTANTS.GAME_DELETE_SUCCESS);
    dbUtils.setErrorForInvalidGameId(req.params.gameId, response);
    if(response.status === process.env.SUCCESS_STATUS_CODE) {
        Game.deleteOne({'_id': req.params.gameId}).exec()
        .then((success) => {
            if(success['deletedCount'] === 0) {
                systemUtils.setError(response, process.env.NOT_FOUND_STATUS_CODE, GAME_CONSTANTS.GAME_NOT_FOUND);
            }
        })
        .catch((err) => systemUtils.setError(response, process.env.INTERNAL_SERVER_ERROR_STATUS_CODE, err))
        .finally(() => systemUtils.sendResponse(res, response));
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