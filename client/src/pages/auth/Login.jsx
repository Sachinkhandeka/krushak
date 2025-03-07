import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { signinStart, signinSuccess, signinFailure } from "../../redux/slices/userSlice";
import Loader from "../../components/utils/Loader";
import Alert from "../../components/utils/Alert";
import LoginWithGoogle from "./LoginWithGoogle";

const Login = ({ onClose, switchToSignup }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [viewPass, setViewPass] = useState(false);
    const [ alert, setAlert ] = useState({ type : "", message : "" });
    const [formData, setFormData] = useState({ emailOrUsernameOrPhone: "", password: "" });

    const { loading } = useSelector(state => state.user);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        dispatch(signinStart());

        if (!formData.emailOrUsernameOrPhone || !formData.password) {
            dispatch(signinFailure("Please fill out all fields"));
            setAlert({ type : "error", message : "Please fill out all fields" });
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
                setAlert({ typee : "error", message : result.message });
                return;
            }

            dispatch(signinSuccess(result.data.user));
            setAlert({ type : "success", message : result.message });
            navigate("/");
            setTimeout(() => {
                onClose();
            }, 4000); 
        } catch (err) {
            dispatch(signinFailure(err.message));
            setAlert({ type : "error", message : err.message });
        }
    };

    return (
        <div className="relative bg-white text-black w-full max-w-md mx-4 p-6 rounded-lg shadow-lg sm:max-w-sm md:max-w-md">
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
                    required
                />

                <div className="relative">
                    <input 
                        type={viewPass ? "text" : "password"}
                        placeholder="Password" 
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        id="password"
                        value={formData.password}
                        onChange={handleChange} 
                        required
                    />
                    <button
                        type="button"
                        className="absolute inset-y-0 right-4 flex items-center text-gray-500"
                        onClick={() => setViewPass(!viewPass)}
                    >
                        {viewPass ? <FaRegEyeSlash /> : <FaRegEye />}
                    </button>
                </div>

                <button 
                    className="w-full bg-blue-600 text-white cursor-pointer py-2 rounded-md hover:bg-blue-700 transition"
                    disabled={loading}
                >
                    { loading ?  (
                        <Loader size={18} color="white" variant="dots" />
                    ) : (
                        "Login"
                    )}
                </button>
            </form>

            <div className="relative flex items-center my-4">
                <div className="flex-grow border-t border-gray-300"></div>
                <span className="px-2 text-gray-400 text-sm">OR</span>
                <div className="flex-grow border-t border-gray-300"></div>
            </div>

            <LoginWithGoogle setAlert={setAlert} onClose={onClose} />

            <p className="text-center text-sm mt-4">
                Don't have an account?{" "}
                <Link to={"/signup"} >
                    <span className="text-blue-600 cursor-pointer" onClick={switchToSignup}>
                        Sign Up
                    </span>
                </Link>
            </p>
        </div>
    );
};

export default Login;
