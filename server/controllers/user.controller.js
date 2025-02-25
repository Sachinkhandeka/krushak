const ApiError = require("../utils/apiError.js");
const ApiResponse = require("../utils/apiResponse.js");
const User = require("../models/user.js");
const uploadOnCloudinary = require("../utils/cloudinary.js");
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
    const { displayName, email } = req.body ; 

    if(!displayName || !email) {
        throw new ApiError(400, "All fields are required.");
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set : {
                displayName : displayName,
                email : email,
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

    const avatar = await uploadOnCloudinary(avatarLocalPath);

    if(!avatar) {
        throw new ApiError(500, "Error while uploading user avatar, Please try again");
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set : {
                avatar : avatar?.url,
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

    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    if(!coverImage) {
        throw new ApiError(500, "Error while uploading user cover image, Please try again");
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set : {
                coverImage : coverImage?.url,
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
module.exports.forgotUserPassword = async ( req , res )=> {
    const { email, phoneNumber } = req.body ; 

    if( !(email || phoneNumber) ) {
        throw new ApiError(400, "Please provide email or phone number");
    }

    let user ; 

    if( email ) {
        user = await User.findOne({ email : email });
    }else if (phoneNumber) {
        user = await User.findOne({ phone : phoneNumber });
    }

    if(!user) {
        throw new ApiError(404, "User account not found with given input");
    }

    const token = jwt.sign(
        {
            _id : user._id,
            email : user.email,
        },
        process.env.RESET_TOKEN_SECRET,
        {
            expiresIn : process.env.RESET_TOKEN_EXPIRY,
        }
    );

    const resetURL = process.env.NODE_ENV === "production" ? 
        `https://www.krushak.co.in/reset-password/${token}`:
        `http://localhost:5173/reset-password/${token}`;

    try {
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: "Reset Your Password - Krushak",
            html : forgotPasswordMail(user, resetURL)
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
            "Password reset email sent successfully. Please check your email to proceed"
        )
    )

}

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
