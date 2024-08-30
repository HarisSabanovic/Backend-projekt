
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

  // kontrollera användarnamnet
  if (username !== adminUsername) {
    return res.status(400).json({ message: 'Fel användarnamn' });
  }

  // kontrollera lösenordet
  const isMatch = await bcrypt.compare(password, adminPassword);
  if (!isMatch) {
    return res.status(400).json({ message: 'Fel lösenord' });
}
    //genererar en jwt token
    const token = jwt.sign({ username }, process.env.JWT_KEY, { expiresIn: '1h' });
    res.json({ token });
});


//hämtar menyn
router.get("/menu", async (req, res) => {

    try {
        const menuList = await Menu.find();
        res.json(menuList);
    } catch(error) {
        return res.status(400).json({ message: error.message });
    }
});



//lägg till ny rätt i meny
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
});

router.put("/menu/:id", async (req, res) => {
    const { id } = req.params;

    //kontrellerar ifall id är korrekt
    if(!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Ogiltigt ID"});
    }

    try {
        const updatedMenuItem = await Menu.findByIdAndUpdate(id, req.body, {new: true});

        if(!updatedMenuItem) {
            return res.status(404).json({ message: 'Menyrätt hittades inte' });
        }

        res.json(updatedMenuItem);
    } catch(error) {
        res.status(400).json({ message: 'Fel vid uppdatering av menyrätt', error });
    }
})

//Raderar meny rätt
router.delete("/menu:id", async (req, res) => {

    try {
        const menuItem = await Menu.findByIdAndDelete(req.params.id);

        if(!menuItem) {
            return res.json({ message: "Could not find menu item"});
        } 

        res.json({message: "Menu item deleted"})
    } catch(error) {
        return res.status(500).json({message: error.message});
    }
})

module.exports = router;