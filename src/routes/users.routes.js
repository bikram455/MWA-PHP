const { Router } = require('express');
const usersController = require('../controller/users.controller');
const authController = require('../controller/authentication.controller');

const router = Router();
router.route(process.env.REGISTER_ROUTE)
    .post(usersController.register);

router.route(process.env.LOGIN_ROUTE)
    .post(usersController.login);

router.route(process.env.GET_USER_ROUTE)
    .get(usersController.getUser);
module.exports = router;