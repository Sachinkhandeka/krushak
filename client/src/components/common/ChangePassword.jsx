import React, { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";

const ChangePassword = () => {
    const [passwords, setPasswords] = useState({ oldPassword: "", newPassword: "", confirmPassword: "" });
    const [showPassword, setShowPassword] = useState({ old: false, new: false, confirm: false });

    const togglePasswordVisibility = (field) => {
        setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
    };

    return (
        <div className="mt-6 bg-white dark:bg-gray-800 p-5 border border-gray-200 dark:border-gray-600 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Change Password</h2>

            {/* Password Fields */}
            {["oldPassword", "newPassword", "confirmPassword"].map((field, index) => (
                <div key={index} className="relative mt-3">
                    <input
                        type={showPassword[field] ? "text" : "password"}
                        name={field}
                        placeholder={field === "oldPassword" ? "Old Password" : field === "newPassword" ? "New Password" : "Confirm New Password"}
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
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
            <button className="w-full py-3 mt-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-all">
                Update Password
            </button>
        </div>
    );
};

export default ChangePassword;
