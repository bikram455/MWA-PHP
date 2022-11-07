require('dotenv').config({ path: './dev.env' }) // Please comment this before running the app.
// require('dotenv').config();  // Please make changes to the env files and uncomment this before running the app.
require('./data/db-connection');
const routes = require('./routes');
const express = require('express');
const SYSTEM_CONSTANTS = require('./constants/system.constants');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', function(req, res, next) {
    console.log(req.method, req.url);
    next();
});
app.use('/api', routes);

const server = app.listen(process.env.PORT, function() {
    console.log(SYSTEM_CONSTANTS.SERVER_LISTEN_MESSAGE, server.address().port);
});