import React, { useState } from "react";
import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";
import { app } from "../../firebase";
import { useDispatch, useSelector } from "react-redux";
import { signinStart, signinSuccess, signinFailure } from "../../redux/slices/userSlice";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/utils/Loader";

const SignupWithGoogle = ({ setAlert, onClose }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { loading } = useSelector((state) => state.user);
    const auth = getAuth(app);

    const [userData, setUserData] = useState(null);
    const [phoneNumber, setPhoneNumber] = useState("");
    const [showPhoneModal, setShowPhoneModal] = useState(false);

    // Generate a username
    const generateUsername = (name) => {
        return name.toLowerCase().replace(/\s+/g, "_") + Math.floor(1000 + Math.random() * 9000);
    };

    // Handle Google Sign-In
    const handleGoogleClick = async () => {
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({ prompt: "select_account" });

        try {
            dispatch(signinStart());
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            if(!user) {
                dispatch(signinFailure("Something went wrong while sign you up with google"));
                return setAlert({ type : "error", message : "Something went wrong while sign you up with google" });
            }

            const userInfo = {
                displayName: user.displayName,
                username: user.displayName ? generateUsername(user.displayName) : null,
                email: user.email,
                password: user.uid,
                avatar: user.photoURL,
                phone: user.phoneNumber || "",
                role: "Farmer",
            };

            // If phone number is missing, show modal
            if (!userInfo.phone) {
                window.alert("You need to enter your mobile number to proceed.");
                setUserData(userInfo);
                setShowPhoneModal(true);
                return;
            }

            // Proceed with API call if phone number exists
            await registerUser(userInfo);
        } catch (err) {
            let errorMessage = err.message;

            // Handle specific Google sign-in errors
            if (err.code === "auth/popup-closed-by-user") {
                errorMessage = "Google sign-up was canceled. Please try again.";
            } else if (err.code === "auth/network-request-failed") {
                errorMessage = "Network error. Please check your internet connection.";
            }

            dispatch(signinFailure(errorMessage));
            setAlert({ type: "error", message: errorMessage });
        }
    };

    // Register user after collecting phone number
    const registerUser = async (data) => {
        try {
            const response = await fetch("/api/v1/users/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userData: data }),
            });

            const resData = await response.json();
            if (!response.ok) {
                dispatch(signinFailure(resData.message));
                return setAlert({ type: "error", message: resData.message });
            }

            dispatch(signinSuccess(resData.data.user));
            setAlert({ type: "success", message: resData.message });

            setTimeout(() => {
                onClose("/");
            }, 4000);
    
        } catch (error) {
            dispatch(signinFailure(error.message));
            setAlert({ type: "error", message: error.message });
        }
    };

    // Handle phone number submission
    const handlePhoneSubmit = () => {
        if (!phoneNumber || phoneNumber.length < 10) {
            return setAlert({ type: "warning", message: "Please enter a valid mobile number." });
        }

        const updatedUserData = { ...userData, phone: phoneNumber };
        setShowPhoneModal(false);
        registerUser(updatedUserData);
    };

    return (
        <div className="w-full">
            <button
                className="w-full bg-red-500 cursor-pointer text-white py-2 rounded-md hover:bg-red-600 transition"
                onClick={handleGoogleClick}
                disabled={loading}
            >
                {loading ? <Loader size={15} color="white" variant="dots" /> : "Sign Up With Google"}
            </button>

            {/* Phone Number Modal */}
            {showPhoneModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/50 bg-opacity-50 backdrop-blur-sm z-50">
                    <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg w-[90%] max-w-sm">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Enter Mobile Number</h2>
                        <input
                            type="tel"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white"
                            placeholder="Enter mobile number"
                        />
                        <div className="flex justify-end mt-4 gap-2">
                            <button
                                className="bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-500 transition"
                                onClick={() => setShowPhoneModal(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
                                onClick={handlePhoneSubmit}
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SignupWithGoogle;
