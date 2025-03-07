import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { signinStart, signinSuccess, signinFailure } from "../../redux/slices/userSlice";
import Loader from "../../components/utils/Loader";
import SignupWithGoogle from "./SignupWithGoogle";
import Alert from "../../components/utils/Alert";

const Signup = ({ onClose, switchToLogin }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [viewPass, setViewPass] = useState(false);
    const [viewConfirmPass, setViewConfirmPass] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState("");
    const [ alert, setAlert ] = useState({ type : "", message : "" });
    const [formData, setFormData] = useState({
        displayName: "",
        username: "",
        email: "",
        phone: "",
        password: "",
        role: "Farmer",
    });

    const { loading } = useSelector(state => state.user);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value.trim(),
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        dispatch(signinStart());

        if (!formData.displayName || !formData.username || !formData.email || !formData.phone) {
            dispatch(signinFailure("All fields are required"));
            setAlert({ type : "warning", message : "All fields are required" })
            return;
        }
        if (formData.password !== confirmPassword) {
            dispatch(signinFailure("Passwords do not match"));
            setAlert({ type : "warning", message : "Passwords do not match" })
            return;
        }

        try {
            const response = await fetch("/api/v1/users/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userData : formData }),
            });

            const result = await response.json();
            if (!response.ok) {
                dispatch(signinFailure(result.message));
                setAlert({ type : "error", message : result.message });
                return;
            }

            dispatch(signinSuccess(result.data.user));
            setAlert({ type : "success", message : result.message });
            navigate("/");
            onClose();
        } catch (err) {
            dispatch(signinFailure(err.message));
            setAlert({ type : "error", message : err.message });
        }
    };

    return (
        <div className="relative bg-white text-black w-full max-w-md mx-4 p-6 rounded-lg shadow-lg sm:max-w-md md:max-w-xl max-h-[85%] overflow-y-scroll">
            {/* alert message */}
            <div className="fixed top-14 right-4 z-50 w-[70%] max-w-sm">
                {alert && alert.message && (
                    <Alert type={alert.type} message={alert.message} autoDismiss onClose={() => setAlert(null)} />
                )}
            </div>

            <Link to={"/"} >
                <button onClick={onClose} className="absolute cursor-pointer top-3 right-3 text-gray-500 hover:text-gray-800">
                    <IoClose size={24} />
                </button>
            </Link>

            <h2 className="text-2xl font-bold text-center text-gray-800">Join Krushak 🌾</h2>
            <p className="text-gray-500 text-center text-sm mt-1">Create your account</p>

            <form className="mt-4 space-y-3" onSubmit={handleSubmit}>
                <div className="flex flex-col w-full md:flex-row gap-4 items-center" >
                    <div className="flex-1 w-full" >
                        <label htmlFor="displayName" className="text-xs mb-1 font-bold" >Full Name</label>
                        <input 
                            type="text" 
                            placeholder="Full Name" 
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                            id="displayName" 
                            required
                            value={formData.displayName} onChange={handleChange}
                        />
                    </div>
                    <div className="flex-1 w-full" >
                        <label htmlFor="username" className="text-xs mb-1 font-bold" >Username</label>
                        <input 
                            type="text" 
                            placeholder="Username" 
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                            id="username" 
                            required
                            value={formData.username} onChange={handleChange}/>
                    </div>
                </div>
                <div className="flex flex-col w-full md:flex-row gap-4 items-center" >
                    <div className="flex-1 w-full"  >
                        <label htmlFor="email" className="text-xs mb-1 font-bold" >Email</label>
                        <input 
                            type="email" 
                            placeholder="Email" 
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                            id="email" 
                            required
                            value={formData.email} onChange={handleChange}/>
                    </div>
                    <div className="flex-1 w-full"  >
                        <label htmlFor="phone" className="text-xs mb-1 font-bold" >Phone Number</label>
                        <input 
                            type="text" 
                            placeholder="Phone Number" 
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                            id="phone" 
                            required
                            value={formData.phone} 
                            onChange={handleChange}
                        />
                    </div>
                </div>
                <div className="flex flex-col w-full md:flex-row gap-4 items-center" >
                    <div className="flex-1 w-full" >
                        {/* Password Input */}
                        <label htmlFor="password" className="text-xs mb-1 font-bold" >Password</label>
                        <div className="relative">
                            <input type={viewPass ? "text" : "password"} placeholder="Password" className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" id="password" required value={formData.password} onChange={handleChange} />
                            <button type="button" className="absolute inset-y-0 right-4 flex items-center text-gray-500" onClick={() => setViewPass(!viewPass)}>
                                {viewPass ? <FaRegEyeSlash /> : <FaRegEye />}
                            </button>
                        </div>
                    </div>
                    <div className="flex-1 w-full" >
                        {/* Confirm Password */}
                        <label htmlFor="confirmPassword" className="text-xs mb-1 font-bold" >Confirm Password</label>
                        <div className="relative">
                            <input 
                                type={viewConfirmPass ? "text" : "password"} 
                                placeholder="Confirm Password" 
                                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                                id="confirmPassword" 
                                required 
                                value={formData.confirmPassword} 
                                onChange={(e)=> setConfirmPassword(e.target.value) } />
                            <button type="button" className="absolute inset-y-0 right-4 flex items-center text-gray-500" onClick={() => setViewConfirmPass(!viewConfirmPass)}>
                                {viewConfirmPass ? <FaRegEyeSlash /> : <FaRegEye />}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex items-end justify-end text-xs" >
                    <a href="/forgot-password" className="hover:underline hover:text-blue-600">Forgot Password</a>
                </div>

                <button 
                    className="w-full cursor-pointer bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition"
                    type="submit"
                    disabled={loading}
                >
                    {loading ? (
                        <Loader size={15} color="white" variant="dots" />
                    ) : (
                        "Sign Up"
                     )}
                </button>
            </form>

            <div className="relative flex items-center my-4">
                <div className="flex-grow border-t border-gray-300"></div>
                <span className="px-2 text-gray-400 text-sm">OR</span>
                <div className="flex-grow border-t border-gray-300"></div>
            </div>

            <SignupWithGoogle setAlert={setAlert} onClose={onClose}  />

            <p className="text-center text-sm mt-4">
                Already have an account?{" "}
                <Link to={"/login"} >
                    <span className="text-blue-600 cursor-pointer" onClick={switchToLogin}>
                        Login
                    </span>
                </Link>
            </p>
        </div>
    );
};

export default Signup;
