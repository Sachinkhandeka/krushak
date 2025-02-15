const ApiError = require("../utils/apiError.js");
const ApiResponse = require("../utils/apiResponse.js");
const User = require("../models/user.js");
const uploadOnCloudinary = require("../utils/cloudinary.js");

// generate access and refresh tokens method
const generateAccessAndRefreshToken = async ( userId )=> {
    try {
        const user = await User.findById(userId);

        if(!user) { 
            throw new ApiError(404, "User with given id not found");
        }

        const accessToken = await user.generateAccessToken();
        const refreshToken = await user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave : false });

        return { accessToken, refreshToken }
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating refresh and access tokens");
    }
}

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
    const { username, email, password } = req.body ; 

    // step-1 : check username or email 
    if(!( username || email )) {
        throw new ApiError(400, "username or password is required")
    }
    // step-2 : find the user
    const user = await User.findOne({ $or : [{ username }, { email }] });

    if(!user) {
        throw new ApiError(404, "User with given username or email not exists");
    }
    // step-3 : password check
    const isPassValid = await user.isPasswordCorrect(password);

    if(!isPassValid) {
        throw new ApiError(401, "Invalid user credentials");
    }
    // step-4 : generate access & refresh tokens
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);

    // step-5 : send tokens - cookies and response
    const loggedinUser = await User.findById(user._id).select("-password -refreshToken");

    const options = {
        httpOnly : true,
        secure : true,
    }

    return res.status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(200,
            {
                user : loggedinUser,
                accessToken,refreshToken,
            },
            "User Logged In Successfully"
        )
    )

}

// logout user (protected)
module.exports.logoutUser = async ( req, res )=> {
    const user = req.user; 

    if(!user) {
        throw new ApiError(401, "Could not proccess logout as user not found");
    }

    await User.findByIdAndUpdate(
        user._id,
        {
            $set : {
                refreshToken : undefined,
            },
        },
        {
            new : true
        }
    );

    const options = {
        httpOnly : true,
        secure : true,
    }

    res.status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json( new ApiResponse(200, {}, "User logged Out Successfully") );
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
