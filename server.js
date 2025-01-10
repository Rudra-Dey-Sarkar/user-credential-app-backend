// Load environment variables from .env file
require("dotenv").config();

// Import required libraries
const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");

// Initialize express app
const app = express();

// Import custom modules
const userSchemaModels = require("./src/models/user"); // User schema model for database interaction
const ConnectDB = require("./src/config/db"); // Database connection module

// Define CORS options to allow cross-origin requests
const corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200
};

// Middleware configuration
app.use(cors(corsOptions)); // Use CORS middleware with specified options
app.use(express.json()); // Parse JSON payloads

// Establish database connection
ConnectDB();

// Configure nodemailer transporter for sending notifications
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL, // Sender's email from environment variables
        pass: process.env.PW,    // Sender's password from environment variables
    },
});

// Function to send email notifications
const sendNotification = (email, message) => {
    transporter.sendMail({
        from: process.env.EMAIL,
        to: email,
        subject: 'Appointment Update',
        text: message,
    });
};

// Test route to check if the server is working
app.get("/", async (req, res) => {
    try {
        res.json("Working");
    } catch (errors) {
        console.log(errors);
    }
});

// Route to register a new user
app.post("/register", async (req, res) => {
    const { username, email, password } = req.body;
    const datas = {
        username: username,
        email: email,
        password: password
    };

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
                });
        }
    } catch (err) {
        console.log(err);
    }
});

// Route to log in a user
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
                });
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
                });
        } else {
            res.status(404).json("please enter email or password");
        }
    } catch (err) {
        console.log(err);
    }
});

// Route to send OTP for password recovery
app.post("/forget-otp", async (req, res) => {
    const { username, email } = req.body;
    try {
        if (username !== undefined) {
            await userSchemaModels.find({ username: username })
                .then((data) => {
                    sendNotification(data[0]?.email, `OTP :- 123`);
                    res.status(200).json("OTP sent to the email");
                })
                .catch((err) => {
                    res.status(404).json(err);
                });
        } else if (email !== undefined) {
            await userSchemaModels.find({ email: email })
                .then((data) => {
                    sendNotification(email, `OTP :- 123`);
                    res.status(200).json("OTP sent to the email");
                })
                .catch((err) => {
                    res.status(404).json(err);
                });
        } else {
            res.status(404).json("Please enter username or email");
        }
    } catch (err) {
        console.log(err);
    }
});

// Route to update password after verifying OTP
app.put("/forget", async (req, res) => {
    const { otp, username, email, password } = req.body;
    try {
        if (username !== undefined) {
            if (otp === "123") {
                await userSchemaModels.findOneAndUpdate({ username: username }, { password: password }, { new: true })
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
            if (otp === "123") {
                await userSchemaModels.findOneAndUpdate({ email: email }, { password: password }, { new: true })
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

// Start the server and listen on the specified port
app.listen(process.env.PORT, () => {
    console.log("App is listening on port", process.env.PORT);
});
