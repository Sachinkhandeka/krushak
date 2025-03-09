import React, { useState, useEffect } from "react";
import { fetchWithAuth } from "../../utilityFunction.js";
import { useNavigate } from "react-router-dom";
import Alert from "../utils/Alert.jsx";
import BookingButton from "./BookingButton.jsx";
import BookingModal from "./BookingModal.jsx";
import OwnerContactCard from "./OwnerContactCard.jsx";

const BookingComponent = ({ equipment, owner, pricing }) => {
    const navigate = useNavigate();
    const [isBooked, setIsBooked] = useState(false);
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState({ type: "", message: "" });
    const [showModal, setShowModal] = useState(false);
    const [ownerContact, setOwnerContact] = useState(null);

    useEffect(() => {
        checkBookingStatus();
    }, [equipment._id]);

    const checkBookingStatus = async () => {
        try {
            const response = await fetchWithAuth(
                "/api/v1/bookings/user",
                { method: "GET" },
                setLoading,
                setAlert,
                navigate
            );
    
            if (response?.data) {
                const activeBookings = response.data.some(
                    booking => 
                        booking.equipment._id === equipment._id && 
                        ["Pending", "Confirmed", "Tracking"].includes(booking.status) 
                );
                setIsBooked(activeBookings);
            }
        } catch (error) {
            console.error("Booking check failed:", error);
        }
    };
    

    const handleBooking = async () => {
        setLoading(true);
        try {
            const response = await fetchWithAuth(
                "/api/v1/bookings",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ equipmentId : equipment._id }),
                },
                setLoading,
                setAlert,
                navigate
            );

            if (response) {
                setOwnerContact({
                    phone: response.data.ownerPhone,
                    name: response.data.ownerName,
                });
                setIsBooked(true);
                setShowModal(false);
                setAlert({ type: "success", message: "Booking successful! Contact the owner to proceed." });
            }
        } catch (error) {
            console.error("Booking error:", error);
            setAlert({ type: "error", message: error.message || "Failed to book equipment" });
        }
    };

    return (
        <div className="mt-6">
            {/*  Display Alerts */}
            {alert.message && (
                <Alert type={alert.type} message={alert.message} autoDismiss onClose={() => setAlert({ type: "", message: "" })} />
            )}

            {/*  Booking Button */}
            <BookingButton isBooked={isBooked} loading={loading} onClick={() => setShowModal(true)} />

            {/*  Booking Modal */}
            {showModal && (
                <BookingModal 
                    owner={owner}
                    equipment={equipment}
                    pricing={pricing} 
                    onConfirm={handleBooking} 
                    onClose={() => setShowModal(false)} 
                    loading={loading} 
                    alert={alert}
                    setAlert={setAlert}
                />
            )}

            {/*  Owner Contact Card */}
            {ownerContact && <OwnerContactCard ownerContact={ownerContact} />}
        </div>
    );
};

export default BookingComponent;
