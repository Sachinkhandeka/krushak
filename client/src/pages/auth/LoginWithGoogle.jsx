import React, { useState } from "react";
import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";
import { app } from "../../firebase";
import { useDispatch, useSelector }  from "react-redux";
import { signinStart, signinSuccess, signinFailure } from "../../redux/slices/userSlice";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/utils/Loader";

const LoginWithGoogle = ({ setAlert, onClose }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { loading } = useSelector( state => state.user );
    const auth = getAuth(app);

    const handleGoogleClick = async () => {
            const provider = new GoogleAuthProvider();
            provider.setCustomParameters({ prompt: "select_account" });
    
            try {
                dispatch(signinStart());
                const result = await signInWithPopup(auth, provider);
                const user = result.user;

                if(!user) {
                    dispatch(signinFailure("Something went wrong while logging you with google"));
                    return setAlert({ type : "error", message : "Something went wrong while logging you with google" });
                }
    
                // Extract necessary details
                    
                const emailOrUsernameOrPhone =  user.email;
                const password =  user.uid;
    
                // Call the API to register/login
                const response = await fetch("/api/v1/users/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ emailOrUsernameOrPhone, password }),
                });
    
                const data = await response.json();
                if (!response.ok) {
                    dispatch(signinFailure(data.message));
                    return setAlert({ type : "error", message : data.message });
                }
    
                dispatch(signinSuccess(data.data.user));
                setAlert({ type : "success", message : data.message });
                setTimeout(() => {
                    onClose("/");
                }, 200);            
            } catch (err) {
                let errorMessage = err.message;

                // Handle specific Google sign-in errors
                if (err.code === "auth/popup-closed-by-user") {
                    errorMessage = "Google sign-in was canceled. Please try again.";
                } else if (err.code === "auth/network-request-failed") {
                    errorMessage = "Network error. Please check your internet connection.";
                }

                dispatch(signinFailure(errorMessage));
                setAlert({ type: "error", message: errorMessage });
            }
    }
    return (
        <button 
            className="w-full bg-red-500 text-white cursor-pointer py-2 rounded-md hover:bg-red-600 transition"
            onClick={handleGoogleClick}
            disabled={loading}
        >
            { loading ? <Loader size={15} color="white" variant="dots" /> : "Log In With Google" }
        </button>
    )
}

export default LoginWithGoogle