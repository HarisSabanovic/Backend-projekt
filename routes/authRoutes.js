
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();


const Menu = require("../models/menu");
const Booking = require("../models/booking");


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
router.delete("/menu/:id", async (req, res) => {

    const { id } = req.params;

    console.log("Received ID:", id); 

    try {
        const menuItem = await Menu.findByIdAndDelete(id);

        if(!menuItem) {
            console.log("Menu item not found for ID:", id); 
            return res.json({ message: "Could not find menu item"});
        } 

        res.json({message: "Menu item deleted"})
    } catch(error) {
        return res.status(500).json({message: error.message});
    }
})

router.get("/booking", async (req, res) => {

    try {
        const bookingList = await Booking.find();
        res.json(bookingList);
    } catch(error) {
        return res.status(400).json({ message: error.message });
    }
});

router.post("/booking", async (req, res) => {
    const { firstName, lastName, email, phoneNumber, bookingDateTime, amountPeople } = req.body;

    try {
        // Skapa en ny bokning
        const newBooking = new Booking({
            firstName,
            lastName,
            email,
            phoneNumber,
            bookingDateTime,
            amountPeople
        });

        // Spara bokningen i databasen
        const savedBooking = await newBooking.save();
        res.status(201).json(savedBooking);
    } catch (error) {
        res.status(400).json({ message: "Fel vid skapande av bokning", error });
    }
});

router.put("/booking/:id", async (req, res) => {
    const { id } = req.params;


    try {
        const updatedBookingItem = await Booking.findByIdAndUpdate(id, req.body, {new: true});

        if(!updatedBookingItem) {
            return res.status(404).json({ message: 'Bokning hittades inte' });
        }

        res.json(updatedBookingItem);
    } catch(error) {
        res.status(400).json({ message: 'Fel vid uppdatering av Bokning', error });
    }
})


router.delete("/booking/:id", async (req, res) => {

    const { id } = req.params;

    try {
        const bookingItem = await Booking.findByIdAndDelete(id);

        if(!bookingItem) {
            console.log("Booking item not found for ID:", id); 
            return res.json({ message: "Could not find booking item"});
        } 

        res.json({message: "Booking item deleted"})
    } catch(error) {
        return res.status(500).json({message: error.message});
    }
});

module.exports = router;