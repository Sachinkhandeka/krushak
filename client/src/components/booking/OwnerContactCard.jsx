import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion"; 
import { FaCopy, FaCheck, FaPhoneAlt } from "react-icons/fa";
import { PiUserLight } from "react-icons/pi";

const OwnerContactCard = ({ ownerContact }) => {
    const [copied, setCopied] = useState(false);
    const [showSuccess, setShowSuccess] = useState(true); 

    useEffect(() => {
        //  Hide success message after 3 seconds
        const timer = setTimeout(() => setShowSuccess(false), 3000);
        return () => clearTimeout(timer);
    }, []);

    const handleCopy = () => {
        navigator.clipboard.writeText(ownerContact.phone);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="relative mt-6 bg-white dark:bg-gray-800 p-5 rounded-lg border border-gray-300 dark:border-gray-700 shadow-md transition-all">
            {/*  Animated Success Message */}
            <AnimatePresence>
                {showSuccess && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                        className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 dark:bg-gray-900/80 rounded-lg z-10"
                    >
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 100 }}
                        >
                            <FaCheck className="text-green-600 text-5xl" />
                        </motion.div>
                        <p className="text-lg font-semibold text-green-600 dark:text-green-400 mt-2">
                            Booking Successful!
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>

            <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-3">
                Owner Contact Details
            </h3>

            {/*  Name Row */}
            <div className="flex items-center gap-3">
                {ownerContact && ownerContact.avatar ? (
                    <img 
                        src={ownerContact?.avatar} 
                        alt={ownerContact?.displayName || "Owner"} 
                        className="w-12 h-12 rounded-full object-cover border border-gray-300 dark:border-gray-600"
                    />
                ) : (
                    <span className="w-12 h-12 rounded-full flex items-center justify-center text-gray-400 dark:text-gray-600 border border-gray-300 dark:border-gray-600">
                        <PiUserLight size={28} />
                    </span>
                )}
                <p className="text-gray-800 dark:text-gray-300 text-md">
                    <strong>Name:</strong> {ownerContact?.name}
                </p>
            </div>

            {/*  Phone Row with Copy & Call */}
            <div className="mt-4 flex flex-col gap-2">
                <div className="flex items-center justify-between h-14 bg-gray-200 dark:bg-gray-700 px-3 py-2 rounded-md">
                    <p className="text-gray-900 dark:text-gray-100 flex-1 truncate flex items-center gap-2">
                        <FaPhoneAlt className="text-green-500" /> {ownerContact?.phone}
                    </p>
                    <button 
                        onClick={handleCopy} 
                        className="text-gray-600 dark:text-gray-300 hover:text-blue-600 transition"
                        title="Copy Number"
                    >
                        {copied ? <FaCheck className="text-green-500" /> : <FaCopy className="cursor-pointer" />}
                    </button>
                </div>

                {/*  Call Now Button */}
                <a href={`tel:${ownerContact?.phone}`} className="w-full">
                    <button className="w-full cursor-pointer bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition flex items-center justify-center gap-2">
                        <FaPhoneAlt /> Call Now
                    </button>
                </a>
            </div>
        </div>
    );
};

export default OwnerContactCard;
