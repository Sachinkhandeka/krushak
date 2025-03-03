const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    equipment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Equipment",
        required: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    status: {
        type: String,
        enum: ["Pending", "Confirmed", "Tracking", "Completed", "Cancelled"],
        default: "Pending"
    },
    userLocation: {
        latitude: Number,
        longitude: Number
    },
    ownerLocation: {
        latitude: Number,
        longitude: Number
    }
}, { timestamps: true });

const Booking = mongoose.model("Booking", bookingSchema);
module.exports = Booking;
