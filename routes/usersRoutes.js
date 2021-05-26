const express = require("express");
const controller = require('../controllers/usersController');
const router = express.Router();

router.get('/', controller.getAllUsersController)
router.get('/:id', controller.getSingleUserController)

router.patch('/:id', controller.editUserController)
router.delete('/:id', controller.deleteUserController)


module.exports = router