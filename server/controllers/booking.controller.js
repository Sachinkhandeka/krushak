const ApiError = require("../utils/apiError.js");
const ApiResponse = require("../utils/apiResponse.js");
const Equipment = require("../models/equipment.js");
const Booking = require("../models/booking.js");

//book equipment
module.exports.bookEquipment = async ( req, res )=> {
    const { equipmentId } = req.body;
    const userId = req.user?._id;

    //  1. Validate Equipment
    const equipment = await Equipment.findById(equipmentId).populate("owner", "phone displayName");

    if (!equipment) {
        throw new ApiError(404, "Equipment not found");
    }

    if (equipment.owner._id.toString() === userId.toString()) {
        throw new ApiError(400, "You cannot book your own equipment");
    }

    //  2. Check if Booking Already Exists (Prevent Duplicates)
    const existingBooking = await Booking.findOne({
        user: userId,
        equipment: equipmentId,
        status: { $ne: "Cancelled" }
    });

    if (existingBooking) {
        throw new ApiError(400, "You have already booked this equipment.");
    }

    //  3. Create New Booking Entry
    const booking = await Booking.create({
        user: userId,
        equipment: equipmentId,
        owner: equipment.owner._id
    });

    //  4. Return Equipment Owner's Phone Number
    return res.status(201).json(
        new ApiResponse(201, {
            bookingId: booking._id,
            ownerPhone: equipment.owner.phone,
            ownerName: equipment.owner.displayName
        }, "Equipment booked successfully. Contact the owner to proceed.")
    );
}

// cancel booking
module.exports.cancelBooking = async (req, res) => {
    const { bookingId } = req.params;
    const userId = req.user._id;

    //  1. Validate Booking
    const booking = await Booking.findById(bookingId);

    if (!booking) {
        throw new ApiError(404, "Booking not found");
    }

    if (booking.user.toString() !== userId.toString()) {
        throw new ApiError(403, "You are not authorized to cancel this booking");
    }

    if (booking.status === "Cancelled") {
        throw new ApiError(400, "Booking is already cancelled");
    }

    //  2. Update Status to Cancelled
    booking.status = "Cancelled";
    await booking.save();

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

    const booking = await Booking.findById(bookingId);

    if (!booking) {
        throw new ApiError(404, "Booking not found");
    }

    if (booking.owner.toString() !== ownerId.toString()) {
        throw new ApiError(403, "You are not authorized to confirm this booking");
    }

    booking.status = "Confirmed";
    await booking.save();

    return res.status(200).json(new ApiResponse(200, {}, "Booking confirmed successfully"));
};

// confirm booking (owner only)
module.exports.rejectBooking = async (req, res) => {
    const { bookingId } = req.params;
    const ownerId = req.user._id;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
        throw new ApiError(404, "Booking not found");
    }

    if (booking.owner.toString() !== ownerId.toString()) {
        throw new ApiError(403, "You are not authorized to reject this booking");
    }

    booking.status = "Rejected";
    await booking.save();

    return res.status(200).json(new ApiResponse(200, {}, "Booking rejected successfully"));
};


