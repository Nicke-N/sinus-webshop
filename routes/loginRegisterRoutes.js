const express = require("express");
const controller = require('../controllers/usersController');
const router = express.Router();


router.post('/register', controller.createUserController)
router.post('/auth', controller.loginUserController)

module.exports = router