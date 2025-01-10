require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200 

}
app.use(cors(corsOptions));
app.use(express.json());

const ConnectDB = require("./src/config/db");
ConnectDB();

app.get("/", async (req, res)=>{
try{
   res.json("Working");
}catch(errors){
    console.log(errors);
}
})

app.listen(process.env.PORT, ()=>{
    console.log("App is listening in port", process.env.PORT);
})