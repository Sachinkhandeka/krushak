import { useState, useRef, useEffect } from "react";
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
    const [alert, setAlert] = useState({ type: "", message: "" });
    
    const dropdownRef = useRef(null); // Ref for dropdown
    const avatarRef = useRef(null); // Ref for avatar

    // Function to handle signout
    const handleSignout = async () => {
        setLoading(true);
        try {
            const response = await fetchWithAuth(
                "/api/v1/users/logout",
                { method: "POST" },
                setLoading,
                setAlert,
                navigate
            );

            if (response) {
                dispatch(signoutSuccess());
            }
            navigate("/");
        } catch (error) {
            console.log(error.message);
        } finally {
            setLoading(false);
        }
    };

    // Function to handle clicks outside the dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target) &&
                avatarRef.current &&
                !avatarRef.current.contains(event.target)
            ) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
            document.addEventListener("touchstart", handleClickOutside); // For mobile
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("touchstart", handleClickOutside);
        };
    }, [isOpen]);

    return (
        <div className="relative">
            {/* User Avatar */}
            {user ? (
                <div
                    ref={avatarRef}
                    className="relative w-10 h-10 flex items-center justify-center overflow-hidden bg-gray-200 rounded-full dark:bg-gray-700 cursor-pointer transition-all hover:scale-105"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {user.avatar ? (
                        <img src={user?.avatar} alt="User Avatar" className="w-full h-full object-cover" />
                    ) : (
                        <span className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                            {user.displayName ? user.displayName[0].toUpperCase() : 'N/A'}
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
                    ref={dropdownRef}
                    className="absolute top-12 right-0 bg-white dark:bg-gray-800 shadow-xl rounded-lg w-80 z-50 border border-gray-200 dark:border-gray-700 transition-all duration-200 overflow-hidden"
                >
                    {/* Cover Image */}
                    <div className="relative w-full h-20">
                        {user.coverImage ? (
                            <img
                                src={user.coverImage}
                                alt="Cover"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full bg-gradient-to-r from-green-500 to-blue-500" />
                        )}
                    </div>

                    {/* User Info */}
                    <div className="relative px-5 pt-5 pb-4 -mt-10 flex items-center gap-4">
                        <div className="w-16 h-16 flex items-center justify-center overflow-hidden bg-gray-300 rounded-full dark:bg-gray-700 border-4 border-white dark:border-gray-900 shadow-md">
                            {user.avatar ? (
                                <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover rounded-full" />
                            ) : (
                                <span className="text-xl font-semibold text-gray-800 dark:text-gray-300">
                                    {user.displayName[0].toUpperCase()}
                                </span>
                            )}
                        </div>
                        <div className="my-4">
                            <h3 className="font-semibold text-gray-900 dark:text-white text-lg">{user.displayName}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{user.role}</p>
                        </div>
                    </div>

                    {/* User Details */}
                    <div className="px-5 py-2 border-t border-gray-200 dark:border-gray-700">
                        <ul className="text-gray-700 dark:text-gray-300 space-y-2">
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
                    </div>

                    {/* Logout Button */}
                    <div className="px-5 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-center">
                        <button
                            className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md font-semibold transition-all disabled:opacity-50"
                            onClick={handleSignout}
                            disabled={loading}
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
