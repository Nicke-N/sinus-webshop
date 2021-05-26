// To be continued

// var chai = require('chai')
// const spies = require('chai-spies')
// chai.use(spies)
// const { expect } = chai
// const db = require('../database/mongodb')

// // const ordersController = require('../controllers/ordersController')

// // describe('it should test if CRUD:ing works through the controller', () => {
//     beforeEach(async () => {
//         await db.connect()
//     })

//     it('should add an order', async function () {
//         const req = {
//             body: {
//                 customerId: 'guest12345',
//                 items: [
//                     {
//                         _id: '39y7gbbZk1u4ABnv',
//                         title: 'Gretas Fury',
//                         price: 999,
//                         shortDesc: 'Unisex',
//                         longDesc: 'Skate ipsum dolor sit amet...',
//                         imgFile: 'skateboard-greta.png'
//                     } 
//                 ]
//             }
//         }

//         const res = {
//             json: chai.spy( body => body)
//         }

//         const order = await ordersController.addOrder(req, res)


//         console.log(res)
//         expect(res.json).to.have.been.called()

//         //expect(order.customerId).to.equal('guest12345')
//     })
// })