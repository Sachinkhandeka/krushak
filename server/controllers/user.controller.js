const ApiError = require("../utils/apiError.js");
const ApiResponse = require("../utils/apiResponse.js");
const User = require("../models/user.js");
const uploadOnCloudinary = require("../utils/cloudinary.js");

//register user controller
module.exports.registerUser = async ( req , res )=> {
    const { userData } = req.body ; 

    // step3 : check for duplicate user creation ( username & email )
    const isUserExists = await User.findOne({
        $or : [{ username : userData.username }, { email : userData.email }]
    });

    if(isUserExists) {
        throw new ApiError(409, "User with this email or username already exists!");
    }

    // step4 : check for avatar & cover image
    let avatarLocalPath, coverImageLocalPath;

    if( req.files && Array.isArray(req.files.avatar) && req.files.avatar.length > 0 ) {
        avatarLocalPath = req.files.avatar[0].path;
    }

    if( req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0 ) {
        coverImageLocalPath = req.files.coverImage[0].path ; 
    }
    // const avatarLocalPath = req.files?.avatar[0]?.path ; 
    // const coverImageLocalPath = req.files?.coverImage[0]?.path ; 

    // step5 : upload to cloudinary and fetch url 
    const avatar = avatarLocalPath ? await uploadOnCloudinary(avatarLocalPath) : undefined;
    const coverImage = coverImageLocalPath ? await uploadOnCloudinary(coverImageLocalPath) : undefined ; 

    // step6 : create user object - create entry in DB
    const user = await User.create({
        displayName : userData.displayName,
        username : userData.username,
        email : userData.email,
        password : userData.password,
        phone : userData.phone,
        role : userData.role,
        avatar : avatar?.url || "",
        coverImage : coverImage?.url || ""
    });
    await user.save();

    const createdUser = await User.findById(user._id).select("-password -refreshToken");

    if( !createdUser ) {
        throw new ApiError(500, "Something went wrong while registering a user!");
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered successfully")
    )
}

//login user controller
module.exports.loginUser = async ( req , res )=> {
    console.log("login user route on the mark!");
    res.status(200).json({
        message : "Ok from login!"
    });
}

// 	Get user profile (Protected)
module.exports.getUserProfile = async ( req , res )=> {
    console.log("Get user Rounte on mark!");
    res.status(200).json({
        message : "Ok from getUserProfile!"
    });
}

// Update user profile (Protected)
module.exports.updateUserProfile = async ( req , res )=> {
    console.log("Update route on the mark!");
    res.status(200).json({
        message : "Ok from updateUserProfile!",
    });
}

// Delete user account
module.exports.deleteUserProfile = async ( req , res )=> {
    console.log("delete user route on the mark!");
    res.status(200).json({
        message : "Ok from deleteUserProfile!",
    });
}

// Get all users (Admin only)
module.exports.getAllUsers = async ( req , res )=> {
    console.log("Gel all user routes on the  mark!");
    res.status(200).json({
        message : "Ok from getAllUsers!",
    });
}
