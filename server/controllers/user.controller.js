const ApiError = require("../utils/apiError.js");
const ApiResponse = require("../utils/apiResponse.js");
const User = require("../models/user.js");
const Equipment = require("../models/equipment.js");
const { uploadOnCloudinary, removeFromCloudinary } = require("../utils/cloudinary.js");
const jwt = require("jsonwebtoken");
const transporter = require("../config/nodeMailer.js");
const profileUpdateMail = require("../emailTemplates/profileUpdateMail.js");
const welcomeMail = require("../emailTemplates/onboardMail.js");
const changePasswordMail = require("../emailTemplates/changePasswordMail.js");
const forgotPasswordMail = require("../emailTemplates/forgotPasswordMail.js");

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

    let user ; 
    try {
        // step6 : create user object - create entry in DB
        user = await User.create({
            displayName : userData.displayName,
            username : userData.username,
            email : userData.email,
            password : userData.password,
            phone : userData.phone,
            role : userData.role,
            avatar : avatar?.secure_url || "",
            coverImage : coverImage?.secure_url || ""
        });
        await user.save();
    } catch (error) {
        throw new ApiError(400, error.message);
    }

    const createdUser = await User.findById(user._id)
    .select("-password -refreshToken");

    if( !createdUser ) {
        throw new ApiError(500, "Something went wrong while registering a user!");
    }

    try {
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: createdUser.email,
            subject: "Welcome to Krushak - Your Farming Partner!",
            html : welcomeMail(createdUser)
        }
        await transporter.sendMail(mailOptions);
    } catch (error) {
        throw new ApiError(500, error.message);
    }

    //  generate access & refresh tokens
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(createdUser._id);

    const options = {
        httpOnly : true,
        secure : true,
        sameSite: "Strict",
        maxAge: 15 * 24 * 60 * 60 * 1000,
    }

    return res.status(201)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(200, 
            {
                user : createdUser,
            }, `Welcome to the krushak platform ${createdUser.displayName}`)
    )
}

//login user controller
module.exports.loginUser = async ( req , res )=> {
    const { emailOrUsernameOrPhone, password } = req.body ; 

    // step-1 : check username or email 
    if(!emailOrUsernameOrPhone ) {
        throw new ApiError(400, "email or username or phone and password is required")
    }
    // step-2 : find the user
    const user = await User.findOne({ 
        $or : [
            { username : emailOrUsernameOrPhone }, 
            { email : emailOrUsernameOrPhone }, 
            { phone : emailOrUsernameOrPhone }
        ] 
    });

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
    const loggedinUser = await User.findById(user._id)
    .select("-password -refreshToken");

    const options = {
        httpOnly : true,
        secure : true,
        sameSite: "Strict",
        maxAge: 15 * 24 * 60 * 60 * 1000,
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
        sameSite: "Strict",
        maxAge: 15 * 24 * 60 * 60 * 1000,
    }

    res.status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json( new ApiResponse(200, {}, "User logged Out Successfully") );
}

// refresh Access token route
module.exports.refreshAccessToken = async ( req, res )=> {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken ; 

    if(!incomingRefreshToken) {
        throw new ApiError(401, "Unauthorized user request");
    } 

    try {
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
    
        const user = await User.findById(decodedToken?._id);
    
        if(!user) {
            throw new ApiError(401, "Invalid user refresh token");
        }
    
        // check incoming refresh token and DB refresh token
        if(incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Refresh token is expired or used");
        }
    
        const options = {
            httpOnly : true,
            secure : true,
            sameSite: "Strict",
            maxAge: 15 * 24 * 60 * 60 * 1000,
        }
        // generate new access and refresh tokens
        const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);
    
        res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    accessToken, refreshToken
                },
                "User access token refreshed successfully",
            )
        );
    } catch (error) {
        throw new ApiError(401, "Invalid user refresh token");
    }
}

// change user password
module.exports.changeCurrentPassword = async ( req, res )=> {
    const { oldPassword, newPassword, confirmPassword } = req.body; 

    if( !oldPassword && !newPassword && !confirmPassword ) {
        throw new ApiError(400, "Please provide old, new and confirm passwords to proceed");
    }
    
    const user = await User.findById(req.user?._id);

    if(!user) {
        throw new ApiError(401, "Unauthorized user request");
    }

    if( newPassword !== confirmPassword ) {
        throw new ApiError(400, "New password and confirm password do not match");
    }

    const isPassValid = await user.isPasswordCorrect(oldPassword);

    if(!isPassValid) {
        throw new ApiError(400, "Invalid current user password");
    }

    const isSamePassword = await user.isPasswordCorrect(newPassword);

    if(isSamePassword) {
        throw new ApiError(400, "New password cannot be the same as the old password");
    }

    user.password = newPassword;
    await user.save({ validateBeforeSave : false });

    try {
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: createdUser.email,
            subject: "Your Password Has Been Changed Successfully - Krushak",
            html : changePasswordMail(user)
        }
        await transporter.sendMail(mailOptions);
    } catch (error) {
        throw new ApiError(500, error.message);
    }

    return res.status(200)
    .json(
        new ApiResponse(
            200,
            {},
            "User password changed successfully"
        )
    );
}

// 	Get user profile (Protected)
module.exports.getUserProfile = async ( req , res )=> {
    return res.status(200)
    .json(
        new ApiResponse(
            200,
            req.user,
            "Logged in user fetched successfully"
        )
    );
}

// Update user profile (Protected)
module.exports.updateUserProfile = async ( req , res )=> {
    const { displayName, email, phone } = req.body ; 

    if(!displayName || !email || !phone) {
        throw new ApiError(400, "All fields are required.");
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set : {
                displayName : displayName,
                email : email,
                phone : phone
            }
        },
        {
            new : true,
        }
    ).select("-password -refreshToken");

    if(!user) {
        throw new ApiError(400, "User not found");
    }

    try {
        const mailOptions =  {
            from : process.env.SENDER_EMAIL,
            to : user.email,
            subject : "Profile Updated Successfully - Krushak",
            html : profileUpdateMail(user),
        }
    
        await transporter.sendMail(mailOptions);
    } catch (error) {
        throw new ApiError(500, error.message);
    }


    return res.status(200)
    .json(
        new ApiResponse(
            200,
            user,
            "Account details updated successfully"
        )
    );
}

// Update user avatar (Protected)
module.exports.updateUserAvatar = async ( req, res )=> {
    const avatarLocalPath = req.file?.path; 

    if(!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is missing");
    }

    if(!req.user) {
        throw new ApiError(400, "Logged in user not found");
    }

    if(req.user?.avatar) {
        await removeFromCloudinary(req.user?.avatar);
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);

    if(!avatar) {
        throw new ApiError(500, "Error while uploading user avatar, Please try again");
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set : {
                avatar : avatar?.secure_url,
            }
        },
        {
            new : true
        }
    ).select("-password -refreshToken");

    return res.status(200)
    .json(
        new ApiResponse(
            200,
            user,
            "Your avatar updated successfully"
        )
    );
}

// Update user coverImage (Protected)
module.exports.updateUserCoverImage = async ( req , res )=> {
    const coverImageLocalPath = req.file?.path ;

    if(!coverImageLocalPath) {
        throw new ApiError(400, "Cover image file is missing");
    }

    if(!req.user) {
        throw new ApiError(400, "Logged in user not found");
    }

    if(req.user?.coverImage !== "") {
        await removeFromCloudinary(req.user?.coverImage);
    }

    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    if(!coverImage) {
        throw new ApiError(500, "Error while uploading user cover image, Please try again");
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set : {
                coverImage : coverImage?.secure_url,
            }
        },
        {
            new : true
        }
    ).select("-password -refreshToken");

    return res.status(200)
    .json(
        new ApiResponse(
            200,
            user,
            "Your cover image updated successfully"
        )
    );
}

// forgot password 
module.exports.forgotUserPassword = async (req, res) => {
    const { emailOrPhone } = req.body;

    if (!emailOrPhone) {
        throw new ApiError(400, "Please provide an email or phone number");
    }

    // Find user by email or phone number
    const user = await User.findOne({ 
        $or: [{ email: emailOrPhone }, { phone: emailOrPhone }] 
    });

    if (!user) {
        throw new ApiError(404, "User account not found with the given input");
    }

    // Generate a reset token
    const token = jwt.sign(
        {
            _id: user._id,
            email: user.email,
        },
        process.env.RESET_TOKEN_SECRET,
        {
            expiresIn: process.env.RESET_TOKEN_EXPIRY,
        }
    );

    const resetURL = process.env.NODE_ENV === "production"
        ? `https://www.krushak.co.in/reset-password/${token}`
        : `http://localhost:5173/reset-password/${token}`;

    try {
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: "Reset Your Password - Krushak",
            html: forgotPasswordMail(user, resetURL),
        };
        await transporter.sendMail(mailOptions);
    } catch (error) {
        throw new ApiError(500, error.message);
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            {},
            "Password reset email sent successfully. Please check your email to proceed"
        )
    );
};


module.exports.resetUserPassword = async ( req , res )=> {
    const { token } = req.params ; 
    const { password, confirmPassword } = req.body ; 

    if(!token) {
        throw new ApiError(400, "Password reset token not found");
    }

    if (!password || !confirmPassword) {
        throw new ApiError(400, "Please provide both password and confirm password.");
    }

    if (password !== confirmPassword) {
        throw new ApiError(409, "Passwords do not match.");
    }

    // Verify the reset token
    const decoded = jwt.verify(token, process.env.RESET_TOKEN_SECRET);
    if(!decoded._id && !decoded.email) {
        throw new ApiError(400, "Invalid or expired password reset token.");
    }

    const user = await User.findById(decoded._id);

    if(!user) {
        throw new ApiError(400, "User not found to reset password");
    }

    user.password = password;
    await user.save();

    return res.status(200)
    .json(
        new ApiResponse(
            200,
            {},
            "Password reset successfully. You can now log in with your new password"
        )
    );
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

// Add or Remove Equipment from Favorites
module.exports.toggleFavoriteEquipment = async (req, res) => {
    const { id, equipmentId } = req.params;

    // Check if user exists
    const user = await User.findById(id);
    if (!user) {
        throw new ApiError(404, "User not found.");
    }

    // Check if equipment exists
    const equipment = await Equipment.findById(equipmentId);
    if (!equipment) {
        throw new ApiError(404, "Equipment not found or permanently deleted.");
    }

    // Check if the equipment is already in favorites
    const isFavorite = user.favorites.includes(equipmentId);

    if (isFavorite) {
        // Remove from favorites
        user.favorites = user.favorites.filter((fav) => fav.toString() !== equipmentId);
        await user.save();
        return res.status(200).json(new ApiResponse(200, user.favorites, "Equipment removed from favorites."));
    } else {
        // Add to favorites
        user.favorites.push(equipmentId);
        await user.save();
        return res.status(200).json(new ApiResponse(200, user.favorites, "Equipment added to favorites."));
    }
}

// get favorite equipments of current user
exports.getFavoriteEquipments = async (req, res, next) => {
    const user = req.user;
        
    if (!user || !user._id) {
        throw new ApiError(401, "Unauthorized: Invalid user request");
    }
        
    // Fetch the user and populate favorites with selected fields
    const userWithFavorites = await User.findById(user._id)
        .select("displayName favorites")
        .populate({
            path: "favorites",
            select: "model year name images video category type condition pricing availabilityArea.district availabilityArea.state owner",
            populate: {
                path: "owner",
                select: "displayName avatar"
            }
        });
        
    if (!userWithFavorites) {
        throw new ApiError(404, "User not found");
    }

    return res.status(200)
    .json(
        new ApiResponse(
            200,
            { favorites : userWithFavorites.favorites },
            "Users favorite equipments found successfully"
        )
    )

};

// Update Recently Viewed Equipment
module.exports.updateRecentlyViewedEquipment = async (req, res) => {
    const { id, equipmentId } = req.params;
    // Find user
    const user = await User.findById(id);
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    // Find if the equipment is already in recently viewed
    const existingEquipment = user.recentlyViewedEquipment.find(
        (item) => item.equipmentId.toString() === equipmentId
    );

    if (existingEquipment) {
        // If found, update the timestamp
        existingEquipment.viewedOn = new Date();
    } else {
        // Otherwise, add to the list and ensure it's unique
        user.recentlyViewedEquipment = [
            { equipmentId, viewedOn: new Date() },
            ...user.recentlyViewedEquipment.filter(
                (item) => item.equipmentId.toString() !== equipmentId
            )
        ];

        // Keep only the last 10 items
        if (user.recentlyViewedEquipment.length > 10) {
            user.recentlyViewedEquipment.pop(); // Remove the oldest entry
        }
    }

    await user.save();

    return res.status(200).json(
        new ApiResponse(200, user.recentlyViewedEquipment, "Recently viewed equipment updated.")
    );
};

// Get Recently Viewed Equipment
module.exports.getRecentlyViewedEquipment = async ( req, res )=> {
    const { id } = req.params ; 

    if(!id) {
        throw new ApiError(404, "Unauthorized user request");
    }

    const recentlyViewedEquipment = await User.findById(id)
    .select("displayName recentlyViewedEquipment")
    .populate({
        path: "recentlyViewedEquipment.equipmentId",
        select: "model year name images video category type condition pricing availabilityArea.district availabilityArea.state owner",
        populate: {
            path: "owner",
            select: "displayName avatar"
        }
    });

    return res.status(200).json(
        new ApiResponse(
            200,
            recentlyViewedEquipment,
            "Recently Viewed Equipment found successfully."
        )
    );


}
