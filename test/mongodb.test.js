const chai = require('chai')
const {expect, request} = chai
const mongoose = require('mongoose')
const {connect, disconnect} = require('../database/mongodb')

describe("Database Connection", () => {

    it('Should connect to database', async function() {

        var connection = await connect()
        expect(connection.success).to.equal("Connected to database")

    });
    after(async function(){

        await disconnect();
    })

})