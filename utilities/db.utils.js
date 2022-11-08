const objectId = require('mongoose').Types.ObjectId;
const systemUtils = require('../utilities/system.utils');
const GAME_CONSTANTS = require('../constants/game.constants');
const SYSTEM_CONSTANTS = require('../constants/system.constants');

const dbUtils = {};
dbUtils.checkValidObjectId = function(id) {
    return objectId.isValid(id);
}

dbUtils.isAModel = function(data, schema) {
    let isModel = true;
    for(key in schema) {
        const validators = schema[key]['validators'];
        if(validators && validators.length > 0) {
            if((validators[0]['type'] === SYSTEM_CONSTANTS.REQUIRED && !data[key]) || (schema[key]['instance'].toLowerCase() != typeof(data[key]))){
                isModel = false;
            }
        }
    }
    return isModel;
}

dbUtils.isAnUpdateModel = function(data, schema) {
    let isModel = true;
    let count = 0;
    for(key in schema) {
        const validators = schema[key]['validators'];
        if(validators && validators.length > 0) {
            if(data[key]){
                ++count;
                if((schema[key]['instance'].toLowerCase() !== typeof(data[key]))){
                    isModel = false;
                } else {
                    if(key === 'year' && !(data[key] <= 2022 && data[key] >= 1980)) {
                        isModel = false;
                    }
                }
            }
        }
    }
    return isModel && (count > 0);
}

dbUtils.getUpdateBody = function(data, schema) {
    const updateGame = {};
    for(key in schema) {
        if(data[key]){
            updateGame[key] = data[key];
        }
    }
    return updateGame;
}

dbUtils.getPartialUpdateBody = function(data, body) {
    for(key in data) {
        body[key] = data[key];
    }
    return body;
}

dbUtils.setErrorForInvalidGameId = function(gameId, response) {
    if(!dbUtils.checkValidObjectId(gameId)){
        systemUtils.setError(response, process.env.BAD_REQUEST_STATUS_CODE, GAME_CONSTANTS.INVALID_GAME_ID);
    }
}

module.exports = Object.freeze(dbUtils);
