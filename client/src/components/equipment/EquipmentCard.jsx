import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "../utils/Loader";
import BookingComponent from "../booking/BookingComponent";
import ToggleFavorite from "../common/ToggleFavorite";
import { PiUserLight } from "react-icons/pi";
import { useSelector } from "react-redux";
import { fetchWithAuth } from "../../utilityFunction";

const EquipmentCard = ({ item, setAlert }) => {
    const { currUser } = useSelector( state => state.user );
    const navigate = useNavigate();
    const [preview, setPreview] = useState(item.video || item.images[0]); 
    const [showAvailability, setShowAvailability] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [favoriteEquipments, setFavoriteEquipments] = useState([]);
    const [isFavorite, setIsFavorite] = useState(false);

    const getUserFavoriteEquipments = async () => {
        if (!currUser?._id) return;
            try {
                const response = await fetchWithAuth(
                    `/api/v1/users/${currUser._id}/favorites`, 
                    { method: "GET" },
                    setLoading,
                    setAlert,
                    navigate
                );
    
                if (response) {
                    const favorites = response?.data?.favorites || [];
                    setFavoriteEquipments(favorites);

                    //  Set `isFavorite` when data is loaded
                    setIsFavorite(favorites.some(fav => fav._id === item._id));
                }
            } catch (error) {
                console.error("Error fetching favorite equipments:", error);
                setAlert({ type: "error", message: "Failed to load favorite equipments." });
            }
        };
    
        useEffect(() => {
            getUserFavoriteEquipments();
        }, [currUser]);

    //  Function to handle navigation
    const handleCardClick = (e) => {
        if (e.target.tagName === "IMG" || e.target.tagName === "VIDEO") return;
        navigate(`/equipment/${item._id}`);
    };

    return (
        <div 
            onClick={handleCardClick} 
            className="relative bg-white dark:bg-gray-900 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition cursor-pointer"
        >
            {/*  Availability Indicator */}
            {item.availability && (
                <div 
                    className="absolute top-3 right-3 w-4 h-4 bg-green-500 rounded-full animate-ping cursor-pointer"
                    onMouseEnter={() => setShowAvailability(true)} 
                    onMouseLeave={() => setShowAvailability(false)}
                    onClick={(e) => e.stopPropagation()}
                ></div>
            )}

            {/*  Availability Tooltip */}
            {showAvailability && (
                <div className="absolute top-10 right-3 bg-black text-white text-xs px-2 py-1 rounded-md shadow-lg">
                    Available
                </div>
            )}

            {/*  Preview Section */}
            <div className="w-full h-72 bg-gray-200 dark:bg-gray-700 overflow-hidden">
                <ToggleFavorite 
                    itemId={item._id} 
                    isInitiallyFavorite={isFavorite}
                    setAlert={setAlert} 
                />
                {preview && preview.includes(".mp4") ? (
                    <video 
                        controls 
                        src={preview} 
                        className="w-full h-full object-cover"
                        onClick={(e) => e.stopPropagation()} 
                    ></video>
                ) : (
                    <img 
                        src={preview} 
                        alt={item.name} 
                        className="w-full h-full object-cover" 
                        onClick={(e) => e.stopPropagation()}
                    />
                )}
            </div>

            {/*  Image Thumbnails */}
            {item.images.length > 1 && (
                <div className="flex justify-center gap-2 p-2 bg-gray-100 dark:bg-gray-700">
                    {item.images.slice(0, 5).map((img, index) => (
                        <img
                            key={index}
                            src={img}
                            alt={`Thumbnail ${index + 1}`}
                            className={`w-12 h-12 object-cover rounded cursor-pointer border-2 transition ${preview === img ? "border-green-600" : "border-transparent"}`}
                            onClick={(e) => {
                                e.stopPropagation();
                                setPreview(img);
                            }}
                        />
                    ))}
                </div>
            )}

            {/*  Equipment Details */}
            <div className="p-4 space-y-3">
                <div className="flex flex-col gap-2">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{item.name}</h3>
                    <div className="grid grid-cols-1 gap-1">
                        <span className="px-2 py-1 text-xs font-medium bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-md">{item.category}</span>
                        <span className="px-2 py-1 text-xs font-medium bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-md">{item.type}</span>
                    </div>
                </div>

                {/*  Pricing & Condition */}
                <div className="flex items-center justify-end text-sm text-gray-700 dark:text-gray-300">
                    <p className="text-green-600 dark:text-green-400 text-3xl font-bold">
                        ₹{item.pricing[0]?.price || "--"} <span className="text-sm font-normal">/ {item.pricing[0]?.unit || "--"}</span>
                    </p>
                </div>

                <p className="font-medium">Condition: <span className="font-normal">{item.condition}</span></p>

                {/*  Model & Year */}
                <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400">
                    <p>Model: <span className="font-medium">{item.model?.modelType || "N/A"}</span></p>
                    <p>Year: <span className="font-medium">{item.year || "N/A"}</span></p>
                </div>

                {/*  Location */}
                <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400">
                    <p>State: <span className="font-medium">{item.availabilityArea[0]?.state || "N/A"}</span></p>
                    <p>District: <span className="font-medium">{item.availabilityArea[0]?.district || "N/A"}</span></p>
                </div>

                {/*  Owner Details */}
                <div className="flex items-center gap-2 mt-3">
                    { item.owner.avatar !== "" ? (
                        <img 
                            src={item.owner?.avatar} 
                            alt={item.owner?.displayName || "Owner"} 
                            className="w-12 h-12 rounded-full object-cover border border-gray-300 dark:border-gray-600"
                        />
                    ) : (
                        <span className="w-10 h-10 rounded-full flex items-center justify-center object-cover text-gray-400 dark:text-gray-600 border border-gray-300 dark:border-gray-600" >
                            <PiUserLight size={32} />
                        </span>
                    ) }
                    <p className="text-sm text-gray-700 dark:text-gray-300">Owned by <span className="font-medium">{item.owner.displayName}</span></p>
                </div>

                {/* Booking Button */}
                <button 
                    className="mt-4 w-full cursor-pointer bg-green-600 dark:bg-green-500 text-white py-2 rounded-lg font-semibold hover:bg-green-700 dark:hover:bg-green-600 transition flex items-center justify-center"
                    onClick={(e) => {
                        e.stopPropagation(); //  Prevent card click navigation
                        setShowBookingModal(true); //  Open modal
                        setLoading(true);
                    }}
                >
                    {loading ? <Loader size={15} color="white" variant="dots" /> : "Book Now"}
                </button>
            </div>

            {/*  Booking Modal */}
            {showBookingModal && (
                <div 
                    className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-40"
                    onClick={(e) => {
                        e.stopPropagation(); //  Prevent card click navigation
                    }}
                >
                    <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg max-w-md w-full z-50">
                        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Booking Confirmation</h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                            Complete your booking for <strong>{item.name}</strong> below.
                        </p>

                        {/*  Booking Component */}
                        <BookingComponent 
                            equipment={item} 
                            owner={item.owner} 
                            pricing={item.pricing} 
                        />

                        {/* ❌ Close Button */}
                        <button 
                            className="mt-4 w-full cursor-pointer bg-gray-500 text-white py-2 rounded-lg font-semibold hover:bg-gray-600 transition"
                            onClick={() => {
                                setShowBookingModal(false);
                                setLoading(false);
                            }}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EquipmentCard;
