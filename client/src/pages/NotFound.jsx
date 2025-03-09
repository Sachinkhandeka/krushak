import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaExclamationTriangle } from "react-icons/fa";

const NotFound = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 text-center px-4">
            {/*  Animated Icon */}
            <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 120 }}
                className="text-red-500 text-7xl"
            >
                <FaExclamationTriangle />
            </motion.div>

            {/*  Title */}
            <motion.h1
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="text-4xl font-bold text-gray-900 dark:text-white mt-6"
            >
                404 - Page Not Found
            </motion.h1>

            {/*  Subtitle */}
            <motion.p
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="text-gray-600 dark:text-gray-400 mt-2 max-w-lg"
            >
                Oops! The page you are looking for doesn't exist or may have been moved.
            </motion.p>

            {/*  Back to Home Button */}
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
            >
                <Link to="/">
                    <button className="mt-6 px-6 py-3 text-white bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 rounded-lg font-semibold transition">
                        Go Back Home
                    </button>
                </Link>
            </motion.div>
        </div>
    );
};

export default NotFound;
