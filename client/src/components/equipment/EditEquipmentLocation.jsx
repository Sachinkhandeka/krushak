import React, { useState } from "react";
import { FaMapMarkerAlt, FaSeedling, FaPencilAlt, FaSave } from "react-icons/fa";
import { fetchWithAuth } from "../../utilityFunction";
import { useNavigate } from "react-router-dom";
import Loader from "../utils/Loader";
import { CROP_OPTIONS } from "../../constants/equipmentOptions.js";

const EditEquipmentLocation = ({ location, crops, equipmentId, setAlert, onLocationUpdate }) => {
    const navigate = useNavigate();
    const [updatedLocation, setUpdatedLocation] = useState({ ...location });
    const [updatedCrops, setUpdatedCrops] = useState([...crops]);
    const [isEditing, setIsEditing] = useState({ crops: false, villages: false });
    const [loading, setLoading] = useState(false);

    // Handle edit toggle
    const handleEditToggle = (field) => {
        setIsEditing((prev) => ({ ...prev, [field]: !prev[field] }));
    };

    // Handle location update
    const handleFieldUpdate = (field, value) => {
        setUpdatedLocation((prev) => ({ ...prev, [field]: value }));
    };

    // Handle crop selection update
    const handleCropSelection = (e) => {
        const { value, checked } = e.target;
        setUpdatedCrops((prev) =>
            checked ? [...prev, value] : prev.filter((crop) => crop !== value)
        );
    };

    // Save changes
    const handleSaveChanges = async () => {
        setLoading(true);

        const updatedFields = {};

        // Add usedForCrops field if changed
        if (JSON.stringify(updatedCrops) !== JSON.stringify(crops)) {
            updatedFields.usedForCrops = updatedCrops;
        }

        // Add availabilityArea if changed
        if (JSON.stringify(updatedLocation) !== JSON.stringify(location)) {
            updatedFields.availabilityArea = [updatedLocation];
        }

        if (Object.keys(updatedFields).length === 0) {
            setAlert({ type: "info", message: "No changes detected." });
            setLoading(false);
            return;
        }

        try {
            const response = await fetchWithAuth(
                `/api/v1/equipment/${equipmentId}`,
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ equipmentData: updatedFields }),
                },
                setLoading,
                setAlert,
                navigate
            );

            if (response) {
                onLocationUpdate(response.data);
                setAlert({ type: "success", message: "Equipment location updated successfully!" });
            }
        } catch (error) {
            setAlert({ type: "error", message: "Failed to update equipment location." });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mt-8 bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md border border-gray-300 dark:border-gray-700">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Edit Location & Availability</h2>

            {/* Grid Layout for Crops & Availability Areas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Used for Crops */}
                <div>
                    <h3 className="text-lg font-medium text-gray-800 dark:text-gray-300 mb-2 flex items-center gap-2">
                        <FaSeedling className="text-green-500" /> Used For Crops
                    </h3>
                    {isEditing.crops ? (
                        <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto border border-gray-300 dark:border-gray-600 p-2 rounded-lg">
                            {CROP_OPTIONS.map((crop, index) => (
                                <label key={index} className="flex items-center space-x-2 text-gray-700 dark:text-gray-400">
                                    <input
                                        type="checkbox"
                                        value={crop}
                                        checked={updatedCrops.includes(crop)}
                                        onChange={handleCropSelection}
                                        className="rounded cursor-pointer"
                                    />
                                    <span>{crop}</span>
                                </label>
                            ))}
                        </div>
                    ) : (
                        <ul className="list-disc list-inside text-gray-700 dark:text-gray-400">
                            {updatedCrops.length > 0 ? (
                                updatedCrops.map((crop, index) => <li key={index}>{crop}</li>)
                            ) : (
                                <p className="text-gray-500">Not specified</p>
                            )}
                        </ul>
                    )}
                    <button
                        onClick={() => handleEditToggle("crops")}
                        className="cursor-pointer text-gray-500 hover:text-gray-700 mt-2"
                    >
                        <FaPencilAlt />
                    </button>
                </div>

                {/* Equipment Availability Areas */}
                <div>
                    <h3 className="text-lg font-medium text-gray-800 dark:text-gray-300 mb-2 flex items-center gap-2">
                        <FaMapMarkerAlt className="text-green-500" /> Available in Villages
                    </h3>
                    {isEditing.villages ? (
                        <input
                            type="text"
                            value={updatedLocation?.villages?.join(", ") || ""}
                            onChange={(e) => handleFieldUpdate("villages", e.target.value.split(",").map((v) => v.trim()))}
                            className="border-b border-gray-400 bg-transparent text-gray-800 dark:text-white w-full outline-none py-1"
                            autoFocus
                        />
                    ) : (
                        <p className="text-gray-700 dark:text-gray-400">
                            {updatedLocation?.villages?.length > 0
                                ? updatedLocation.villages.join(", ")
                                : "No specific villages mentioned"}
                        </p>
                    )}
                    <button
                        onClick={() => handleEditToggle("villages")}
                        className="cursor-pointer text-gray-500 hover:text-gray-700 mt-2"
                    >
                        <FaPencilAlt />
                    </button>
                </div>
            </div>

            {/* Save Changes Button */}
            <button
                onClick={handleSaveChanges}
                disabled={loading}
                className="mt-6 w-full cursor-pointer bg-green-600 text-white py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-green-700 transition"
            >
                {loading ? <Loader size={20} color="white" variant="dots" /> : <FaSave />}
                {loading ? "Saving..." : "Save Changes"}
            </button>
        </div>
    );
};

export default EditEquipmentLocation;
