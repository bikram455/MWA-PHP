const SYSTEM_CONSTANTS = require('../constants/system.constants');

const objectId = require('mongoose').Types.ObjectId;

const dbUtils = {};
dbUtils.checkValidObjectId = function(id) {
    return objectId.isValid(id);
}

dbUtils.isAModel = function(data, schema) {
    let isModel = true;
    for(key in schema) {
        const validators = schema[key]['validators'];
        if(validators && validators.length > 0) {
            if(validators[0]['type'] === SYSTEM_CONSTANTS.REQUIRED && !data[key]) {
                isModel = false;
            }
        }
    }
    return isModel;
}

module.exports = dbUtils;
