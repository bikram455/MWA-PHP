const { Router } = require('express');
const usersController = require('../controller/users.controller');
const authController = require('../controller/authentication.controller');

const router = Router();
router.route('/register')
    .post(usersController.register);

router.route('/login')
    .post(usersController.login1);

module.exports = router;