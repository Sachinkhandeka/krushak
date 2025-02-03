const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    firstName : {
        type : String,
        required : true,
        trim : true,
    },
    lastName : {
        type : String,
        required : true,
        trim : true,
    },
    email : {
        type : String,
        required : true,
        unique : true,
        trim : true,
        lowercase : true,
        match : [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    password : {
        type : String,
        required : true,
        minlength : 8
    },
    phone : {
        type : String,
        required : true,
    },
    role : {
        type : String,
        enum : ['Admin', 'Farmer', 'EquipmentOwner'],
        required : true,
    },
    refreshToken : {
        type : String,
        required : true,
    },
    lastLogin: {
        type: Date,
    },
    lastLoginIP: {
        type: String,
    },
    loginDevices: [
        {
            device: String, // e.g., "Desktop", "Mobile", "Tablet"
            browser: String, // e.g., "Chrome", "Firefox", "Safari"
            os: String, // e.g., "Windows", "macOS", "iOS", "Android"
            ipAddress: String,
            lastAccessed: Date,
        },
    ],
}, { timestamps : true });

const User = mongoose.model("User", userSchema);

module.exports = User ; 