const systemUtils = {};

systemUtils.isObjectEmpty = function(data) {
    return Object.keys(data).length === 0;
}

systemUtils.getResponse = function(status, message) {
    return {
        status,
        body: {message}
    };
}

systemUtils.setError = function(response, status, error) {
    response.status = status;
    response.body = {error};
}

systemUtils.sendResponse = function(res, response) {
    res.status(parseInt(response.status)).json(response.body);
}

systemUtils.sendIfError = function(res, response) {
    if(response.status !== process.env.SUCCESS_STATUS_CODE) {
        systemUtils.sendResponse(res, response);
    }
}

systemUtils.logger = function(message) {
    if(JSON.parse(process.env.DEV_ENVIRONMENT)) {
        console.log(message);
    }
}
module.exports = Object.freeze(systemUtils);