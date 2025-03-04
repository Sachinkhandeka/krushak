import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { signinStart, signinSuccess, signinFailure } from "../../redux/slices/userSlice";
import Loader from "../../components/utils/Loader";

const Login = ({ isOpen, onClose }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [viewPass, setViewPass] = useState(false);
    const [formData, setFormData] = useState({
        emailOrUsernameOrPhone: "",
        password: "",
    });

    const { loading, error } = useSelector(state => state.user);

    // Handle Input Change
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value.trim(),
        });
    };

    // Handle Form Submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        dispatch(signinStart());

        if (!formData.emailOrUsernameOrPhone || !formData.password) {
            dispatch(signinFailure("Please fill out all fields"));
            return;
        }

        try {
            const response = await fetch("/api/v1/users/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const result = await response.json();
            if (!response.ok) {
                dispatch(signinFailure(result.message));
                return;
            }

            dispatch(signinSuccess(result.data.user));
            navigate("/");
            onClose();
        } catch (err) {
            dispatch(signinFailure(err.message));
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">

            <div className="absolute inset-0 bg-black opacity-50 backdrop-blur-md" onClick={onClose}></div>

            <div className="relative bg-white w-full max-w-md mx-4 p-6 rounded-lg shadow-lg sm:max-w-sm md:max-w-md">

                <button onClick={onClose} className="absolute cursor-pointer top-3 right-3 text-gray-500 hover:text-gray-800">
                    <IoClose size={24} />
                </button>

                <h2 className="text-2xl font-bold text-center text-gray-800">Welcome Back 👋</h2>
                <p className="text-gray-500 text-center text-sm mt-1">Login to access your account</p>

                <form className="mt-4 space-y-3" onSubmit={handleSubmit}>
                    <input 
                        type="text"
                        placeholder="Email, Username, or Phone" 
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        id="emailOrUsernameOrPhone"
                        value={formData.emailOrUsernameOrPhone} 
                        onChange={handleChange}
                    />

                    <div className="relative">
                        <input 
                            type={viewPass ? "text" : "password"}
                            placeholder="Password" 
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            id="password"
                            value={formData.password}
                            onChange={handleChange} 
                        />
                        <button
                            type="button"
                            className="absolute inset-y-0 right-4 flex items-center text-gray-500"
                            onClick={() => setViewPass(!viewPass)}
                        >
                            {viewPass ? <FaRegEyeSlash /> : <FaRegEye />}
                        </button>
                    </div>

                    { loading ?  (
                        <Loader loading={loading} />
                    ) : (
                        <button className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition">
                            Login
                        </button>
                    ) }
                </form>

                <div className="relative flex items-center my-4">
                    <div className="flex-grow border-t border-gray-300"></div>
                    <span className="px-2 text-gray-400 text-sm">OR</span>
                    <div className="flex-grow border-t border-gray-300"></div>
                </div>

                <button className="w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transition">
                    Login with Google
                </button>

                <p className="text-center text-sm mt-4">
                    Don't have an account? <span className="text-blue-600 cursor-pointer">Sign Up</span>
                </p>
            </div>
        </div>
    );
};

export default Login;
