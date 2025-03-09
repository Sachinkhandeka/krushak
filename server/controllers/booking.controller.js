const ApiError = require("../utils/apiError.js");
const ApiResponse = require("../utils/apiResponse.js");
const Equipment = require("../models/equipment.js");
const Booking = require("../models/booking.js");
const transporter = require("../config/nodeMailer.js");
const { 
    bookingConfirmationEmail, ownerBookingNotificationEmail,
    adminBookingNotificationEmail, bookingStatusUpdateEmail 
} = require("../emailTemplates/booking.js");

//book equipment
module.exports.bookEquipment = async (req, res) => {
    const { equipmentId } = req.body;
    const userId = req.user?._id;

    // 1️ Validate Equipment
    const equipment = await Equipment.findById(equipmentId).populate("owner", "email phone displayName");

    if (!equipment) {
        throw new ApiError(404, "Equipment not found");
    }

    if (equipment.owner._id.toString() === userId.toString()) {
        throw new ApiError(400, "You cannot book your own equipment");
    }

    // 2️ Prevent Duplicate Active Bookings
    const existingBooking = await Booking.findOne({
        user: userId,
        equipment: equipmentId,
        status: { $in: ["Pending", "Confirmed", "Tracking"] }
    });

    if (existingBooking) {
        throw new ApiError(400, "You have already booked this equipment and it's currently in progress.");
    }

    // 3️ Create New Booking Entry
    const booking = await Booking.create({
        user: userId,
        equipment: equipmentId,
        owner: equipment.owner._id
    });

    // 4️ Send Email Notifications
    try {
        // Fetch user details
        const user = req.user; // Assuming user details are available in req.user

        //  Email to User
        await transporter.sendMail({
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: "🚜 Booking Confirmation - Krushak",
            html: bookingConfirmationEmail(user, equipment.owner, equipment)
        });

        //  Email to Owner
        await transporter.sendMail({
            from: process.env.SENDER_EMAIL,
            to: equipment.owner.email,
            subject: "📢 New Booking Notification - Krushak",
            html: ownerBookingNotificationEmail(user, equipment.owner, equipment)
        });

        //  Email to Admin
        await transporter.sendMail({
            from: process.env.SENDER_EMAIL,
            to: process.env.ADMIN_EMAIL,
            subject: "🔔 New Equipment Booking Alert",
            html: adminBookingNotificationEmail(user, equipment.owner, equipment)
        });

    } catch (error) {
        console.error("Email sending failed:", error);
        throw new ApiError(500, "Booking successful, but email notification failed.");
    }

    // 5️ Return Response
    return res.status(201).json(
        new ApiResponse(201, {
            bookingId: booking._id,
            ownerPhone: equipment.owner.phone,
            ownerName: equipment.owner.displayName
        }, "Equipment booked successfully. Contact the owner to proceed.")
    );
};

// cancel booking
module.exports.cancelBooking = async (req, res) => {
    const { bookingId } = req.params;
    const userId = req.user._id;

    // 1️ Validate Booking
    const booking = await Booking.findById(bookingId).populate("equipment owner user");

    if (!booking) {
        throw new ApiError(404, "Booking not found");
    }

    if (booking.user._id.toString() !== userId.toString()) {
        throw new ApiError(403, "You are not authorized to cancel this booking");
    }

    if (booking.status === "Cancelled") {
        throw new ApiError(400, "Booking is already cancelled");
    }

    // 2️ Update Status to Cancelled
    booking.status = "Cancelled";
    await booking.save();

    // 3️ Send Cancellation Emails
    try {
        await transporter.sendMail({
            from: process.env.SENDER_EMAIL,
            to: booking.user.email,
            subject: "🚫 Booking Cancelled - Krushak",
            html: bookingStatusUpdateEmail(booking.user, booking.owner, booking.equipment, "Cancelled")
        });

        await transporter.sendMail({
            from: process.env.SENDER_EMAIL,
            to: booking.owner.email,
            subject: "🚨 Booking Cancelled Notification - Krushak",
            html: bookingStatusUpdateEmail(booking.user, booking.owner, booking.equipment, "Cancelled")
        });

        await transporter.sendMail({
            from: process.env.SENDER_EMAIL,
            to: process.env.ADMIN_EMAIL,
            subject: "🚨 Booking Cancelled Alert - Krushak",
            html: bookingStatusUpdateEmail(booking.user, booking.owner, booking.equipment, "Cancelled")
        });

    } catch (error) {
        console.error("Cancellation email failed:", error);
    }

    return res.status(200).json(
        new ApiResponse(200, {}, "Booking cancelled successfully")
    );
};

// get all user bookings
module.exports.getUserBookings = async (req, res) => {
    const userId = req.user?._id;

    const bookings = await Booking.find({ user: userId })
        .populate("equipment", "name images pricing")
        .populate("owner", "displayName phone");

    return res.status(200).json(
        new ApiResponse(200, bookings, "User bookings fetched successfully")
    );
};

// get all owner bookings
module.exports.getOwnerBookings = async (req, res) => {
    const ownerId = req.user?._id;

    const bookings = await Booking.find({ owner: ownerId })
        .populate("equipment", "name images pricing")
        .populate("user", "displayName phone");

    return res.status(200).json(
        new ApiResponse(200, bookings, "Owner bookings fetched successfully")
    );
};

// confirm booking (owner only)
module.exports.confirmBooking = async (req, res) => {
    const { bookingId } = req.params;
    const ownerId = req.user._id;

    const booking = await Booking.findById(bookingId).populate("equipment owner user");

    if (!booking) {
        throw new ApiError(404, "Booking not found");
    }

    if (booking.owner._id.toString() !== ownerId.toString()) {
        throw new ApiError(403, "You are not authorized to confirm this booking");
    }

    booking.status = "Confirmed";
    await booking.save();

    // Send Confirmation Emails
    try {
        await transporter.sendMail({
            from: process.env.SENDER_EMAIL,
            to: booking.user.email,
            subject: "✅ Booking Confirmed - Krushak",
            html: bookingStatusUpdateEmail(booking.user, booking.owner, booking.equipment, "Confirmed")
        });

        await transporter.sendMail({
            from: process.env.SENDER_EMAIL,
            to: booking.owner.email,
            subject: "✅ Booking Confirmed Notification - Krushak",
            html: bookingStatusUpdateEmail(booking.user, booking.owner, booking.equipment, "Confirmed")
        });

        await transporter.sendMail({
            from: process.env.SENDER_EMAIL,
            to: process.env.ADMIN_EMAIL,
            subject: "✅ Booking Confirmed Alert - Krushak",
            html: bookingStatusUpdateEmail(booking.user, booking.owner, booking.equipment, "Confirmed")
        });

    } catch (error) {
        console.error("Booking confirmation email failed:", error);
    }

    return res.status(200).json(new ApiResponse(200, {}, "Booking confirmed successfully"));
};


