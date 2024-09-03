const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");


const authRoutes = require("./routes/authRoutes");

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(cors());

//connect to mongodb
mongoose.set("strictQuery", false);
mongoose.connect("mongodb+srv://haris18sabanovic:" + process.env.DATABASE + "@cluster18.rtfyp.mongodb.net/ethiquedb?retryWrites=true&w=majority").then(() => { 
    console.log("Connected to MongoDB");
}).catch((error) => {
    console.log(error + " Error connecting to database")
})



//routes
app.use("/api", authRoutes);

//protected route
app.get("/api/protected", authenticateToken, (req, res) => {
    res.json({ message: "Inloggad på skyddad server"});
})

//validate token
function authenticateToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if(token == null) {
        res.status(401).json({ message: "not authorized"});
    }

    jwt.verify(token, process.env.JWT_KEY, (err, username) => {
        if(err) {
            return res.status(403).json({ message: "invalid jwt"});
        }

        req.username = username;
        next();
    });
}

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
