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
    wrapAsync( user.getUserProfile ),
);

// Update user profile (Protected)
router.put(
    "/:id",
    wrapAsync( user.updateUserProfile ),
);

// Delete user account
router.delete(
    "/:id",
    wrapAsync( user.deleteUserProfile ),
);

// Get all users (Admin only)
router.get(
    "/",
    wrapAsync( user.getAllUsers ),
);

module.exports = router ; 