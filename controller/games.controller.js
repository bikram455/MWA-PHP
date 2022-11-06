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
            console.log('is not a model');
        } else {
            console.log('is a model');
        }
        // if()
        // const game = {
        //     name: req.body.name,
        //     company: req.body.company,
        //     platforms: req.body.platforms
        // };
        // const body = new Game(game);
        // body.save(function(err, success) {
        //     if(err) {
        //         console.log('Error is: ', err, Object.keys(err), err['errors']);
        //     } else {
        //         console.log('Success: ', success)
        //     }
        // });
        // console.log('hello: ', );
        // Game.create({}).exec(function(err, data) {
        //     if(err) console.error('Error is: ', err['_message']);
        //     else console.log(data);
        // });
    }
    console.log('exit add game')
    res.send('test')
};

module.exports = gamesController;