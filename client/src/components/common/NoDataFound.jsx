import React from "react";
import { FaBoxOpen } from "react-icons/fa";

const NoDataFound = ({ message = "No data available", subMessage = "Please check back later!", action }) => {
    return (
        <div className="flex flex-col items-center justify-center h-[60vh] text-center">
            <FaBoxOpen className="text-gray-400 text-6xl mb-4" />
            <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-200">{message}</h2>
            <p className="text-gray-500 dark:text-gray-400">{subMessage}</p>
            {action && <div className="mt-4">{action}</div>}
        </div>
    );
};

export default NoDataFound;
