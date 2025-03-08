import React from "react";
import { FaMapMarkerAlt, FaSeedling } from "react-icons/fa";

const EquipmentLocation = ({ location, crops }) => {
    return (
        <div className="mt-8 bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md border border-gray-300 dark:border-gray-700">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Location & Availability</h2>

            {/*  Grid Layout for Crops & Availability Areas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/*  Used for Crops */}
                <div>
                    <h3 className="text-lg font-medium text-gray-800 dark:text-gray-300 mb-2 flex items-center gap-2">
                        <FaSeedling className="text-green-500" /> Used For Crops
                    </h3>
                    <ul className="list-disc list-inside text-gray-700 dark:text-gray-400">
                        {crops.length > 0 ? (
                            crops.map((crop, index) => <li key={index}>{crop}</li>)
                        ) : (
                            <p className="text-gray-500">Not specified</p>
                        )}
                    </ul>
                </div>

                {/* Equipment Availability Areas */}
                <div>
                    <h3 className="text-lg font-medium text-gray-800 dark:text-gray-300 mb-2 flex items-center gap-2">
                        <FaMapMarkerAlt className="text-blue-500" /> Available in Villages
                    </h3>
                    <p className="text-gray-700 dark:text-gray-400">
                        {location?.villages?.length > 0 ? location.villages.join(", ") : "No specific villages mentioned"}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default EquipmentLocation;
