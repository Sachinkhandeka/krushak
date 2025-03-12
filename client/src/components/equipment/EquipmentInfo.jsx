import React, { useState } from "react";
import { FaRupeeSign, FaCheckCircle } from "react-icons/fa";
import Loader from "../utils/Loader";

const BookingComponent = React.lazy(()=> import("../booking/BookingComponent"));

const EquipmentInfo = ({ equipment, owner, pricing, availability, category, type, model, year, condition, description }) => {
    const [loading, setLoading] = useState(false);
    const [showBookingModal, setShowBookingModal] = useState(false);
    return (
        <div className="w-full md:w-2/5 bg-white dark:bg-gray-900  p-4 rounded-lg shadow-lg border border-gray-300 dark:border-gray-700">
            {/* Owner Information with Cover Image */}
            <div className="relative w-full">
                {/* Cover Image */}
                <div className="relative w-full h-24 md:h-28 rounded-md">
                    {owner.coverImage ? (
                        <img 
                            src={owner.coverImage} 
                            alt="Owner Cover" 
                            className="w-full h-full object-cover rounded-md"
                        />
                    ) : (
                        <div className="w-full h-full rounded-md bg-gradient-to-r from-green-500 to-blue-500" />
                    )}
                </div>

                {/* User Info */}
                <div className="relative px-5 pt-5 pb-4 -mt-10 flex items-center gap-4">
                    <div className="w-16 h-16 flex items-center justify-center overflow-hidden bg-gray-300 rounded-full dark:bg-gray-700 border-4 border-white dark:border-gray-900 shadow-md">
                        {owner.avatar ? (
                            <img 
                                src={owner.avatar} 
                                alt={owner.displayName || "Owner"} 
                                className="w-full h-full object-cover rounded-full"
                            />
                        ) : (
                            <span className="text-xl font-semibold text-gray-800 dark:text-gray-300">
                                {owner.displayName[0].toUpperCase()}
                            </span>
                        )}
                    </div>
                    <div className="my-4">
                        <h3 className="font-semibold text-gray-900 dark:text-white text-lg">{owner.displayName}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{owner.role}</p>
                    </div>
                </div>
            </div>

            {/*  Equipment Pricing & Availability */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-1">
                    {pricing && pricing.length > 0 ? (
                        <>
                            <FaRupeeSign className="text-green-600 text-lg" />
                            <span className="text-2xl font-bold text-gray-900 dark:text-white">
                                {pricing[0].price}
                            </span>
                            <span className="text-sm text-gray-600 dark:text-gray-400">/ {pricing[0].unit}</span>
                        </>
                    ) : (
                        <>
                            <FaRupeeSign className="text-green-600 text-lg" />
                            <span className="text-2xl font-bold text-gray-900 dark:text-white">--</span>
                            <span className="text-sm text-gray-600 dark:text-gray-400">/ --</span>
                        </>
                    )}
                </div>
                {availability && (
                    <span className="flex items-center gap-1 text-green-600 bg-green-100 px-3 py-1 text-xs rounded-lg">
                        <FaCheckCircle className="text-green-500" /> Available
                    </span>
                )}
            </div>

            {/*  Equipment Description */}
            {description && (
                <div className="mb-4 bg-gray-100 dark:bg-gray-800 p-3 rounded-lg shadow">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Description</h3>
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{description}</p>
                </div>
            )}

            {/*  Equipment Specifications */}
            <div className="grid grid-cols-1 gap-4 text-sm text-gray-700 dark:text-gray-300">
                <p className="flex items-center gap-2" >
                    📌 
                    <span className="px-2 py-1 text-xs font-medium bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-md">{category}</span>
                </p>
                <p className="flex items-center gap-2" >
                    ⚙️ 
                    <span className="px-2 py-1 text-xs font-medium bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-md">{type}</span>
                </p>
                <p className="flex items-center gap-2" >
                    Model
                    <span className="px-2 py-1 text-xs font-medium bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-md">{model?.modelType || "N/A"}</span>
                </p>
                <p className="flex items-center gap-2" >
                    Year
                    <span className="px-2 py-1 text-xs font-medium bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-md">{year || "N/A"}</span>
                </p>
                <p className="flex items-center gap-2" >
                    Condition 
                    <span className="px-2 py-1 text-xs font-medium bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-md">{condition}</span>
                </p>
                <p className="flex items-center gap-2" >
                    Latest Model 
                    <span className="px-2 py-1 text-xs font-medium bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-md">{model?.isLatestModel ? "Yes" : "No"}</span>
                </p>
            </div>

            {/* Booking Button */}
            <button 
                    className="mt-4 w-full cursor-pointer bg-green-600 dark:bg-green-500 text-white py-2 rounded-lg font-semibold hover:bg-green-700 dark:hover:bg-green-600 transition flex items-center justify-center"
                    onClick={() => {
                        setShowBookingModal(true);
                        setLoading(true);
                    }}
                    disabled={loading}
                >
                    {loading ? <Loader size={15} color="white" variant="dots" /> : "Book Now"}
            </button>

            {/*  Booking Modal */}
            {showBookingModal && (
                <div 
                    className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-40"
                    onClick={(e) => {
                        e.stopPropagation();
                    }}
                >
                    <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg max-w-md w-full z-50">
                        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Booking Confirmation</h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                            Complete your booking for <strong>{equipment.name}</strong> below.
                        </p>

                        {/*  Booking Component */}
                        <BookingComponent
                            equipment={equipment} 
                            owner={equipment.owner} 
                            pricing={equipment.pricing} 
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

export default EquipmentInfo;
