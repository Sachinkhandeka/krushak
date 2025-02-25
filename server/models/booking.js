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
        transactionId: {
            type: String, 
            default: null,
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
    },
    cancellation: {
        isCancelled: {
            type: Boolean,
            default: false,
        },
        cancelledBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },
        reason: {
            type: String,
            default: "",
        },
        refundStatus: {
            type: String,
            enum: ["Not Initiated", "In Progress", "Completed", "No Refund"],
            default: "Not Initiated",
        },
        refundAmount: {
            type: Number,
            default: 0,
        },
        cancelledAt: {
            type: Date,
            default: null,
        },
    }
});

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking ; 