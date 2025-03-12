import React, { useState } from "react";
import { FiEdit, FiCheck, FiX, FiUser, FiMail, FiPhone } from "react-icons/fi";
import { useDispatch } from "react-redux";
import { updateStart, updateSuccess, updateFailure } from "../../redux/slices/userSlice";
import { fetchWithAuth } from "../../utilityFunction";
import Loader from "../utils/Loader"; // Import Loader for feedback
import { useNavigate } from "react-router-dom";

const ProfileDetails = ({ user, setAlert }) => {
    const navigate = useNavigate
    const dispatch = useDispatch();
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        displayName: user.displayName,
        email: user.email,
        phone: user.phone || "",
    });

    // Handle Input Change
    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle Profile Update
    const handleUpdateProfile = async () => {
        setLoading(true);
        dispatch(updateStart()); // Dispatch loading state to Redux

        try {
            const response = await fetchWithAuth(
                `/api/v1/users/profile/${user._id}`, 
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        displayName : formData.displayName,
                        email : formData.email,
                        phone : formData.phone
                    }),
                },
                setLoading,
                setAlert,
                navigate,
            );

            if (response.success) {
                dispatch(updateSuccess(response.data));
                setAlert({ type: "success", message: "Profile updated successfully!" });
                setIsEditing(false);
            }
        } catch (error) {
            dispatch(updateFailure(error.message));
            setAlert({ type: "error", message: error.message });
        }
    };

    return (
        <div className="mt-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 p-5 rounded-lg shadow-md">
            {/* Header with Edit Button */}
            <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Personal Information</h2>
                {!isEditing && (
                    <button 
                        onClick={() => setIsEditing(true)} 
                        className="text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-200 transition"
                    >
                        <FiEdit size={20} />
                    </button>
                )}
            </div>

            {/* Editable Fields */}
            {isEditing ? (
                <div className="mt-4 space-y-3">
                    <input 
                        type="text" 
                        name="displayName" 
                        value={formData.displayName} 
                        onChange={handleInputChange} 
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                    <input 
                        type="email" 
                        name="email" 
                        value={formData.email} 
                        onChange={handleInputChange} 
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                    <input 
                        type="text" 
                        name="phone" 
                        value={formData.phone} 
                        onChange={handleInputChange} 
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                    />

                    {/* Action Buttons */}
                    <div className="flex justify-between gap-4 mt-2">
                        <button 
                            onClick={handleUpdateProfile}
                            className="w-1/2 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition flex items-center justify-center gap-2"
                            disabled={loading}
                        >
                            {loading ? <Loader size={20} color="white" /> : <><FiCheck size={18} /> Save</>}
                        </button>
                        <button 
                            onClick={() => setIsEditing(false)} 
                            className="w-1/2 py-2 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-lg transition flex items-center justify-center gap-2"
                            disabled={loading}
                        >
                            <FiX size={18} /> Cancel
                        </button>
                    </div>
                </div>
            ) : (
                <div className="mt-4 bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow-md">
                    {/* User Info Row */}
                    <div className="flex items-center gap-3 border-b pb-3 border-gray-300 dark:border-gray-700">
                        <FiUser className="text-gray-600 dark:text-gray-400" size={20} />
                        <p className="text-base font-medium text-gray-900 dark:text-white">
                            {user.displayName}
                        </p>
                    </div>

                    {/* Email Row */}
                    <div className="flex items-center gap-3 border-b py-3 border-gray-300 dark:border-gray-700">
                        <FiMail className="text-gray-600 dark:text-gray-400" size={20} />
                        <p className="text-base text-gray-700 dark:text-gray-300">
                            {user.email}
                        </p>
                    </div>

                    {/* Phone Row */}
                    <div className="flex items-center gap-3 pt-3">
                        <FiPhone className="text-gray-600 dark:text-gray-400" size={20} />
                        <p className="text-base text-gray-700 dark:text-gray-300">
                            {user.phone || <span className="italic text-gray-500">Not provided</span>}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfileDetails;
