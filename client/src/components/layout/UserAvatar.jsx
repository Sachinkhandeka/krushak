import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PiUser } from "react-icons/pi";
import { FiLogOut } from "react-icons/fi";
import { signoutSuccess } from "../../redux/slices/userSlice";
import { useDispatch } from "react-redux";
import Loader from "../utils/Loader";
import { fetchWithAuth } from "../../utilityFunction";

export default function UserAvatar({ user }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState({ type : "", message : "" });

    const handleSignout = async () => {
        setLoading(true); // Set loading state before making the request
        try {
            const response = await fetchWithAuth(
                "/api/v1/users/logout", 
                { method: "POST" },
                setLoading,
                setAlert,
                navigate
            );

            if(response) {
                dispatch(signoutSuccess());
            }
            navigate("/");
        } catch (error) {
            console.log(error.message);
        } finally {
            setLoading(false); // Reset loading state
        }
    };

    return (
        <div className="relative">
            {/* User Avatar */}
            {user ? (
                <div
                    className="relative w-10 h-10 flex items-center justify-center overflow-hidden bg-gray-200 rounded-full dark:bg-gray-700 cursor-pointer transition-all hover:scale-105"
                    onMouseEnter={() => setIsOpen(true)}
                >
                    {user.avatar ? (
                        <img src={user.avatar} alt="User Avatar" className="w-full h-full object-cover" />
                    ) : (
                        <span className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                            {user.displayName[0].toUpperCase()}
                        </span>
                    )}
                </div>
            ) : (
                <Link to="/login">
                    <div className="relative w-10 h-10 flex items-center justify-center overflow-hidden bg-gray-200 rounded-full dark:bg-gray-700 cursor-pointer hover:scale-105 transition-all">
                        <PiUser size={26} className="text-gray-600 dark:text-gray-300" />
                    </div>
                </Link>
            )}

            {/* Dropdown */}
            {isOpen && user && (
                <div
                    className="absolute top-12 right-0 bg-white dark:bg-gray-800 shadow-xl rounded-lg w-72 p-5 z-50 border border-gray-200 dark:border-gray-700 transition-all duration-200"
                    onMouseEnter={() => setIsOpen(true)}
                    onMouseLeave={() => setIsOpen(false)}
                >
                    <div className="flex items-center gap-4 pb-3 border-b border-gray-300 dark:border-gray-700">
                        <div className="w-14 h-14 flex items-center justify-center overflow-hidden bg-gray-300 rounded-full dark:bg-gray-700">
                            {user.avatar ? (
                                <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover rounded-full" />
                            ) : (
                                <span className="text-xl font-semibold text-gray-800 dark:text-gray-300">
                                    {user.displayName[0].toUpperCase()}
                                </span>
                            )}
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-lg">{user.displayName}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{user.role}</p>
                        </div>
                    </div>
                    <ul className="mt-3 space-y-2 text-gray-700 dark:text-gray-300">
                        <li className="flex justify-between">
                            <span className="font-medium text-gray-600 dark:text-gray-400">Email:</span>
                            <span className="truncate">{user.email}</span>
                        </li>
                        <li className="flex justify-between">
                            <span className="font-medium text-gray-600 dark:text-gray-400">Username:</span>
                            <span className="truncate">{user.username}</span>
                        </li>
                        <li className="flex justify-between">
                            <span className="font-medium text-gray-600 dark:text-gray-400">Phone:</span>
                            <span>{user.phone}</span>
                        </li>
                    </ul>
                    <div className="mt-4 flex w-full">
                        <button 
                            className="px-4 py-2 cursor-pointer flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white rounded-md transition-all disabled:opacity-50"
                            onClick={handleSignout}
                            disabled={loading} // Disable button while loading
                        >
                            {loading ? <Loader size={15} color="white" variant="dots" /> : <FiLogOut size={16} />}
                            <span>{loading ? "Logging out..." : "Logout"}</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
