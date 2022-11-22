const usersController = {};
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = mongoose.model(process.env.USER_MODEL);
const systemUtils = require('../utilities/system.utils');
const USERS_CONSTANTS = require('../constants/users.constants');

const _checkUserExists = function(user) {
    return new Promise((resolve, reject) => {
        if(user) {
            resolve(user);
        } else {
            reject({status: process.env.BAD_REQUEST_STATUS_CODE,  error: USERS_CONSTANTS.USERNAME_PASSWORD_INVALID});
        }
    })
}

const _checkPassword = function(password, user) {
    return new Promise((resolve, reject) => {
        bcrypt.compare(password, user.password)
        .then((passwordMatch) => {
            if(passwordMatch) {
                resolve(user);
            } else {
                reject({status: process.env.BAD_REQUEST_STATUS_CODE,  error: USERS_CONSTANTS.USERNAME_PASSWORD_INVALID});
            }
        })
        .catch((err) => reject(err));
    });
}

const _generateToken = function(response, user) {
    const token = jwt.sign({name: user.username}, process.env.JWT_PASSWORD, {expiresIn: 3600});
    const loggedInUser = user[process.env.DOCUMENT] || user;
    loggedInUser.token = token;
    delete(loggedInUser.password);
    response.body = {data: loggedInUser};
}

const _getHash = function(password, salt) {
    return new Promise((resolve, reject) => {
        bcrypt.hash(password, salt)
        .then((hash) => resolve(hash))
        .catch((err) => reject(USERS_CONSTANTS.HASH_GENERATION_ERROR));
    });
}

const _saveUser = function(req, hash) {
    return new Promise((resolve, reject) => {
        const user = {
            name: req.body.name,
            username: req.body.username,
            password: hash
        };
        User.create(user)
        .then((user) => resolve(USERS_CONSTANTS.USER_REGISTER_SUCCESS))
        .catch((err) => {
            if(err[process.env.KEY_PATTERN] && err[process.env.KEY_PATTERN][USERS_CONSTANTS.USERNAME] === 1) {
                reject({status: process.env.DATA_EXISTS_STATUS_CODE , error: USERS_CONSTANTS.USERNAME_TAKEN})
            } else {
                reject(err);
            }
        });
    });
}

usersController.login = function(req, res) {
    const response = systemUtils.getResponse(process.env.SUCCESS_STATUS_CODE);
    if(req.body && req.body.password && req.body.username) {
        const query = {username: req.body.username};
        User.findOne(query).exec()
        .then((user) => _checkUserExists(user))
        .then((user) => _checkPassword(req.body.password, user))
        .then((user) => _generateToken(response, user))
        .catch((err) => systemUtils.setError(response, err.status || process.env.INTERNAL_SERVER_ERROR_STATUS_CODE, err.error || err))
        .finally(() => systemUtils.sendResponse(res, response));
    } else {
        systemUtils.setError(response, process.env.BAD_REQUEST_STATUS_CODE, USERS_CONSTANTS.USERNAME_PASSWORD_INVALID);
        systemUtils.sendResponse(res, response)
    }
}

usersController.getUser = function(req, res) {
    const response = systemUtils.getResponse(process.env.SUCCESS_STATUS_CODE);
    if(req.params && req.params.username) {
        const query = {username: req.params.username};
        User.findOne(query).exec()
        .then((user) => _checkUserExists(user))
        .then((user) => response.body = user)
        .catch((err) =>systemUtils.setError(response, process.env.INTERNAL_SERVER_ERROR_STATUS_CODE, err))
        .finally(() => systemUtils.sendResponse(res, response));
    } else {
        systemUtils.setError(response, process.env.BAD_REQUEST_STATUS_CODE, USERS_CONSTANTS.USERNAME_INVALID);
        systemUtils.sendResponse(res, response)
    }
}

usersController.register = function(req, res) {
    const response = systemUtils.getResponse(process.env.CREATE_SUCCESS_STATUS_CODE);
    if(req.body && req.body.name && req.body.password && req.body.username) {
        bcrypt.genSalt(10).then((salt) => _getHash(req.body.password, salt))
        .then((hash) => _saveUser(req, hash))
        .then(message => _generateToken(response, req.body))
        .catch((err) => systemUtils.setError(response, err.status || process.env.INTERNAL_SERVER_ERROR_STATUS_CODE, err.error || err))
        .finally(() => systemUtils.sendResponse(res, response));
    } else {
        systemUtils.setError(response, (process.env.BAD_REQUEST_STATUS_CODE), USERS_CONSTANTS.USER_BODY_INVALID);
        systemUtils.sendResponse(res, response);
    }
}

module.exports = usersController;
