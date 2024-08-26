
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
require("dotenv").config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const Menu = require("../models/menu");

//connect to mongodb
mongoose.set("strictQuery", false);
mongoose.connect("mongodb://127.0.0.1:27017/resteraunt").then(() => { 
    console.log("Connected to MongoDB");
}).catch((error) => {
    console.log(error + " Error connecting to database")
})

// admin användarnamn och lösenord
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
});


//hämtar menyn
router.get("/menu", async (req, res) => {

    try {
        const menuList = await Menu.find();
        console.log("Hämtar menylista");
        res.json(menuList);
    } catch(error) {
        return res.status(400).json({ message: error.message });
    }
});


router.post("/menu", async (req, res) => {
    const menuItem = new Menu({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        category: req.body.category
    });

    try {
        const newMenuItem = menuItem.save();
        res.status(201).json(newMenuItem);
    } catch (error) {
        return res.status(400).json({ message: error.message})
    }
})

module.exports = router;