const mongoose = require('mongoose')
const chai = require('chai')
const {expect} = chai
const model = require('../models/usersModel');
const {connect, disconnect} = require('../database/mongodb')
const usersDB = mongoose.model("users")

describe('User resource', async function() { 

    before(async function(){

        await connect();
    })

    beforeEach( async function() {
        await usersDB.deleteMany({});
        this.testUser1 = await usersDB.create({email: "testperson1"})
        this.testUser2 = await usersDB.create({email: "testperson2"})
    })

    it('User should be created in database', async function() {

        var createdUser = await model.createUserModel({email: "testMail", password: "testPass"})
        expect(createdUser._id).to.exist

        var check2 = await usersDB.findOne({_id: createdUser._id})
        expect(typeof check2).to.equal('object')

    });

    it('User created through model should have correct attributes and default values', async function() {

        var testBody = {
            email: "testMail", 
            password: "testPass", 
            name: "testName", 
            adress:{}
        }
        var result = await model.createUserModel(testBody)

        expect(result.email).to.equal("testMail")
        expect(result.name).to.equal("testName")
        expect(result.role).to.equal("user")
        expect(typeof result.adress).to.equal("object")

    });
    it('Created user password should be hashed', async function() {
        var testBody = {
            email: "testMail", 
            password: "testPass", 
            name: "testName", 
            role: "testRole", 
            adress:{}
        }
        var result = await model.createUserModel(testBody)

        expect(result.password.length).to.equal(60)


    });
    it('All users should be found', async function() {

        var getAll = await model.getAllUsersModel()

        expect(typeof getAll).to.equal("object")
        expect(getAll.length).to.equal(2)
        expect(getAll[0].email).to.equal("testperson1")
        expect(getAll[1].email).to.equal("testperson2")
    });
    it('Single user should be found', async function() {
        
        var getSingle = await model.getSingleUserModel(this.testUser1._id)
        expect(getSingle.email).to.exist
        expect(typeof getSingle).to.equal("object")

    });
    it('Single user should be deleted', async function() {
        
        var deletedUser = await model.deleteUserModel(this.testUser1._id)
        expect(deletedUser.deletedCount).to.equal(1)

        var databaseCheck = await usersDB.find({})
        expect(databaseCheck.length).to.equal(1)

    });
    it('Targeted user should be edited', async function() {
        
        var targetUser = await usersDB.findOne(this.testUser1._id)

        var editAction = await model.editUserModel(targetUser._id, {email: "newEmail"})
        expect(editAction.nModified).to.equal(1)

        var changedUser = await usersDB.findOne(targetUser._id)
        expect(changedUser.email).to.equal("newEmail")

    });

    after(async function(){

        await disconnect();

    })
}); 