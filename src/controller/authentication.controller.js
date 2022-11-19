const authController = {};
const util = require('util');
const jwt = require('jsonwebtoken');
const sysUtils = require('../utilities/system.utils');

authController.authenticate = function(req, res, next) {
    const response = sysUtils.getResponse(process.env.SUCCESS_STATUS_CODE);
    const headerExists = req.headers.authorization;
    if(headerExists) {
        const token = req.headers.authorization.split(' ')[1];
        const jwtVerifyPromise = util.promisify(jwt.verify, {context: jwt});

        jwtVerifyPromise(token, process.env.JWT_PASSWORD)
        .then(() => next())
        .catch((err) => {
            sysUtils.setError(response, process.env.BAD_REQUEST_STATUS_CODE, 'Invalid token provided!');
            sysUtils.sendResponse(res, response);    
        });
    } else {
        sysUtils.setError(response, process.env.BAD_REQUEST_STATUS_CODE, 'No authentication header provided!');
        sysUtils.sendResponse(res, response);
    }
}

module.exports = authController;
