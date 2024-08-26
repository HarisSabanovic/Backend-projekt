
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
require("dotenv").config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

//connect to mongodb
mongoose.set("strictQuery", false);
mongoose.connect("mongodb://127.0.0.1:27017/resteraunt").then(() => { 
    console.log("Connected to MongoDB");
}).catch((error) => {
    console.log(error + " Error connecting to database")
})

// Hårdkodat användarnamn och lösenord
const adminUsername = process.env.ADMINNAME;
const adminPassword = bcrypt.hashSync(process.env.PASSWORD, 10);



//loggar in användare
router.post("/login", async (req, res) => {
    const { username, password } = req.body;

  // Kontrollera användarnamnet
  if (username !== adminUsername) {
    return res.status(400).json({ message: 'Fel användarnamn' });
  }

  // Kontrollera lösenordet
  const isMatch = await bcrypt.compare(password, adminPassword);
  if (!isMatch) {
    return res.status(400).json({ message: 'Fel lösenord' });
  } else {
    return res.json({message: "Inloggad"})
  }
})

module.exports = router;