const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");

const userSchema = new mongoose.Schema({
    displayName : {
        type : String,
        required : true,
        trim : true,
        index : true,
    },
    username : {
        type : String,
        required : true,
        trim : true,
        unique : true,
        lowercase : true,
        index : true,
    },
    email : {
        type : String,
        required : true,
        unique : true,
        trim : true,
        lowercase : true,
        match : [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    avatar : {
        type : String,
    },
    coverImage : {
        type : String,
    },
    password : {
        type : String,
        required : [true, 'Password is required'],
        minlength : 6
    },
    phone : {
        type : String,
        required : true,
    },
    role : {
        type : String,
        enum : ['Admin', 'Farmer', 'EquipmentOwner'],
    },
    recentlyViewedEquipment: [
        {
            equipmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Equipment', unique: true },
            viewedOn: { type: Date, default: Date.now }
        }
    ],
    favorites: [
        { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Equipment',
            unique: true
        }
    ],
    refreshToken : {
        type : String,
    }
}, { timestamps : true });

//function to hash password before saving into DB
userSchema.pre("save", async function (next) {
    if(this.isModified("password")) {
        this.password = await bcryptjs.hash(this.password , 10);
        next();
    }
    next();
});

//method to check if password is correct or not
userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcryptjs.compare(password, this.password);
}

//method to generate access token 
userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id : this._id,
            username : this.username,
            displayName : this.displayName,
            role : this.role,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn : process.env.ACCESS_TOKEN_EXPIRY
        }
    );
}

//method to generate refresh token 
userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id : this._id,
            role : this.role,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn : process.env.REFRESH_TOKEN_EXPIRY
        }
    );
}

const User = mongoose.model("User", userSchema);

module.exports = User ; 