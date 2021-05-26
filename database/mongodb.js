
// Import mongoose, for mongodb
const mongoose = require("mongoose");
// Loads enviroment variables from .env
require("dotenv").config();

let mongoDatabase;

switch (process.env.ENV) {
  // Creating a test server if we run npm run test 
  case "test":
    const { MongoMemoryServer } = require("mongodb-memory-server");
    mongoDatabase = new MongoMemoryServer({ binary: { version: "4.4.1" } });
    break;
    // Connects to the database used for development, npm r
  case "dev":
    mongoDatabase = {
      getUri: async () =>
        `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}/${process.env.DB_NAME}?retryWrites=true&w=majority`,
    };
    break;
}
// Function to connect to mongoose
async function connect(){
    
    let uri = await mongoDatabase.getUri()
    try {
        var connection = await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true
        })
        if(connection){
            return {success: "Connected to database"}
        }
    } catch {
        return {success: "Connection to database failed"}
    }
}
// Function to disconnect
async function disconnect() {
  await mongoose.disconnect()

  if(process.env.ENV == 'test' || process.env.ENV == 'dev'){
  await mongoDatabase.stop()
  }
}
// Export it
module.exports = {
  connect,
  disconnect,
};
