const systemUtils = {};

systemUtils.isObjectEmpty = function(data) {
    return Object.keys(data).length === 0;
}

module.exports = systemUtils;