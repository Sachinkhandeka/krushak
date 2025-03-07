import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa";
import Alert from "../../components/utils/Alert";
import Loader from "../../components/utils/Loader";
import { IoHomeOutline } from "react-icons/io5";

export default function ResetPassword() {
    const { token } = useParams();
    const navigate = useNavigate();

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [alert, setAlert] = useState({ type: "", message: "" });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!password || !confirmPassword) {
            setAlert({ type: "info", message: "Please enter both password fields." });
            return;
        }

        if (password !== confirmPassword) {
            setAlert({ type: "error", message: "Passwords do not match!" });
            return;
        }

        setLoading(true);
        setAlert({ type: "", message: "" });

        try {
            const response = await fetch(`/api/v1/users/reset-password/${token}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password, confirmPassword }),
            });

            const data = await response.json();

            if (!response.ok) {
                return setAlert({ type: "error", message: data.message || "Something went wrong. Please try again" });
            }

            setAlert({ type: "success", message: "Password reset successful! Redirecting to login..." });

            setTimeout(() => {
                navigate("/login");
            }, 4000);
        } catch (error) {
            setAlert({ type: "error", message: error.message || "Something went wrong. Please try again" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative flex items-center flex-col justify-center min-h-screen">
            <div className="fixed top-14 right-4 z-50 w-[70%] max-w-sm">
                {alert && alert.message && (
                    <Alert type={alert.type} message={alert.message} autoDismiss={false} onClose={() => setAlert({ type: "", message: "" })} />
                )}
            </div>

            <div className="w-full max-w-lg p-8 bg-white dark:bg-gray-900 rounded-lg md:shadow-lg">
                <h2 className="text-3xl font-bold text-gray-700 dark:text-white">Reset Password</h2>
                <p className="mt-2 text-gray-500 dark:text-white">Enter your new password below.</p>

                <form onSubmit={handleSubmit} className="my-6 space-y-4">
                    {/* Password Field */}
                    <div className="relative">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-800 dark:text-white">
                            New Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                className="w-full p-3 mt-1 border text-gray-800 dark:text-white rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                placeholder="Enter new password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-4 text-gray-500 dark:text-white"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <FaRegEyeSlash size={20} /> : <FaRegEye size={20} />}
                            </button>
                        </div>
                    </div>

                    {/* Confirm Password Field */}
                    <div className="relative">
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-800 dark:text-white">
                            Confirm Password
                        </label>
                        <div className="relative">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                id="confirmPassword"
                                className="w-full p-3 mt-1 border text-gray-800 dark:text-white rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                placeholder="Confirm new password"
                                value={confirmPassword}
                                onChange={(e) => {
                                    setConfirmPassword(e.target.value);
                                    if (password && e.target.value && password !== e.target.value) {
                                        setAlert({ type: "warning", message: "Passwords do not match!" });
                                    } else {
                                        setAlert({ type: "", message: "" });
                                    }
                                }}
                                required
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-4 text-gray-500 dark:text-white"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                {showConfirmPassword ? <FaRegEyeSlash size={20} /> : <FaRegEye size={20} />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:outline-none"
                        disabled={loading}
                    >
                        {loading ? <Loader size={18} color="white" variant="dots" /> : "Reset Password"}
                    </button>
                </form>
                <Link 
                    to={"/"}
                    className="text-gray-500 hover:text-black hover:dark:text-white cursor-pointer underline flex items-center gap-1"
                >
                    <IoHomeOutline /> 
                    <span>Home</span>
                </Link>
            </div>
        </div>
    );
}
