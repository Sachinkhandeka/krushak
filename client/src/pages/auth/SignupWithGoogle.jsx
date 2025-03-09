import React, { useState } from "react";
import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";
import { app } from "../../firebase";
import { useDispatch, useSelector }  from "react-redux";
import { signinStart, signinSuccess, signinFailure } from "../../redux/slices/userSlice";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/utils/Loader";

const SignupWithGoogle = ({ setAlert, onClose }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { loading } = useSelector( state => state.user );
    const auth = getAuth(app);

    // Function to generate a username if not provided
    const generateUsername = (name) => {
        return name.toLowerCase().replace(/\s+/g, "_") + Math.floor(1000 + Math.random() * 9000);
    };

    const handleGoogleClick = async () => {
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({ prompt: "select_account" });

        try {
            dispatch(signinStart());
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            // Extract necessary details
            const userData = {
                displayName: user.displayName,
                username: user.displayName ? generateUsername(user.displayName) : null, 
                email: user.email,
                password: user.uid,
                avatar : user.photoURL,
                phone: user.phoneNumber,
                role: "Farmer", 
            };

            // Call the API to register/login
            const response = await fetch("/api/v1/users/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userData }),
            });

            const data = await response.json();
            if (!response.ok) {
                dispatch(signinFailure(data.message));
                return setAlert({ type : "error", message : data.message });
            }

            dispatch(signinSuccess(data.data.user));
            setAlert({ type : "success", message : data.message });
            setTimeout(() => {
                onClose();
            }, 4000);            
            navigate("/");
        } catch (err) {
            dispatch(signinFailure(err.message));
            setAlert({ type : "error", message : err.message });
        }
    }

    return (
        <button 
            className="w-full bg-red-500 cursor-pointer text-white py-2 rounded-md hover:bg-red-600 transition"
            onClick={handleGoogleClick}
            disabled={loading}
        >
            { loading ? <Loader size={15} color="white" variant="dots" /> : "Sign Up With Google" }
        </button>
    )
}

export default SignupWithGoogle