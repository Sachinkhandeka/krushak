import React, { useState } from "react";
import { FaPhoneAlt, FaRupeeSign } from "react-icons/fa";
import { MdPending, MdCheckCircle, MdCancel, MdTrackChanges, MdDone } from "react-icons/md";
import { useSelector } from "react-redux";
import { fetchWithAuth } from "../../utilityFunction";
import { useNavigate } from "react-router-dom";
import Modal from "../common/Modal";

// Color-coded status mapping
const statusColors = {
    Pending: "bg-yellow-500",
    Confirmed: "bg-blue-500",
    Tracking: "bg-purple-500",
    Completed: "bg-green-500",
    Cancelled: "bg-red-500",
};

// Icon mapping for statuses
const statusIcons = {
    Pending: <MdPending />,
    Confirmed: <MdCheckCircle />,
    Tracking: <MdTrackChanges />,
    Completed: <MdDone />,
    Cancelled: <MdCancel />,
};

const BookingCard = ({ booking, setAlert, setIsBookingUpdated }) => {
    const navigate = useNavigate();
    const { currUser } = useSelector((state) => state.user);
    const { equipment, owner, status, createdAt } = booking;
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState(""); 

    // Open modal for confirm/reject action
    const handleModalOpen = (type) => {
        setModalType(type);
        setIsModalOpen(true);
    };

    // Close modal
    const handleModalClose = () => {
        setIsModalOpen(false);
        setModalType("");
    };

    // Handle Confirm Booking
    const handleConfirmBooking = async () => {
        setLoading(true);
        try {
            const result = await fetchWithAuth(
                `/api/v1/bookings/${booking._id}/confirm`, 
                { method: "PUT" },
                setLoading,
                setAlert,
                navigate
            );

            if (result) {
                setAlert({ type: "success", message: "Booking confirmed successfully!" });
                setIsBookingUpdated();
            }
        } catch (error) {
            setAlert({ type: "error", message: "Failed to confirm booking." });
        } finally {
            handleModalClose();
            setLoading(false);
        }
    };

    // Handle Cancel Booking
    const handleCancelBooking = async () => {
        setLoading(true);
        try {
            const result = await fetchWithAuth(
                `/api/v1/bookings/${booking._id}/cancel`, 
                { method: "PATCH" },
                setLoading,
                setAlert,
                navigate
            );

            if (result) {
                setAlert({ type: "success", message: "Booking rejected successfully!" });
                setIsBookingUpdated();
            }
        } catch (error) {
            setAlert({ type: "error", message: "Failed to reject booking." });
        } finally {
            handleModalClose();
            setLoading(false);
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 flex flex-col">
            {/* Equipment Image */}
            <img
                src={equipment?.images?.[0] || "/default-equipment.jpg"}
                alt={equipment?.name || "Equipment"}
                className="w-full h-40 object-cover rounded-md"
            />

            {/* Equipment Details */}
            <div className="mt-4 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {equipment?.name || "Unknown Equipment"}
                </h3>
                <div className="flex items-center gap-1">
                    {equipment?.pricing?.[0] ? (
                        <>
                            <FaRupeeSign className="text-green-600 text-lg" />
                            <span className="text-2xl font-bold text-gray-900 dark:text-white">
                                {equipment.pricing[0].price}
                            </span>
                            <span className="text-sm text-gray-600 dark:text-gray-400">/ {equipment.pricing[0].unit}</span>
                        </>
                    ) : (
                        <>
                            <FaRupeeSign className="text-green-600 text-lg" />
                            <span className="text-2xl font-bold text-gray-900 dark:text-white">--</span>
                            <span className="text-sm text-gray-600 dark:text-gray-400">/ --</span>
                        </>
                    )}
                </div>
            </div>

            {/* Owner/User Details */}
            <div className="mt-4 px-6">
                <h4 className="text-md font-semibold text-gray-800 dark:text-gray-200">
                    {currUser.role === "EquipmentOwner" ? "User Details" : "Owner Details"}
                </h4>
                {booking.status !== "Cancelled" && (
                    <p className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
                        <FaPhoneAlt className="text-green-500" />
                        {currUser.role === "EquipmentOwner" ? booking.user?.phone || "N/A" : booking.owner?.phone || "N/A"}
                    </p>
                )}
                <p className="text-gray-600 dark:text-gray-400">
                    {currUser.role === "EquipmentOwner" ? booking.user?.displayName || "N/A" : booking.owner?.displayName || "N/A"}
                </p>
            </div>

            {/* Booking Status */}
            <div className="my-4 px-6 flex items-center">
                <span className={`flex items-center gap-2 px-3 py-1 text-sm font-semibold text-white rounded-full ${statusColors[status]}`}>
                    {statusIcons[status]} {status}
                </span>
            </div>

            {/* Booking Date */}
            <p className="text-gray-500 my-4 px-6 text-sm mt-2">Booked on: {new Date(booking.createdAt).toLocaleDateString()}</p>

            {/* Confirm & Cancel Buttons (Only for Equipment Owners) */}
            {currUser.role === "EquipmentOwner" && (
                <div className="mt-4 px-6 pb-4 flex gap-4">
                    <button
                        onClick={() => handleModalOpen("confirm")}
                        disabled={booking.status === "Confirmed"}
                        className={`px-4 py-2 cursor-pointer rounded-md transition 
                            ${booking.status === "Confirmed" ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 text-white"}`}
                    >
                        {booking.status === "Confirmed" ? "Confirmed" : "Confirm"}
                    </button>

                    <button
                        onClick={() => handleModalOpen("reject")}
                        disabled={booking.status === "Cancelled"}
                        className={`px-4 py-2 cursor-pointer rounded-md transition 
                            ${booking.status === "Cancelled" ? "bg-gray-400 cursor-not-allowed" : "bg-red-600 hover:bg-red-700 text-white"}`}
                    >
                        {booking.status === "Cancelled" ? "Rejected" : "Reject"}
                    </button>
                </div>
            )}

            {/* Confirmation Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={handleModalClose}
                onConfirm={modalType === "confirm" ? handleConfirmBooking : handleCancelBooking}
                title={modalType === "confirm" ? "Confirm Booking" : "Reject Booking"}
                message={modalType === "confirm" ? "Are you sure you want to confirm this booking?" : "Are you sure you want to reject this booking?"}
                confirmText={modalType === "confirm" ? "Confirm" : "Reject"}
                cancelText="Cancel"
                loading={loading}
            />
        </div>
    );
};

export default BookingCard;
