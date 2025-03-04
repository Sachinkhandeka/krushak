import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Signup = () => {
    const [formData, setFormData] = useState({
        displayName: "",
        username: "",
        email: "",
        password: "",
        phone: "",
        termsAccepted: false
    });

    const navigate = useNavigate();

    // Handle Input Change
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value
        });
    };

    // Handle Form Submission
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.termsAccepted) {
            alert("Please accept the terms and conditions.");
            return;
        }
        console.log("User Registered:", formData);
        navigate("/");
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-96">
                <h2 className="text-2xl font-bold text-center mb-4">Create an Account</h2>

                {/* Signup Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="text" name="displayName" placeholder="Full Name" required className="w-full p-2 border rounded" onChange={handleChange} />
                    <input type="text" name="username" placeholder="Username" required className="w-full p-2 border rounded" onChange={handleChange} />
                    <input type="email" name="email" placeholder="Email" required className="w-full p-2 border rounded" onChange={handleChange} />
                    <input type="password" name="password" placeholder="Password" required className="w-full p-2 border rounded" onChange={handleChange} />
                    <input type="tel" name="phone" placeholder="Phone Number" required className="w-full p-2 border rounded" onChange={handleChange} />

                    <div className="flex items-center">
                        <input type="checkbox" name="termsAccepted" id="terms" onChange={handleChange} className="mr-2" />
                        <label htmlFor="terms" className="text-sm">I accept the <a href="#" className="text-blue-500">Terms & Conditions</a></label>
                    </div>

                    <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">Sign Up</button>
                </form>

                {/* Google Sign-In */}
                <button onClick={()=> {}} className="w-full bg-red-500 text-white p-2 rounded mt-4">Sign Up with Google</button>

                <p className="text-sm text-center mt-4">Already have an account? <Link to="/login" className="text-blue-500">Log in</Link></p>
            </div>
        </div>
    );
};

export default Signup;
