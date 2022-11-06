require('./game-model');
const mongoose = require('mongoose');
const SYSTEM_CONSTANTS = require('../constants/system.constants');

mongoose.connect(process.env.DB_CONNECTION_STRING);

mongoose.connection.on('connected', function() {
    console.log(SYSTEM_CONSTANTS.MONGOOSE_CONNECTED);
});

mongoose.connection.on('disconnected', function() {
    console.log(SYSTEM_CONSTANTS.MONGOOSE_DISCONNECTED);
});

mongoose.connection.on('open', function() {
    console.log(SYSTEM_CONSTANTS.MONGOOSE_CONNECTION_OPEN);
});

process.on('SIGINT', function() {
    console.log(SYSTEM_CONSTANTS.INTERRUPT_RECEIVED);
    mongoose.connection.close(function() {
        console.log(SYSTEM_CONSTANTS.MONGOOSE_CLOSED);
        process.exit(0);
    });
});

process.on('SIGTERM', function() {
    console.log(SYSTEM_CONSTANTS.TERMINATE_RECEIVED);
    mongoose.connection.close(function() {
        console.log(SYSTEM_CONSTANTS.MONGOOSE_CLOSED);
        process.exit(0);
    });
});

process.on('SIGUSR2', function() {
    console.log(SYSTEM_CONSTANTS.RESTART_RECEIVED);
    mongoose.connection.close(function() {
        console.log(SYSTEM_CONSTANTS.MONGOOSE_CLOSED);
        process.exit(0);
    });
});