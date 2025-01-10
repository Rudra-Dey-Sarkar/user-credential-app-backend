const mongoose = require("mongoose");
require("dotenv").config();
//Database connection creation
const ConnectDB = async ()=>{
await mongoose.connect(process.env.DB).then(()=>{
    console.log("Database Connected");
}).catch((error)=>{
    console.log(error);
})
}

module.exports = ConnectDB;