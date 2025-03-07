import React, { useState } from "react";
import Login from "./Login";
import Signup from "./Signup";
import { Link } from "react-router-dom";

const AuthModal = ({ isOpen, onClose }) => {
    const [isLogin, setIsLogin] = useState(true); 

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Background Overlay */}
            <Link to={"/"} >
            <div className="absolute inset-0 bg-black opacity-50 backdrop-blur-md" onClick={onClose}></div>
            </Link>

            {/* Render Login or Signup Modal Based on `isLogin` State */}
            {isLogin && isLogin === true ? (
                <Login onClose={onClose} switchToSignup={() => setIsLogin(false)} />
            ) : (
                <Signup onClose={onClose} switchToLogin={() => setIsLogin(true)} />
            )}
        </div>
    );
};

export default AuthModal;
