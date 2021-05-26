
var chai = require('chai')
const { expect } = chai
const db = require('../database/mongodb')

const ordersModel = require('../models/ordersModel')
const usersModel = require('../models/usersModel')

describe('It should test if the CRUD:iing functionality of orderModel works as intended', () => {
    beforeEach(async function () {
        await db.connect()
        await ordersModel.clearAllOrders()
       

        const user = {
            email: '123',
            name: '123',
            password: '123',
            adress: {
                street: '123',
                zip: '123',
                city: '123'
            },
            orderHistory: []
        }

        this.currentTest.user = await usersModel.createUserModel(user)

        const loginresponse = await usersModel.loginUserModel({email: '123', password: '123'})
        this.currentTest.token = loginresponse.token

        const customerId = this.currentTest.user._id
        const items = [
            {
                _id: '39y7gbbZk1u4ABnv',
                title: 'Gretas Fury',
                price: 999,
                shortDesc: 'Unisex',
                longDesc: 'Skate ipsum dolor sit amet...',
                imgFile: 'skateboard-greta.png'
            } 
        ]
        var value = 0
        for(const item in items) {
            value += items[item].price
        }
        const customerOrder = {
            customerId: customerId,
            status: 'inProcess',
            items: items,
            value: value
        }
        const order = await ordersModel.addOrder(customerOrder)

        this.currentTest.order = order
    })
    
    it('should test if an order was added', async function () {

        expect(this.test.order.customerId).to.equal(this.test.user._id.toString())
        expect(this.test.order.value).to.equal(999)
    })

    it('should read an order', async function() {

        const orderId = this.test.order._id

        const order = await ordersModel.findOrder(orderId)

        expect(order.customerId).to.equal(this.test.user._id.toString())
        expect(order.value).to.equal(999)
    })

    it('should read all orders', async function() {
        
        let roleId = this.test.user._id
        const customerId = '12345'
        const items = [
            {
                _id: '39y7gbbZk1u4ABnv',
                title: 'Gretas Fury',
                price: 999,
                shortDesc: 'Unisex',
                longDesc: 'Skate ipsum dolor sit amet...',
                imgFile: 'skateboard-greta.png'
            } 
        ]
        var value = 0
        for(const item in items) {
            value += items[item].price
        }
        const customerOrder = {
            customerId: customerId,
            status: 'inProcess',
            items: items,
            value: value
        }

       

        const order = await ordersModel.addOrder(customerOrder)

        const orders = await ordersModel.findAllOrders(roleId)
        if(roleId != 'admin') {
            expect(orders.length).to.equal(1)
        } else {
            expect(orders.length).to.equal(2)
        }
        
    })

    it('should update an order', async function () {

        const orderId = this.test.order._id
        const item2Add = {
            _id: '30y7gbbZk1u4ABnv',
            title: 'Gretas Fury 2',
            price: 1099,
            shortDesc: 'Unisex',
            longDesc: 'Skate ipsum dolor sit amet...',
            imgFile: 'skateboard-greta.png'
        }

        const order = await ordersModel.findOrder(orderId)
        order.items.push(item2Add)

        var value = 0
        for(const item in order.items) {
            value += order.items[item].price
        }
        order.value = value

        await ordersModel.updateOrder(order._id, order)

        const newOrder = await ordersModel.findOrder(orderId)

        expect(newOrder.items.length).to.equal(2)
        expect(newOrder.value).to.equal(2098)
    })

    it('should delete an order', async function () {
        await ordersModel.deleteOrder(this.test.order._id)

        const order =  await ordersModel.findOrder(this.test.order._id)

        expect(order).to.equal(null)
    })
})