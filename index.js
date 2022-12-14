require('dotenv').config({ path: './dev.env' }) // Please comment this before running the app.
// require('dotenv').config();  // Please make changes to the env files and uncomment this before running the app.
require('./src/data/db-connection');
const routes = require('./src/routes');
const express = require('express');
const sysUtils = require('./src/utilities/system.utils');
const SYSTEM_CONSTANTS = require('./src/constants/system.constants');
const authController = require('./src/controller/authentication.controller');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', function(req, res, next) {
    sysUtils.logger(`${req.method}: ${req.url} -- ${new Date()}`);
    res.append(process.env.ALLOW_ORIGIN, process.env.ALLOWED_APP);
    res.append(process.env.ALLOW_METHODS, process.env.METHODS);
    res.append(process.env.ALLOW_HEADERS, process.env.HEADERS);
    next();
});

app.use('/api', authController.authenticate, routes);

const server = app.listen(process.env.PORT, function() {
    sysUtils.logger(`${SYSTEM_CONSTANTS.SERVER_LISTEN_MESSAGE} ${server.address().port}`);
});