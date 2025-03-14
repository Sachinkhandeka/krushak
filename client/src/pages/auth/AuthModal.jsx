import React from "react";
import Login from "./Login";
import Signup from "./Signup";
import { useLocation, useNavigate } from "react-router-dom";

const AuthModal = () => {
    const location = useLocation();
    const navigate = useNavigate();
    
    // Check if it's login or signup
    const isLogin = location.pathname === "/login";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Background Overlay */}
            <div 
                className="absolute inset-0 bg-black opacity-50 backdrop-blur-md"
                onClick={() => navigate("/")}
            ></div>

            {/* Render Login or Signup Modal Based on URL */}
            {isLogin ? <Login onClose={navigate} /> : <Signup onClose={navigate} />}
        </div>
    );
};

export default AuthModal;
