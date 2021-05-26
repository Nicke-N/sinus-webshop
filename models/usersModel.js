const mongoose = require('mongoose')

const usersSchema = new mongoose.Schema({
    email: String,
    password: String,
    name: String,
    role: String,
    adress: {
        street: String,
        zip: String,
        city: String
    },
    orderHistory: Array
})

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const usersDB = mongoose.model("users", usersSchema)

async function createUserModel(body){
    body['password'] = bcrypt.hashSync(body.password, 10)
    body['role'] = "user"
    const result = await usersDB.create(body)
    return result;
}

async function getAllUsersModel(){

    const result = await usersDB.find({})
    return result;
}
async function getSingleUserModel(id){

    const result = await usersDB.findOne({_id: id})
    return result;
}
async function deleteUserModel(id){

    const result = await usersDB.deleteOne({_id: id})
    return result;
}
async function editUserModel(id, body){
    const result = await usersDB.updateOne({_id: id}, body)
    return result;
}
async function loginUserModel(body){
    const user = await usersDB.findOne({email: body.email});

    if (user){
        if (comparePass(body, user)) {

            const token = jwt.sign({userId: user._id, userRole: user.role}, process.env.SECRET, {expiresIn: 10000000,})
            const userObject = {
                  email: user.email,
                  name: user.name,
                  role: user.role,
                  adress: {
                    street: user.adress.street,
                    zip: user.adress.zip,
                    city: user.adress.city
                  }
                }
    
            
            return {token: token, user: userObject}
        }
    
    }

}
async function verifyTokenModel(token, secret){
    const validatedToken = jwt.verify(token, secret)
    return validatedToken;
}
function comparePass(body, user){
    
    const tryPassword = bcrypt.compareSync(body.password, user.password)
    if(!tryPassword) {
        console.log(body.password + " " + user.password)
    }
    
    return tryPassword
}


module.exports = {
    createUserModel,
    getAllUsersModel,
    getSingleUserModel,
    deleteUserModel,
    editUserModel,
    loginUserModel,
    verifyTokenModel
}