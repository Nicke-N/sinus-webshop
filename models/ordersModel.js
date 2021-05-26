// Require mongoose to use it
const mongoose = require('mongoose')

// create a schema of the object
const order = new mongoose.Schema({
    // key: type
    customerId: String,
    status: String,
    items: Array,
    value: Number
})
// Automatically adds timestamps for latest create and update
order.set('timestamps', true)

// Assign variable with order schema with mongoose.model-method, also calling that orders 
const ordersModel = mongoose.model('orders', order)

module.exports = {
    addOrder: async (order) => {
        
        try {
            // creates and order
            const insert = await ordersModel.create(order)
            return insert
            
        } catch (error) {
            console.log(error)
        }

        // return new Promise(async(resolve, reject) => {
        //     try {
        //         const insert = await ordersModel.create(order)
        //         resolve(insert)
        //     } catch (error) {
        //         reject(error)
        //     }
        // }) 
    },
    findOrder:  (orderId) => {
        
        // This and below are unnecessarily long code, which can be written as the one above,
        // or even shorter aswell. My group didn't really care of fixing it better doing it better
        return new Promise(async(resolve, reject) => {
            try {
                // Finds order by Id, _id: is the default id created by mongoDb when u insert
                const order = await ordersModel.findOne({_id: orderId})
               
                resolve(order)
            } catch (error) {
                reject(error)
            }
        }) 
    },
    findAllOrders:  (id) => {
        
        return new Promise(async(resolve, reject) => {
            try {
                var orders
                
                if (id == 'admin') {
                    orders = await ordersModel.find()
                } else {
                    orders = await ordersModel.find({customerId: id})
                }
                
                resolve(orders)
            } catch (error) {
                reject(error)
            }
        }) 
    },
    updateOrder: (orderId, order) => {

        return new Promise(async(resolve, reject) => {
            try {
                // Update an order
                const update = await ordersModel.updateOne(
                    // Finds by Id
                    {_id: orderId}, 
                    {
                        // Sets new values
                        $set: {
                            items: order.items,
                            value: order.value
                        }
                    }
                )
                resolve('Order was Updated')
            } catch (error) {
                reject(error)
            }
        })
    },
    deleteOrder: (orderId) => {
        return new Promise(async(resolve, reject) => {
            try {
                // Deletes by Id
                await ordersModel.deleteOne({_id: orderId})
                
                resolve('Deleted')
            } catch (error) {
                reject(error)
            }
        })
    },
    clearAllOrders: () => {
        return new Promise(async (resolve, reject) => {
            try {
                // deletes all orders
                await ordersModel.deleteMany({})
                resolve('Deleted')
            } catch (error) {
                reject(error)
            }
        })
    }
}