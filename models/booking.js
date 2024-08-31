const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema({

    firstName: {
        type: String,
        required: true,
        trim: true
    },

    lastName: {
        type: String,
        required: true,
        trim: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    phoneNumber: {
        type: String,
        required: true
    },

    bookingDateTime: {
        type: Date,
        required: true
    },

    amountPeople: {
        type: Number,
        required: true
    },

});

const Booking = mongoose.model('Booking', BookingSchema );

module.exports = Booking;