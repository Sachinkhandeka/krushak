import React, { useState } from "react";
import { IoMenuOutline } from "react-icons/io5";
import { GoPlus } from "react-icons/go";
import { useDispatch, useSelector } from "react-redux";
import { RxMoon, RxSun } from "react-icons/rx";
import { Link, useNavigate } from "react-router-dom"
import { toggleSidebar } from "../../redux/slices/sidebarSlice";
import { toggleTheme } from "../../redux/slices/themeSlice";
import { PiUser } from "react-icons/pi";
import SuspenseWrapper from "../utils/SuspenseWrapper";
import UserAvatar from "./UserAvatar";

const AuthModal = React.lazy(()=> import("../../pages/auth/AuthModal"));

const Navbar = () => {
    const navigate = useNavigate();
    const { currUser } = useSelector( state => state.user );
    const { theme } = useSelector(state => state.theme);
    const dispatch = useDispatch();
    const [isLoginOpen, setIsLoginOpen] = useState(false);

    return (
        <nav className="bg-white border-gray-200 dark:bg-gray-900 shadow-md sticky top-0 z-30">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                <div className="flex items-center gap-3">
                    {/* Sidebar Toggle Button */}
                    <IoMenuOutline 
                        size={28} 
                        className="cursor-pointer text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition duration-200" 
                        onClick={() => dispatch(toggleSidebar())} 
                    />

                    {/* Logo and Branding */}
                    <Link to="/" className="flex items-center gap-2 rtl:space-x-reverse group">
                        <span className="self-center text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-wide transition-colors duration-200 
                            font-[cursive] group-hover:text-green-600 dark:group-hover:text-green-400">
                            Krushak.
                        </span>
                    </Link>
                </div>

                <div className="flex items-center gap-4">
                    {/*  Rent Equipment Icon */}
                    {currUser && (
                        <div className="relative w-10 h-10 flex items-center justify-center overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600 cursor-pointer" >
                            <button 
                                className="flex items-center gap-2 cursor-pointer hover:text-green-700 dark:hover:text-green-300 transition"
                                onClick={() => navigate("/register-equipment")}
                            >
                                <GoPlus size={28} /> 
                            </button>
                        </div>
                    )}
                    {/* Theme Toggle Button */}
                    <button 
                        className="w-10 h-10 cursor-pointer flex items-center justify-center rounded-full transition-all duration-300 
                            bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-800 
                            border border-gray-300 dark:border-gray-500 shadow-sm"
                        onClick={() => dispatch(toggleTheme())}
                        aria-label="Toggle Theme"
                    >
                        {theme === "light" ? (
                            <RxMoon className="text-blue-400 text-xl" />
                        ) : (
                            <RxSun className="text-yellow-400 text-xl" />
                        )}
                    </button>

                    {/* User Avatar Placeholder */}
                    { !currUser ? (
                        <Link to={"/login"} >
                            <div onClick={() => setIsLoginOpen(true)} className="relative w-10 h-10 flex items-center justify-center overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600 cursor-pointer">
                                <PiUser size={28} />
                            </div>
                        </Link>
                    ) : (
                        <UserAvatar user={currUser} />
                    ) }
                </div>
            </div>
            {
                isLoginOpen && (
                    <SuspenseWrapper>
                        <AuthModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
                    </SuspenseWrapper>
                )
            }
        </nav>
    );
};

export default Navbar;