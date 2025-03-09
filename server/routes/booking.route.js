const express = require("express");
const router = express.Router({ mergeParams : true });
const verifyJwt = require("../middlewares/auth.middleware.js");
const booking = require("../controllers/booking.controller.js");
const wrapAsync = require("../utils/wrapAsync.js");

//  Book Equipment
router.post("/", verifyJwt, wrapAsync(booking.bookEquipment));

//  Cancel Booking
router.patch("/:bookingId/cancel", verifyJwt, wrapAsync(booking.cancelBooking));

//  Get User's Bookings
router.get("/user", verifyJwt, wrapAsync(booking.getUserBookings));

//  Get Owner's Bookings
router.get("/owner", verifyJwt, wrapAsync(booking.getOwnerBookings));

// confirm booking
router.put(
    "/:bookingId/confirm",
    verifyJwt,
    wrapAsync(booking.confirmBooking),
);


module.exports = router ; 