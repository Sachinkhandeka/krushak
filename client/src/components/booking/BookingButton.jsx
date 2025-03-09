import React from "react";
import Loader from "../utils/Loader.jsx";

const BookingButton = ({ isBooked, loading, onClick }) => {
    return (
        <button
            className={`w-full py-3 cursor-pointer flex items-center justify-center gap-2 text-white font-semibold rounded-lg transition ${
                isBooked ? "bg-gray-500 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
            }`}
            onClick={onClick}
            disabled={isBooked}
        >
            {loading ? <Loader size={18} color="white" variant="dots" /> : isBooked ? "Already Booked" : "Continue Booking"}
        </button>
    );
};

export default BookingButton;
