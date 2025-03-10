import React, { useState } from "react";
import { FaPencilAlt, FaSave } from "react-icons/fa";
import { PiUserLight } from "react-icons/pi";
import { fetchWithAuth } from "../../utilityFunction";
import { useNavigate } from "react-router-dom";
import Loader from "../utils/Loader";
import { EQUIPMENT_CATEGORIES, EQUIPMENT_TYPES, EQUIPMENT_CONDITIONS, PRICING_UNITS } from "../../constants/equipmentOptions.js";

const EditEquipmentInfo = ({ equipment, setAlert, onUpdate }) => {
    const navigate = useNavigate();
    const [updatedEquipment, setUpdatedEquipment] = useState({ ...equipment });
    const [loading, setLoading] = useState(false);
    const [isEditing, setIsEditing] = useState({});

    const handleEditToggle = (field) => {
        setIsEditing((prev) => ({ ...prev, [field]: !prev[field] }));
    };

    const handleFieldUpdate = (field, value) => {
        setUpdatedEquipment((prev) => ({ ...prev, [field]: value }));
    };

    const handleModelUpdate = (field, value) => {
        setUpdatedEquipment((prev) => ({
            ...prev,
            model: { ...prev.model, [field]: value },
        }));
    };

    const handlePricingUpdate = (field, value) => {
        setUpdatedEquipment((prev) => {
            const updatedPricing = prev.pricing?.length
                ? [...prev.pricing]  // Clone existing pricing array
                : [{ unit: "hour (કલાક)", price: 0 }]; // Default if pricing doesn't exist
    
            updatedPricing[0] = { ...updatedPricing[0], [field]: value }; // Update the correct field
    
            return { ...prev, pricing: updatedPricing };
        });
    };
    

    const handleSaveChanges = async () => {
        setLoading(true);
    
        // Only send fields that were edited
        const updatedFields = {};
        for (const key in updatedEquipment) {
            if (updatedEquipment[key] !== equipment[key]) {
                updatedFields[key] = updatedEquipment[key];
            }
        }
    
        if (Object.keys(updatedFields).length === 0) {
            setAlert({ type: "info", message: "No changes detected." });
            setLoading(false);
            return;
        }
    
        try {
            const response = await fetchWithAuth(
                `/api/v1/equipment/${equipment._id}`,
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
                setAlert({ type: "success", message: "Equipment updated successfully!" });
                onUpdate(response.data);
            }
        } catch (error) {
            setAlert({ type: "error", message: "Failed to update equipment." });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full md:w-2/5 bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg border border-gray-300 dark:border-gray-700">
            {/* Owner Information */}
            <div className="flex items-center gap-4 border-b border-gray-300 pb-4 mb-4 dark:border-gray-700">
                {equipment.owner?.avatar ? (
                    <img 
                        src={equipment.owner.avatar} 
                        alt={equipment.owner.displayName} 
                        className="w-12 h-12 rounded-full object-cover border border-gray-300 dark:border-gray-600"
                    />
                ) : (
                    <span className="w-12 h-12 rounded-full flex items-center justify-center text-gray-400 dark:text-gray-600 border border-gray-300 dark:border-gray-600">
                        <PiUserLight size={42} />
                    </span>
                )}
                <div>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">{equipment.owner.displayName}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{equipment.owner.email}</p>
                </div>
            </div>

            {/* Editable Equipment Fields */}
            <div className="grid gap-4">
                {/* Name */}
                <div className="flex items-center justify-between border-b border-gray-300 dark:border-gray-700 pb-2">
                    <label className="text-gray-700 dark:text-gray-300 font-semibold">Name:</label>
                    {isEditing.name ? (
                        <input
                            type="text"
                            value={updatedEquipment.name || ""}
                            onChange={(e) => handleFieldUpdate("name", e.target.value)}
                            className="border-none bg-transparent text-gray-900 dark:text-white outline-none py-1 flex-1"
                            autoFocus
                        />
                    ) : (
                        <span className="text-gray-600 dark:text-gray-400 flex-1">{updatedEquipment.name || "N/A"}</span>
                    )}
                    <button onClick={() => handleEditToggle("name")} className="text-gray-500 cursor-pointer hover:text-gray-700">
                        <FaPencilAlt />
                    </button>
                </div>

                {/* Category */}
                <div className="flex items-center justify-between border-b border-gray-300 dark:border-gray-700 pb-2">
                    <label className="text-gray-700 dark:text-gray-300 font-semibold">Category:</label>
                    {isEditing.category ? (
                        <select
                            value={updatedEquipment.category}
                            onChange={(e) => handleFieldUpdate("category", e.target.value)}
                            className="border-none bg-transparent text-gray-900 dark:text-white outline-none py-1 w-full"
                            autoFocus
                        >
                            {EQUIPMENT_CATEGORIES.map((category) => (
                                <option key={category} value={category} className="dark:bg-gray-800 dark:text-white">
                                    {category}
                                </option>
                            ))}
                        </select>
                    ) : (
                        <span className="text-gray-600 dark:text-gray-400 flex-1">{updatedEquipment.category || "N/A"}</span>
                    )}
                    <button onClick={() => handleEditToggle("category")} className="cursor-pointer text-gray-500 hover:text-gray-700">
                        <FaPencilAlt />
                    </button>
                </div>

                {/* Model Type */}
                <div className="flex items-center justify-between border-b border-gray-300 dark:border-gray-700 pb-2">
                    <label className="text-gray-700 dark:text-gray-300 font-semibold">Model Type:</label>
                    {isEditing.modelType ? (
                        <input
                            type="text"
                            value={updatedEquipment.model?.modelType || ""}
                            onChange={(e) => handleModelUpdate("modelType", e.target.value)}
                            className="border-none bg-transparent text-gray-900 dark:text-white outline-none py-1 flex-1"
                            autoFocus
                        />
                    ) : (
                        <span className="text-gray-600 dark:text-gray-400 flex-1">{updatedEquipment.model?.modelType || "N/A"}</span>
                    )}
                    <button onClick={() => handleEditToggle("modelType")} className="cursor-pointer text-gray-500 hover:text-gray-700">
                        <FaPencilAlt />
                    </button>
                </div>

                {/* Pricing Unit */}
                <div className="flex items-center justify-between border-b border-gray-300 dark:border-gray-700 pb-2">
                    <label className="text-gray-700 dark:text-gray-300 font-semibold">Pricing Unit:</label>
                    {isEditing.pricingUnit ? (
                        <select
                            value={updatedEquipment.pricing?.[0]?.unit || ""}
                            onChange={(e) => handlePricingUpdate("unit", e.target.value)}
                            className="border-none bg-transparent text-gray-900 dark:text-white outline-none py-1 w-full"
                            autoFocus
                        >
                            {PRICING_UNITS.map((unit) => (
                                <option key={unit} value={unit} className="dark:bg-gray-800 dark:text-white">
                                    {unit}
                                </option>
                            ))}
                        </select>
                    ) : (
                        <span className="text-gray-600 dark:text-gray-400 flex-1">{updatedEquipment.pricing?.[0]?.unit || "N/A"}</span>
                    )}
                    <button onClick={() => handleEditToggle("pricingUnit")} className="cursor-pointer text-gray-500 hover:text-gray-700">
                        <FaPencilAlt />
                    </button>
                </div>

                {/* Price */}
                <div className="flex items-center justify-between border-b border-gray-300 dark:border-gray-700 pb-2">
                    <label className="text-gray-700 dark:text-gray-300 font-semibold">Price:</label>
                    {isEditing.price ? (
                        <input
                            type="number"
                            value={updatedEquipment.pricing?.[0]?.price || ""}
                            onChange={(e) => handlePricingUpdate("price", e.target.value)}
                            className="border-none bg-transparent text-gray-900 dark:text-white outline-none py-1 flex-1"
                            autoFocus
                        />
                    ) : (
                        <span className="text-gray-600 dark:text-gray-400 flex-1">{updatedEquipment.pricing?.[0]?.price || "N/A"}</span>
                    )}
                    <button onClick={() => handleEditToggle("price")} className="cursor-pointer text-gray-500 hover:text-gray-700">
                        <FaPencilAlt />
                    </button>
                </div>

                {/* Latest Model */}
                <div className="flex items-center justify-between border-b border-gray-300 dark:border-gray-700 pb-2">
                    <label className="text-gray-700 dark:text-gray-300 font-semibold">Latest Model:</label>
                    {isEditing.isLatestModel ? (
                        <select
                            value={updatedEquipment.model?.isLatestModel ? "Yes" : "No"}
                            onChange={(e) => handleModelUpdate("isLatestModel", e.target.value === "Yes")}
                            className="border-none bg-transparent text-gray-900 dark:text-white outline-none py-1 w-full"
                            autoFocus
                        >
                            <option value="Yes" className="dark:bg-gray-800 dark:text-white">Yes</option>
                            <option value="No" className="dark:bg-gray-800 dark:text-white">No</option>
                        </select>
                    ) : (
                        <span className="text-gray-600 dark:text-gray-400 flex-1">
                            {updatedEquipment.model?.isLatestModel ? "Yes" : "No"}
                        </span>
                    )}
                    <button onClick={() => handleEditToggle("isLatestModel")} className="cursor-pointer text-gray-500 hover:text-gray-700">
                        <FaPencilAlt />
                    </button>
                </div>

                {/* Description */}
                <div className="flex items-center justify-between border-b border-gray-300 dark:border-gray-700 pb-2">
                    <label className="text-gray-700 dark:text-gray-300 font-semibold">Description:</label>
                    {isEditing.description ? (
                        <textarea
                            value={updatedEquipment.description || ""}
                            onChange={(e) => handleFieldUpdate("description", e.target.value)}
                            className="border-none bg-transparent text-gray-900 dark:text-white outline-none py-1 w-full"
                            autoFocus
                        />
                    ) : (
                        <span className="text-gray-600 dark:text-gray-400 flex-1">
                            {updatedEquipment.description || "N/A"}
                        </span>
                    )}
                    <button onClick={() => handleEditToggle("description")} className="cursor-pointer text-gray-500 hover:text-gray-700">
                        <FaPencilAlt />
                    </button>
                </div>

                {/* Availability */}
                <div className="flex items-center justify-between border-b border-gray-300 dark:border-gray-700 pb-2">
                    <label className="text-gray-700 dark:text-gray-300 font-semibold">Availability:</label>
                    {isEditing.availability ? (
                        <select
                            value={updatedEquipment.availability ? "Available" : "Not Available"}
                            onChange={(e) => handleFieldUpdate("availability", e.target.value === "Available")}
                            className="border-none bg-transparent text-gray-900 dark:text-white outline-none py-1 w-full"
                            autoFocus
                        >
                            <option value="Available" className="dark:bg-gray-800 dark:text-white">Available</option>
                            <option value="Not Available" className="dark:bg-gray-800 dark:text-white">Not Available</option>
                        </select>
                    ) : (
                        <span className="text-gray-600 dark:text-gray-400 flex-1">
                            {updatedEquipment.availability ? "Available" : "Not Available"}
                        </span>
                    )}
                    <button onClick={() => handleEditToggle("availability")} className="cursor-pointer text-gray-500 hover:text-gray-700">
                        <FaPencilAlt />
                    </button>
                </div>
            </div>

            {/* Type */}
            <div className="flex items-center justify-between border-b border-gray-300 dark:border-gray-700 pb-2">
                <label className="text-gray-700 dark:text-gray-300 font-semibold">Type:</label>
                {isEditing.type ? (
                    <select
                        value={updatedEquipment.type}
                        onChange={(e) => handleFieldUpdate("type", e.target.value)}
                        className="border-none bg-transparent text-gray-900 dark:text-white outline-none py-4 w-full"
                        autoFocus
                    >
                        {EQUIPMENT_TYPES.map((type) => (
                            <option key={type} value={type} className="dark:bg-gray-800 dark:text-white">
                                {type}
                            </option>
                        ))}
                    </select>
                ) : (
                    <span className="text-gray-600 dark:text-gray-400 flex-1 py-4">{updatedEquipment.type || "N/A"}</span>
                )}
                <button onClick={() => handleEditToggle("type")} className="cursor-pointer text-gray-500 hover:text-gray-700">
                    <FaPencilAlt />
                </button>
            </div>

            {/* Condition */}
            <div className="flex items-center justify-between border-b border-gray-300 dark:border-gray-700 pb-4">
                <label className="text-gray-700 dark:text-gray-300 font-semibold">Condition:</label>
                {isEditing.condition ? (
                    <select
                        value={updatedEquipment.condition}
                        onChange={(e) => handleFieldUpdate("condition", e.target.value)}
                        className="border-none bg-transparent text-gray-900 dark:text-white outline-none py-4 w-full"
                        autoFocus
                    >
                        {EQUIPMENT_CONDITIONS.map((condition) => (
                            <option key={condition} value={condition} className="dark:bg-gray-800 dark:text-white">
                                {condition}
                            </option>
                        ))}
                    </select>
                ) : (
                    <span className="text-gray-600 dark:text-gray-400 flex-1 py-4">{updatedEquipment.condition || "N/A"}</span>
                )}
                <button onClick={() => handleEditToggle("condition")} className="cursor-pointer text-gray-500 hover:text-gray-700">
                    <FaPencilAlt />
                </button>
            </div>

            {/* Save Changes Button */}
            <button
                onClick={handleSaveChanges}
                disabled={loading}
                className="mt-6 w-full bg-green-600 cursor-pointer text-white py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-green-700 transition"
            >
                {loading ? <Loader size={20} color="white" variant="dots" /> : <FaSave />}
                {loading ? "Saving..." : "Save Changes"}
            </button>
        </div>
    );
};

export default EditEquipmentInfo;
