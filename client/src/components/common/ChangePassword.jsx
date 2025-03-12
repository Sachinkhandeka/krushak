import React, { useState } from "react";
import { FiEye, FiEyeOff, FiLock } from "react-icons/fi";
import { fetchWithAuth } from "../../utilityFunction";
import Loader from "../utils/Loader";
import { useNavigate } from "react-router-dom";

const ChangePassword = ({ setAlert }) => {
    const navigate = useNavigate();
    const [passwords, setPasswords] = useState({ oldPassword: "", newPassword: "", confirmPassword: "" });
    const [showPassword, setShowPassword] = useState({ old: false, new: false, confirm: false });
    const [loading, setLoading] = useState(false);

    // Toggle Password Visibility
    const togglePasswordVisibility = (field) => {
        setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
    };

    // Handle Input Change
    const handleInputChange = (e) => {
        setPasswords({ ...passwords, [e.target.name]: e.target.value });
    };

    // Handle Password Change Submission
    const handleChangePassword = async () => {
        if (!passwords.oldPassword || !passwords.newPassword || !passwords.confirmPassword) {
            return setAlert({ type: "warning", message: "Please fill all password fields." });
        }

        if (passwords.newPassword !== passwords.confirmPassword) {
            return setAlert({ type: "error", message: "New password and confirm password do not match." });
        }

        setLoading(true);
        try {
            const response = await fetchWithAuth(
                "/api/v1/users/profile/change-password",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(passwords),
                },
                setLoading,
                setAlert,
                navigate
            );

            if (response) {
                setAlert({ type: "success", message: "Password changed successfully!" });
                setPasswords({ oldPassword: "", newPassword: "", confirmPassword: "" });
            }
        } catch (error) {
            setAlert({ type: "error", message: error.message });
        }
    };

    return (
        <div className="mt-6 bg-white dark:bg-gray-800 p-5 border border-gray-200 dark:border-gray-600 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <FiLock /> Change Password
            </h2>

            {/* Password Fields */}
            {["oldPassword", "newPassword", "confirmPassword"].map((field, index) => (
                <div key={index} className="relative mt-3">
                    <input
                        type={showPassword[field] ? "text" : "password"}
                        name={field}
                        value={passwords[field]}
                        onChange={handleInputChange}
                        placeholder={
                            field === "oldPassword" ? "Current Password" :
                            field === "newPassword" ? "New Password" :
                            "Confirm New Password"
                        }
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:outline-none"
                    />
                    <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400"
                        onClick={() => togglePasswordVisibility(field)}
                    >
                        {showPassword[field] ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                    </button>
                </div>
            ))}

            {/* Update Button */}
            <button
                onClick={handleChangePassword}
                className="w-full py-3 mt-4 cursor-pointer bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-all flex items-center justify-center gap-2"
                disabled={loading}
            >
                {loading ? <Loader size={18} color="white" /> : "Update Password"}
            </button>
        </div>
    );
};

export default ChangePassword;
