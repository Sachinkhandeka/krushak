import React, { useState } from "react";
import Loader from "../utils/Loader";

const EquipmentCard = ({ item }) => {
    const [preview, setPreview] = useState(item.video || item.images[0]);
    const [showAvailability, setShowAvailability] = useState(false);
    const [loading, setLoading] = useState(false);

    return (
        <div className="relative bg-white dark:bg-gray-900 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition">
            {/* Availability Indicator */}
            {item.availability && (
                <div 
                    className="absolute top-3 right-3 w-4 h-4 bg-green-500 rounded-full animate-ping cursor-pointer"
                    onMouseEnter={() => setShowAvailability(true)} 
                    onMouseLeave={() => setShowAvailability(false)}
                    onClick={() => setShowAvailability(!showAvailability)} // For mobile tap
                ></div>
            )}

            {/* Availability Tooltip */}
            {showAvailability && (
                <div className="absolute top-10 right-3 bg-black text-white text-xs px-2 py-1 rounded-md shadow-lg">
                    Available
                </div>
            )}

            {/* Preview Section */}
            <div className="w-full h-72 bg-gray-200 dark:bg-gray-700 overflow-hidden">
                {preview.includes(".mp4") ? (
                    <video controls src={preview} className="w-full h-full object-cover"></video>
                ) : (
                    <img src={preview} alt={item.name} className="w-full h-full object-cover" />
                )}
            </div>

            {/* Image Thumbnails */}
            <div className="flex justify-center gap-2 p-2 bg-gray-100 dark:bg-gray-700">
                {item.images.slice(0, 5).map((img, index) => (
                    <img
                        key={index}
                        src={img}
                        alt={`Thumbnail ${index + 1}`}
                        className={`w-12 h-12 object-cover rounded cursor-pointer border-2 transition ${preview === img ? "border-blue-600" : "border-transparent"}`}
                        onClick={() => setPreview(img)}
                    />
                ))}
            </div>

            {/* Equipment Details */}
            <div className="p-4 space-y-3">
                {/* Title and Tags */}
                <div className="flex flex-col gap-2">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{item.name}</h3>
                    <div className="grid grid-cols-1 gap-1">
                        <span className="px-2 py-1 text-xs font-medium bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-md">{item.category}</span>
                        <span className="px-2 py-1 text-xs font-medium bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-md">{item.type}</span>
                    </div>
                </div>

                {/* Pricing & Condition */}
                <div className="flex justify-between items-center text-sm text-gray-700 dark:text-gray-300">
                    <p className="font-medium">Condition: <span className="font-normal">{item.condition}</span></p>
                    <p className="text-green-600 dark:text-green-400 text-xl font-bold">
                        ₹{item.pricing[0].price} <span className="text-sm font-normal">/ {item.pricing[0].unit}</span>
                    </p>
                </div>

                {/* Brand & Year */}
                <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400">
                    <p>Brand: <span className="font-medium">{item.brand}</span></p>
                    <p>Year: <span className="font-medium">{item.year}</span></p>
                </div>

                {/* Booking Button */}
                <button 
                    className="mt-4 w-full bg-green-600 dark:bg-green-500 text-white py-2 rounded-lg font-semibold hover:bg-green-700 dark:hover:bg-green-600 transition flex items-center justify-center"
                >
                    {loading ? <Loader size={15} color="white" variant="dots" /> : "Book Now"}
                </button>
            </div>
        </div>
    );
};

export default EquipmentCard;
