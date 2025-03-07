import React, { useState } from "react";
import Alert from "../../components/utils/Alert";
import { Link } from "react-router-dom";
import { IoHomeOutline } from "react-icons/io5";
import Loader from "../../components/utils/Loader";

export default function ForgotPassword() {
    const [emailOrPhone, setEmailOrPhone] = useState("");
    const [alert, setAlert] = useState({ type: "", message: "" });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!emailOrPhone) {
            setAlert({ type: "info", message: "Please provide your email or phone number to proceed" });
            return;
        }

        setLoading(true);
        setAlert({ type: "", message: "" });
        try {
            const response = await fetch(
                '/api/v1/users/forgot-password', 
                { 
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ emailOrPhone })  
                }
            );
            const data = await response.json();

            if (!response.ok) {
                return setAlert({ type: "error", message: data.message || "Something went wrong. Please try again" });
            }
            setAlert({ type: "success", message: data.message });
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

            {/* Card */}
            <div className="w-full max-w-lg p-8 bg-white dark:bg-gray-900 rounded-lg md:shadow-lg">
                <h2 className="text-3xl font-bold text-gray-700 dark:text-white">Forgot Password?</h2>
                <p className="mt-2 text-gray-500 dark:text-white">No worries, we'll send you reset instructions.</p>

                <form onSubmit={handleSubmit} className="my-6 space-y-4">
                    <div>
                        <label htmlFor="emailOrPhone" className="block text-sm font-medium text-gray-800 dark:text-white">
                            Email or Phone Number
                        </label>
                        <input
                            type="text"
                            id="emailOrPhone"
                            className="w-full p-3 mt-1 border text-gray-800 dark:text-white rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            placeholder="Enter your email or phone number"
                            value={emailOrPhone}
                            onChange={(e) => setEmailOrPhone(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:outline-none"
                        disabled={loading}
                    >
                        {loading ? <Loader size={18} color="white" variant="dots" />: 'Send Reset Instructions'}
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
