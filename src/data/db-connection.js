require('./db-models');
const mongoose = require('mongoose');
const sysUtils = require('../utilities/system.utils');
const SYSTEM_CONSTANTS = require('../constants/system.constants');

mongoose.connect(process.env.DB_CONNECTION_STRING);

mongoose.connection.on('connected', function() {
    sysUtils.logger(SYSTEM_CONSTANTS.MONGOOSE_CONNECTED);
});

mongoose.connection.on('disconnected', function() {
    sysUtils.logger(SYSTEM_CONSTANTS.MONGOOSE_DISCONNECTED);
});

mongoose.connection.on('open', function() {
    sysUtils.logger(SYSTEM_CONSTANTS.MONGOOSE_CONNECTION_OPEN);
});

process.on('SIGINT', function() {
    sysUtils.logger(SYSTEM_CONSTANTS.INTERRUPT_RECEIVED);
    mongoose.connection.close(function() {
        sysUtils.logger(SYSTEM_CONSTANTS.MONGOOSE_CLOSED);
        process.exit(0);
    });
});

process.on('SIGTERM', function() {
    sysUtils.logger(SYSTEM_CONSTANTS.TERMINATE_RECEIVED);
    mongoose.connection.close(function() {
        sysUtils.logger(SYSTEM_CONSTANTS.MONGOOSE_CLOSED);
        process.exit(0);
    });
});

process.on('SIGUSR2', function() {
    sysUtils.logger(SYSTEM_CONSTANTS.RESTART_RECEIVED);
    mongoose.connection.close(function() {
        sysUtils.logger(SYSTEM_CONSTANTS.MONGOOSE_CLOSED);
        process.exit(0);
    });
});