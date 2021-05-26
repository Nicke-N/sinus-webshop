const router = require('express').Router()
const ordersController = require('../controllers/ordersController')
const auth = require('../middlewares/authorization')

router
    .route('/:orderId')
        .get(ordersController.findOrder)
        .patch(ordersController.updateOrder)
        .delete(ordersController.deleteOrder)

router
    .route('/')
        .get(auth.user, ordersController.findAllOrders)
        .post(ordersController.addOrder)

module.exports = router