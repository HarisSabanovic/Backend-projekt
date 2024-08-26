const mongoose = require("mongoose");

const MenuSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
      trim: true 
    },
    description: {
      type: String,
      trim: true 
    },
    price: {
      type: Number,
      required: true,
      min: 0 
    },
    category: {
      type: String,
      required: true
    },
  });
  
  // Skapa modellen baserat på schemat
  const Menu = mongoose.model('Menu', MenuSchema);
  
  module.exports = Menu;