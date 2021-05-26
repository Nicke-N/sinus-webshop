require("dotenv").config();
const app = require('./app')
const port = process.env.PORT || 5000 
const database = require('./database/mongodb')
database.connect().then( () => 
    app.listen( port, () => console.log("Server running on port " + port + ";"))
)