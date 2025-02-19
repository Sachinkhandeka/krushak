const express = require("express");
const router = express.Router({ mergeParams : true });
const wrapAsync = require("../utils/wrapAsync.js");
const user = require("../controllers/user.controller.js");
const validateUserSchema = require("../middlewares/user.middleware.js");
const upload = require("../middlewares/multer.middleware.js");
const verifyJwt = require("../middlewares/auth.middleware.js");

// register user route
router.post(
    "/register",
    validateUserSchema,
    upload.fields([
        {
            name : "avatar",
            maxCount : 1,
        },
        {
            name : "coverImage",
            maxCount : 1,
        },
    ]),
    wrapAsync( user.registerUser ),
);

// login user route
router.post(
    "/login",
    wrapAsync( user.loginUser ),
);

// secured routed (requires access token verification)
// logout user
router.post(
    "/logout",
    verifyJwt,
    wrapAsync(user.logoutUser),
);

// refresh user access token 
router.post(
    "/refresh-token",
    wrapAsync(user.refreshAccessToken),
);

// 	Get user profile (Protected)
router.get(
    "/profile",
    verifyJwt,
    wrapAsync( user.getUserProfile ),
);

// change current password
router.post(
    "/profile/reset-password",
    verifyJwt,
    wrapAsync(user.changeCurrentPassword),
);

// Update user profile (Protected)
router.put(
    "/profile/:id",
    wrapAsync( user.updateUserProfile ),
);

// Delete user account
router.delete(
    "/profile/:id",
    wrapAsync( user.deleteUserProfile ),
);

// Get all users (Admin only)
router.get(
    "/admin/users",
    wrapAsync( user.getAllUsers ),
);

module.exports = router ; 