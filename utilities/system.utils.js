const systemUtils = {};

systemUtils.isObjectEmpty = function(data) {
    return Object.keys(data).length === 0;
}

systemUtils.getResponse = function(message) {
    return {
        body: {message},
        status: process.env.SUCCESS_STATUS_CODE,
    };
}

systemUtils.sendResponse = function(res, response) {
    res.status(parseInt(response.status)).json(response.body);
}
module.exports = Object.freeze(systemUtils);