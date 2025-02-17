const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true,
    },
    equipment : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Equipment",
        required : true,
    },
    owner : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true,
    },
    payment : {
        amount : {
            type : Number,
            required : true,
        },
        paymentType : {
            type : String,
            enum : ["Cash", "Online"],
            default : "Cash",
        },
        status : {
            type : String,
            enum : ["Pending", "Paid", "Cancelled"],
            default : "Pending",
        },
    },
    status : {
        type: String,
        enum: ["Pending", "Approved", "Completed", "Cancelled"],
        default: "Pending",
    }
});

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking ; 