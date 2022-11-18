const usersController = {};
const mongoose = require('mongoose');
const User = mongoose.model(process.env.USER_MODEL);
const systemUtils = require('../utilities/system.utils');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const _checkUserExists = function(response, user) {
    return new Promise((resolve, reject) => {
        if(user) {
            resolve(user);
        } else {
            reject('Username or password invalid!');
        }
    })
}

const _checkPassword = function(response, password, user) {
    return new Promise((resolve, reject) => {
        bcrypt.compare(password, user.password)
        .then((passwordMatch) => {
            if(passwordMatch) {
                resolve(user);
            } else {
                reject('Username or password invalid!');
            }
        })
        .catch((err) => reject(err));
    });
}

const _generateToken = function(response, user) {
    const token = jwt.sign({name: user.username}, process.env.JWT_PASSWORD, {expiresIn: 3600});
    const loggedInUser = user['_doc'];
    loggedInUser.token = token;
    delete(loggedInUser.password);
    response.body = {data: loggedInUser};
}

usersController.login1 = function(req, res) {
    const response = systemUtils.getResponse(process.env.SUCCESS_STATUS_CODE);
    if(req.body && req.body.password && req.body.username) {
        const query = {username: req.body.username};
        User.findOne(query).exec()
        .then((user) => _checkUserExists(response, user))
        .then((user) => _checkPassword(response, req.body.password, user))
        .then((user) => _generateToken(response, user))
        .catch((err) =>systemUtils.setError(response, process.env.INTERNAL_SERVER_ERROR_STATUS_CODE, err))
        .finally(() => systemUtils.sendResponse(res, response));
    } else {
        systemUtils.setError(response, process.env.NOT_FOUND_STATUS_CODE, 'Username or password invalid!');
        systemUtils.sendResponse(res, response)
    }
}

const _getHash = function(password, salt) {
    return new Promise((resolve, reject) => {
        bcrypt.hash(password, salt)
        .then((hash) => resolve(hash))
        .catch((err) => reject('Error while generating hash'));
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
        .then((user) => resolve('user registered successfully!'))
        .catch((err) => {
            if(err['keyPattern'] && err['keyPattern']['username'] === 1) {
                reject('Username already taken!')
            } else {
                reject(err);
            }
        });
    });
}

usersController.register = function(req, res) {
    const response = systemUtils.getResponse(process.env.SUCCESS_STATUS_CODE);
    if(req.body && req.body.name && req.body.password && req.body.username) {
        bcrypt.genSalt(10).then((salt) => _getHash(req.body.password, salt))
        .then((hash) => _saveUser(req, hash))
        .then((message) => response.body = {message: 'user registered successfully!'})
        .catch((err) => systemUtils.setError(response, (process.env.INTERNAL_SERVER_ERROR_STATUS_CODE), err))
        .finally(() => systemUtils.sendResponse(res, response));
    } else {
        systemUtils.setError(response, (process.env.BAD_REQUEST_STATUS_CODE), 'User body invalid!');
        systemUtils.sendResponse(res, response);
    }
}

module.exports = usersController;
