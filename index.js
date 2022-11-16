require('dotenv').config({ path: './dev.env' }) // Please comment this before running the app.
// require('dotenv').config();  // Please make changes to the env files and uncomment this before running the app.
require('./src/data/db-connection');
const routes = require('./src/routes');
const express = require('express');
const SYSTEM_CONSTANTS = require('./src/constants/system.constants');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', function(req, res, next) {
    console.log(req.method, req.url);
    // res.header("Access-Control-Allow-Origin", ['*']);
    // res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.append('Access-Control-Allow-Origin', 'http://localhost:4200');
    res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE, PATCH');
    res.append('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

app.use('/api', routes);

const server = app.listen(process.env.PORT, function() {
    console.log(SYSTEM_CONSTANTS.SERVER_LISTEN_MESSAGE, server.address().port);
});