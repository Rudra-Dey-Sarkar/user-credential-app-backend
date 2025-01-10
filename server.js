require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const userSchemaModels = require("./src/models/user");
const corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200

}
app.use(cors(corsOptions));
app.use(express.json());
const nodemailer = require('nodemailer');


const ConnectDB = require("./src/config/db");
ConnectDB();


//Notification Send
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PW,
    },
});
const sendNotification = (email, message) => {
    transporter.sendMail({
        from: process.env.EMAIL,
        to: email,
        subject: 'Appointment Update',
        text: message,
    });
};

//test route
app.get("/", async (req, res) => {
    try {
        res.json("Working");
    } catch (errors) {
        console.log(errors);
    }
});

//Register
app.post("/register", async (req, res) => {
    const { username, email, password } = req.body;
    const datas = {
        username: username,
        email: email,
        password: password
    }

    try {
        const response1 = await userSchemaModels.find({ username: username });
        const response2 = await userSchemaModels.find({ email: email });
        if (response1?.length > 0 && response2?.length > 0) {
            res.status(404).json("Username and Email Already Exist");
        } else if (response1?.length > 0) {
            res.status(404).json("Username Already Exist");
        } else if (response2?.length > 0) {
            res.status(404).json("Email Already Exist");
        } else {
            await userSchemaModels.insertMany([datas])
                .then((data) => {
                    res.status(200).json(data);
                })
                .catch((err) => {
                    res.status(404).json(err);
                })
        }
    } catch (err) {
        console.log(err);
    }

});
//Login
app.post("/login", async (req, res) => {
    const { username, email, password } = req.body;
    try {
        if (username !== undefined) {
            await userSchemaModels.find({ username: username })
                .then((data) => {
                    if (data[0].password === password) {
                        res.status(200).json(data);
                    } else {
                        res.status(404).json("Use Same Password");
                    }
                })
                .catch((err) => {
                    res.status(404).json(err);
                })
        } else if (email !== undefined) {
            await userSchemaModels.find({ email: email })
                .then((data) => {
                    if (data[0].password === password) {
                        res.status(200).json(data);
                    } else {
                        res.status(404).json("Use Same Password");
                    }
                })
                .catch((err) => {
                    res.status(404).json(err);
                })
        } else {
            res.status(404).json("please enter email or password");
        }
    } catch (err) {
        console.log(err);
    }
});
//Forget OTP
app.post("/forget-otp", async (req, res) => {
    const { username, email, password } = req.body;
    try {
        if (username !== undefined) {
            await userSchemaModels.find({ username: username })
                .then((data) => {
                    sendNotification(data[0]?.email, `OTP :- 123`);
                    res.status(200).json("OTP sended in the email");
                })
                .catch((err) => {
                    res.status(404).json(err);
                })
        } else if (email !== undefined) {
            await userSchemaModels.find({ email: email })
                .then((data) => {
                    if (data[0].password === password) {
                        res.status(200).json(data);
                    } else {
                        res.status(404).json("Use Same Password");
                    }
                })
                .catch((err) => {
                    res.status(404).json(err);
                })
        } else {
            res.status(404).json("please enter email or password");
        }
    } catch (err) {
        console.log(err);
    }
});
//Forget
app.put("/forget", async (req, res) => {
    const { otp, username, email, password } = req.body;
    console.log(otp, username, email, password);
    try {
        if (username !== undefined) {
            console.log("Username");
            if (otp !== undefined && otp === "123") {
                await userSchemaModels
                    .findOneAndUpdate({ username: username }, { password: password }, { new: true })
                    .then((data) => {
                        if (data) {
                            res.status(200).json({ message: "Password updated successfully", data });
                        } else {
                            res.status(404).json({ message: "User not found" });
                        }
                    })
                    .catch((err) => {
                        res.status(500).json({ error: err.message });
                    });
            } else {
                res.status(400).json({ message: "Enter correct OTP" });
            }
        } else if (email !== undefined) {
            console.log("Email");
            if (otp !== undefined && otp === "123") {
                await userSchemaModels
                    .findOneAndUpdate({ email: email }, { password: password }, { new: true })
                    .then((data) => {
                        if (data) {
                            res.status(200).json({ message: "Password updated successfully", data });
                        } else {
                            res.status(404).json({ message: "User not found" });
                        }
                    })
                    .catch((err) => {
                        res.status(500).json({ error: err.message });
                    });
            } else {
                res.status(400).json({ message: "Enter correct OTP" });
            }
        } else {
            res.status(400).json({ message: "Please enter email or username" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
});


app.listen(process.env.PORT, () => {
    console.log("App is listening in port", process.env.PORT);
})