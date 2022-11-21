const gamesController = {};
const dbUtils = require('../utilities/db.utils');
const systemUtils = require('../utilities/system.utils');
const GAME_CONSTANTS = require('../constants/game.constants');
const Game = require('mongoose').model(process.env.GAME_MODEL);
const SYSTEM_CONSTANTS = require('../constants/system.constants');

const _saveGame = function (game) {
    return new Promise((resolve, reject) => {
        game.save()
            .then(res => resolve(res))
            .catch(err => reject({ status: process.env.INTERNAL_SERVER_ERROR_STATUS_CODE, error: err }))
    });
}

const _getGameById = function (gameId) {
    return new Promise((resolve, reject) => {
        Game.findById(gameId).exec()
            .then(game => {
                if (game) {
                    resolve(game);
                } else {
                    reject({ status: process.env.NOT_FOUND_STATUS_CODE, error: GAME_CONSTANTS.GAME_NOT_FOUND });
                }
            })
            .catch(err => reject({ status: process.env.INTERNAL_SERVER_ERROR_STATUS_CODE, error: err }))
    });
}

const _updateGame = function (req, res, response) {
    _getGameById(req.params.gameId)
        .then(game => {
            if (game) {
                game.set({ name: req.body.name || game.name, publisher: req.body.publisher || game.publisher })
                _saveGame(game);
            } else {
                throw ({ status: process.env.NOT_FOUND_STATUS_CODE, error: GAME_CONSTANTS.GAME_NOT_FOUND })
            }
        })
        .then(game => response.status = 204)
        .catch(err => systemUtils.setError(response, err.status, err.error))
        .finally(() => systemUtils.sendResponse(res, response));
}

const _partialUpdate = function (req, res, response) {
    if (!req.body.name && !req.body.publisher) {
        systemUtils.setError(response, process.env.BAD_REQUEST_STATUS_CODE, GAME_CONSTANTS.GAME_UPDATE_BODY_INVALID);
        systemUtils.sendResponse(res, response);
    } else {
        _updateGame(req, res, response);
    }
}

const _fullUpdate = function (req, res, response) {
    if (!req.body.name || !req.body.publisher) {
        systemUtils.setError(response, process.env.BAD_REQUEST_STATUS_CODE, GAME_CONSTANTS.GAME_UPDATE_BODY_INVALID);
    } else {
        _updateGame(req, res, response);
    }
}

const _checkAndUpdateGame = function (req, res, updateFunction) {
    const response = systemUtils.getResponse(process.env.SUCCESS_STATUS_CODE, GAME_CONSTANTS.GAME_UPDATE_SUCCESS);
    dbUtils.setErrorForInvalidGameId(req.params.gameId, response);
    if (req.body && response.status === process.env.SUCCESS_STATUS_CODE) {
        updateFunction(req, res, response);
    } else {
        systemUtils.sendResponse(res, response);
    }
}

const _sendGames = function (response, data) {
    response.body = { data: data[0], count: data[1] }
}

gamesController.getGames = function (req, res) {
    let offset = process.env.MIN_COUNT;
    let count = 5;
    // let count = process.env.MAX_COUNT;
    const response = systemUtils.getResponse(process.env.SUCCESS_STATUS_CODE);
    const query = {};
    if (req.query && req.query.count) {
        count = parseInt(req.query.count);
        if (count > parseInt(process.env.MAX_COUNT) || count <= parseInt(process.env.MIN_COUNT)) {
            systemUtils.setError(response, process.env.BAD_REQUEST_STATUS_CODE, SYSTEM_CONSTANTS.COUNT_INVALID);
        }
    }
    if (req.query && req.query.offset) {
        offset = parseInt(req.query.offset);
    }
    if (req.query && req.query.title) {
        query.name = new RegExp(`${req.query.title}`, 'i');
    }
    if (response.status === process.env.SUCCESS_STATUS_CODE) {
        const gamesPromise = Game.find(query).skip(offset).limit(count).collation({ 'locale': 'en' }).sort({ name: 1 }).exec();
        const countPromise = Game.find(query).count();
        Promise.all([gamesPromise, countPromise]).then((data) => _sendGames(response, data))
            .catch((err) => systemUtils.setError(response, process.env.INTERNAL_SERVER_ERROR_STATUS_CODE, err))
            .finally(() => systemUtils.sendResponse(res, response));
    }
    systemUtils.sendIfError(res, response);
}

gamesController.getGame = function (req, res) {
    const response = systemUtils.getResponse(process.env.SUCCESS_STATUS_CODE);
    dbUtils.setErrorForInvalidGameId(req.params.gameId, response);
    if (req.body && response.status === process.env.SUCCESS_STATUS_CODE) {
        _getGameById(req.params.gameId)
            .then(game => response.body = { data: game['_doc'] })
            .catch((err) => systemUtils.setError(response, err.status, err.error))
            .finally(() => systemUtils.sendResponse(res, response));
    } else {
        systemUtils.sendResponse(res, response);
    }
}

gamesController.addgame = function (req, res) {
    const response = systemUtils.getResponse(process.env.SUCCESS_STATUS_CODE, GAME_CONSTANTS.GAME_ADD_SUCCESS);
    if (!req.body.name || !req.body.publisher) {
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

gamesController.deleteGame = function (req, res) {
    const response = systemUtils.getResponse(process.env.SUCCESS_STATUS_CODE, GAME_CONSTANTS.GAME_DELETE_SUCCESS);
    dbUtils.setErrorForInvalidGameId(req.params.gameId, response);
    if (response.status === process.env.SUCCESS_STATUS_CODE) {
        Game.deleteOne({ '_id': req.params.gameId }).exec()
            .then((success) => {
                if (success['deletedCount'] === 0) {
                    systemUtils.setError(response, process.env.NOT_FOUND_STATUS_CODE, GAME_CONSTANTS.GAME_NOT_FOUND);
                }
            })
            .catch((err) => systemUtils.setError(response, process.env.INTERNAL_SERVER_ERROR_STATUS_CODE, err))
            .finally(() => systemUtils.sendResponse(res, response));
    }
    systemUtils.sendIfError(res, response);
}

gamesController.fullUpdateGame = function (req, res) {
    _checkAndUpdateGame(req, res, _fullUpdate);
}

gamesController.partialUpdateGame = function (req, res) {
    _checkAndUpdateGame(req, res, _partialUpdate);
}

module.exports = gamesController;