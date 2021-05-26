const ordersModel = require('../models/ordersModel')
const productsModel = require('../models/productModels')
const decode = require('jwt-decode')

module.exports = {
    addOrder: async (req, res) => {

        var order
        
        if(req.headers.authorization) {
            const user = decode(req.headers.authorization)

            order = {
                
                customerId: user.userId,
                status: 'inProcess',
                items: req.body.items,
                value: 0
            }
        } else {
            
            const id = 'Guest'+req.body.customer.name + req.body.customer.street + req.body.customer.zip + req.body.customer.city
    
            order = {
                customerId: id,
                status: 'inProcess',
                items: req.body.items,
                value: 0
            }
        }

        var newItems = []
        
        for(const item in order.items) {
            
            const product = await productsModel.getProduct(order.items[item])
            
            order.value += product.price
            newItems.push(product)
        }

        order.items = newItems
        
        try {
            const addedOrder = await ordersModel.addOrder(order)
           
            res.json(addedOrder)
        } catch (error) {
            res.json(error)
        }
        
    },
    findOrder: async (req, res) => {
        var orderId = req.params.orderId
        try {
            const order = await ordersModel.findOrder(orderId)
            res.json(order)
        } catch (error) {
            res.json(error)
        }
    },
    findAllOrders: async (req, res) => {
        const user = decode(req.headers.authorization)
        try {
            var orders
            
            if (user.userRole == 'user') {

                orders = await ordersModel.findAllOrders(user.userId)
            } else if (user.userRole == 'admin') {
                orders = await ordersModel.findAllOrders('admin')
            }
            
            res.json(orders)
        } catch (error) {
            res.json(error)
        }
    },
    updateOrder: async (req, res) => {
        var orderId = req.params.orderId
        var items = req.body.items
        try {
            var oldOrder = await ordersModel.findOrder(orderId)
            if(oldOrder) {
                
                oldOrder.items.push(items)
                oldOrder.value = 0
                for(const item in oldOrder.items) {
                    oldOrder.value += oldOrder.items[item].price
                }

                await ordersModel.updateOrder(orderId, oldOrder)
                
                res.json({msg: 'The order was updated'})

            } else {
                res.json({msg: 'Error! Order not found!'})
            }
        } catch (error) {
            res.json(error)
        }
    },
    deleteOrder: async (req, res) => {
        var orderId = req.params.orderId

        try {
            
            const order = await ordersModel.deleteOrder(orderId)
            
            res.json(order)

        } catch (error) {
            res.json({msg: error})
        }
    }
}