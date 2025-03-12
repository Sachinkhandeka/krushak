import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../components/utils/Loader";
import { fetchWithAuth } from "../utilityFunction";
import { useSelector } from "react-redux"; 

const Alert = React.lazy(()=> import("../components/utils/Alert"));
const BookingCard = React.lazy(()=> import("../components/booking/BookingCard"));
const NoDataFound = React.lazy(()=> import("../components/common/NoDataFound"));

const MyBookings = () => {
    const navigate = useNavigate();
    const { currUser } = useSelector((state) => state.user); 
    const [loading, setLoading] = useState(true);
    const [alert, setAlert] = useState({ type: "", message: "" });
    const [myBookings, setMyBookings] = useState([]);

    useEffect(() => {
        const getBookings = async () => {
            try {
                if (!currUser) {
                    setLoading(false);
                    return;
                }

                // Determine the API endpoint based on user role
                const endpoint = currUser.role === "EquipmentOwner" 
                    ? "/api/v1/bookings/owner" 
                    : "/api/v1/bookings/user";

                const result = await fetchWithAuth(
                    endpoint,
                    { method: "GET" },
                    setLoading,
                    setAlert,
                    navigate
                );

                if (result) {
                    setMyBookings(result.data);
                }
            } catch (error) {
                setAlert({ type: "error", message: error.message });
            } finally {
                setLoading(false);
            }
        };

        getBookings();
    }, [navigate, currUser]); // Include currUser as a dependency

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader size={50} color="green" variant="dots" />
            </div>
        );
    }

    if (myBookings.length === 0) {
        return (
            <NoDataFound
                message="No Bookings Available"
                subMessage="Check back later or book a new equipment."
                action={
                    <Link
                        to={"/"}
                        className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
                        Book Equipment
                    </Link>
                }
            />
        );
    }

    return (
        <section className="p-1">
            {/* Alert Message */}
            <div className="fixed top-14 right-4 z-50 w-[70%] max-w-sm">
                {alert && alert.message && (
                    <Alert type={alert.type} message={alert.message} autoDismiss onClose={() => setAlert(null)} />
                )}
            </div>
            <h2 className="text-2xl p-6 font-bold text-gray-800 dark:text-white mb-4">
                {currUser?.role === "EquipmentOwner" ? "Bookings on My Equipment" : "My Bookings"}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1">
                {myBookings.map((booking) => (
                    <BookingCard key={booking._id} booking={booking}  setAlert={setAlert} />
                ))}
            </div>
        </section>
    );
};

export default MyBookings;
