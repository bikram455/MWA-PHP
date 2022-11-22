const authController = {};
const util = require('util');
const jwt = require('jsonwebtoken');
const sysUtils = require('../utilities/system.utils');
const USERS_CONSTANTS = require('../constants/users.constants');

const _requireAuthentication = function(req) {
    let methods = process.env.METHODS.split(',');
    const pos = methods.indexOf(process.env.GET);
    methods.splice(pos, 1);
    if(req.url.includes(process.env.LOGIN_ROUTE) || req.url.includes(process.env.REGISTER_ROUTE)) {
        return false;
    }
    return methods.indexOf(req.method) !== -1;
}

authController.authenticate = function(req, res, next) {
    const response = sysUtils.getResponse();
    let token;
    if(req.headers.authorization) {
        token = req.headers.authorization.split(' ')[1];
    }
    if(_requireAuthentication(req)) {
        if(token) {
            const jwtVerifyPromise = util.promisify(jwt.verify, {context: jwt});
            jwtVerifyPromise(token, process.env.JWT_PASSWORD)
            .then(() => next())
            .catch((err) => {
                sysUtils.setError(response, process.env.BAD_REQUEST_STATUS_CODE, USERS_CONSTANTS.INVALID_TOKEN);
                sysUtils.sendResponse(res, response);    
            });
        } else {
            sysUtils.setError(response, process.env.BAD_REQUEST_STATUS_CODE, USERS_CONSTANTS.NO_AUTHENTICATION_HEADER);
            sysUtils.sendResponse(res, response);
        }
    } else {
        next();
    }
    // if(headerExists) {
    //     const token = req.headers.authorization.split(' ')[1];
    //     const jwtVerifyPromise = util.promisify(jwt.verify, {context: jwt});
        
    //         jwtVerifyPromise(token, process.env.JWT_PASSWORD)
    //         .then(() => next())
    //         .catch((err) => {
    //             sysUtils.setError(response, process.env.BAD_REQUEST_STATUS_CODE, USERS_CONSTANTS.INVALID_TOKEN);
    //             sysUtils.sendResponse(res, response);    
    //         });
    // } else {
    //     sysUtils.setError(response, process.env.BAD_REQUEST_STATUS_CODE, USERS_CONSTANTS.NO_AUTHENTICATION_HEADER);
    //     sysUtils.sendResponse(res, response);
    // }
}

module.exports = authController;
