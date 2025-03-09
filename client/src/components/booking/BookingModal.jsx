import React from "react";
import { FaRupeeSign, FaTimes } from "react-icons/fa";
import Loader from "../utils/Loader.jsx";
import { VscVerifiedFilled } from "react-icons/vsc";
import { PiUserLight } from "react-icons/pi";
import Alert from "../utils/Alert.jsx";

const BookingModal = ({ owner, equipment, pricing, onConfirm, onClose, loading, alert, setAlert }) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
            <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-xl max-w-sm w-full relative">
                {/* Close Button */}
                <button 
                    className="absolute cursor-pointer top-3 right-3 text-gray-600 dark:text-gray-300 hover:text-red-500"
                    onClick={onClose}
                >
                    <FaTimes size={18} />
                </button>

                <h2 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                    Confirm Booking
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                    Are you sure you want to book this equipment?
                </p>

                {/*  Display Alerts */}
                {alert.message && (
                    <Alert type={alert.type} message={alert.message} autoDismiss onClose={() => setAlert({ type: "", message: "" })} />
                )}
                {/* Pricing & Owner Details */}
                <div className="mt-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-300 dark:border-gray-700">
    
                    {/* Header */}
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                        Equipment Pricing & Owner Details
                    </h3>

                    {/* Price Details */}
                    <div className="flex justify-between items-center border-b pb-2 border-gray-300 dark:border-gray-600">
                        <div className="flex items-center gap-0.5">
                            <FaRupeeSign className="text-green-500 text-xl" />
                            <p className="text-gray-900 dark:text-gray-200 font-medium">
                                {pricing[0]?.price || "N/A"} 
                                <span className="text-sm text-gray-500 dark:text-gray-400"> / {pricing[0]?.unit || "N/A"}</span>
                            </p>
                        </div>
                        <span className="text-xs bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300 px-2 py-1 rounded-md">
                            Best Price Guaranteed
                        </span>
                    </div>

                    {/* Owner Details */}
                    <div className="flex items-center gap-3 mt-3">
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
                            <p className="text-gray-800 dark:text-gray-200 font-medium flex items-center gap-2">
                                {owner?.displayName || "N/A"}
                            </p>
                            <p className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-1">
                                <VscVerifiedFilled className="text-green-500" />
                                <span>Verified Owner</span>
                            </p>
                        </div>
                    </div>

                    {/* Equipment Model & Condition */}
                    <div className="mt-3 text-xs grid grid-cols-1 gap-1.5 text-gray-700 dark:text-gray-300 border-t pt-2 border-gray-300 dark:border-gray-600">
                        <p><strong>Name:</strong> {equipment?.name || "N/A"}</p>
                        <p><strong>Model:</strong> {equipment?.model.modelType || "N/A"}</p>
                        <p><strong>Condition:</strong> {equipment?.condition || "N/A"}</p>
                    </div>
                </div>

                {/*  Action Buttons */}
                <div className="mt-6 flex justify-between">
                    <button className="bg-gray-500 cursor-pointer text-white px-4 py-2 rounded-md hover:bg-gray-600 flex items-center gap-2" onClick={onClose}>
                        <FaTimes /> Cancel
                    </button>
                    <button className="bg-green-600 cursor-pointer text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center gap-2" onClick={onConfirm} disabled={loading}>
                        {loading ? <Loader size={18} color="white" variant="dots" /> : "Confirm"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BookingModal;
