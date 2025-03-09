import React from "react";
import { FaRupeeSign, FaCheckCircle } from "react-icons/fa";
import { PiUserLight } from "react-icons/pi";

const EquipmentInfo = ({ owner, pricing, availability, category, type, model, year, condition, description }) => {
    return (
        <div className="w-full md:w-2/5 bg-white dark:bg-gray-900  p-6 rounded-lg shadow-lg border border-gray-300 dark:border-gray-700">
            {/*  Owner Information */}
            <div className="flex items-center gap-4 border-b border-gray-300 pb-4 mb-4 dark:border-gray-700">
                { owner.avatar !== "" ? (
                    <img 
                        src={owner?.avatar || "/default-avatar.png"} 
                        alt={owner?.displayName || "Owner"} 
                        className="w-12 h-12 rounded-full object-cover border border-gray-300 dark:border-gray-600"
                    />
                ) : (
                    <span className="w-12 h-12 rounded-full flex items-center justify-center object-cover text-gray-400 dark:text-gray-600 border border-gray-300 dark:border-gray-600" >
                        <PiUserLight size={42} />
                    </span>
                ) }
                <div>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">{owner.displayName}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{owner.email}</p>
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

            {/*  Booking Button */}
            <button 
                className="mt-6 w-full cursor-pointer bg-gradient-to-r from-green-500 to-green-600 dark:from-green-600 dark:to-green-700 text-white py-2 rounded-lg font-semibold hover:shadow-lg transition-all"
            >
                Book Now
            </button>
        </div>
    );
};

export default EquipmentInfo;
