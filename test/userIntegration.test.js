const mongoose = require('mongoose')
const chai = require('chai')
const chaiHttp = require('chai-http')
chai.use(chaiHttp)
const {connect, disconnect} = require('../database/mongodb')
const {expect, request} = chai
const app = require('../app')
const usersDB = mongoose.model("users")
const decode = require('jwt-decode')

describe('User resource', async function () { 

    before(async function(){

        await connect();
    });
    
    beforeEach(async function(){
        await usersDB.deleteMany({})
        
        this.testUser1 = await usersDB.create({email: "testperson1", password: "testpass1"})
        this.testUser2 = await usersDB.create({email: "testperson2", password: "testpass2"})
    });

    it('Get all users through request', async function (){
        await chai.request(app)
            .get('/api/users')
            .then((res) => {
                expect(res).to.have.status(200)
                })
    });

    it('Get single user through request', async function (){

        const userId = this.testUser1._id

        await chai.request(app)
            .get(`/api/users/${userId}`)
            .then((res) => {
                expect(res).to.have.status(200)
                })
    });

    it('Edit user through request', async function (){

        const userId = this.testUser1._id
        const body = {email: 'newEmail'}

        await chai.request(app)
            .patch(`/api/users/${userId}`)
            .set('Content-Type', 'application/json')
            .send(body)
            .then((res) => {
                expect(res).to.have.status(201)
                })

        const editedUser = await usersDB.findOne({_id: userId})
        expect(editedUser.email).to.equal("newEmail")
    });

    it('Delete user through request', async function (){

        const userId = this.testUser1._id

        await chai.request(app)
            .delete(`/api/users/${userId}`)
            .then((res) => {
                expect(res).to.have.status(201)
                })

        const usersPostDeletion = await usersDB.find({})
        expect(usersPostDeletion.length).to.equal(1)

    });
    it('User creation through request', async function (){

        var body = {email: "testUser", password: "testPass"}
        var body = {
            email: "testmail@mail.se",
            password: "123",
            name: "Karl",
            adress: {
                street: "adressgatan 5",
                zip: "123 45",
                city: "Stockholm"
            },
            orderHistory: []
        }
        await chai.request(app)
            .post(`/api/register`)
            .set('Content-Type', 'application/json')
            .send(body)
            .then((res) => {
                expect(res.status).to.equal(201)
                })

    });

    it('User login should return token and specific userData', async function (){

        /*------------------------------------------------------
            To use hashing the user needs to created through
            request or model contrary to the users created in
            the beforeEach test operator (hence in block 
            creation of user below)
        ------------------------------------------------------*/
        const model = require('../models/usersModel');
        const creationForm = {
            email: "testmail@mail.se",
            password: "123",
            name: "Karl",
            adress: {
                street: "adressgatan 5",
                zip: "123 45",
                city: "Stockholm"}
            }
        const createdUser = await model.createUserModel(creationForm)

        const loginForm = {email: "testmail@mail.se", password: "123"}

        await chai.request(app)
            .post(`/api/auth`)
            .set('Content-Type', 'application/json')
            .send(loginForm)
            .then((res) => {

                expect(res.status).to.equal(200)
                expect(res.body).to.haveOwnProperty("token")
                expect(res.body).to.haveOwnProperty("user")
                var decodedToken = decode(res.body.token)

                //Här:
                expect(decodedToken.userId).to.equal(createdUser._id.toString())

                expect(decodedToken.userRole).to.equal('user')
                expect(decodedToken.password).to.not.exist
                })

    });

    after(async function(){

        await disconnect();

    });

}); 