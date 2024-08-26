
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

//connect to mongodb
mongoose.set("strictQuery", false);
mongoose.connect(process.env.DATABASE).then(() => {
    console.log("Connected to MongoDB");
}).catch((error) => {
    console.log(error + " Error connecting to database")
})

//loggar in användare
router.post("/login", async (req, res) => {
    console.log("Sup")
})

module.exports = router;