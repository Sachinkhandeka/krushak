import React from "react";
import { MdCancel, MdViewInAr } from "react-icons/md";
import { NavLink } from "react-router-dom";
import { FaHome, FaTractor, FaClipboardList, FaUserCircle } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { toggleSidebar } from "../../redux/slices/sidebarSlice";

export default function Sidebar() {
    const { currUser } = useSelector((state) => state.user);
    const isOpen = useSelector((state) => state.sidebar.isOpen);
    const dispatch = useDispatch();

    // ✅ Define navigation items dynamically based on role
    const navItems = [
        { name: "Home", path: "/", icon: <FaHome /> },
        currUser?.role === "EquipmentOwner" && { name: "My Equipments", path: "/equipments", icon: <FaTractor /> },
        { name: "My Bookings", path: "/bookings", icon: <FaClipboardList /> },
        { name: "Recently Viewed", path: "/recently-viewed-items", icon: <MdViewInAr /> },
        { name: "Profile", path: "/profile", icon: <FaUserCircle /> },
    ].filter(Boolean); // ✅ Remove `null` values (if condition fails)

    return (
        <aside className={`bg-gray-100 dark:bg-gray-900 z-40 h-full w-64 p-4 fixed top-0 left-0 transform transition-transform duration-300 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
            {/* Sidebar Header */}
            <div className="flex items-center justify-between text-lg font-bold pb-4 border-b border-gray-600">
                <span className="text-green-600">Krushak</span>
                <MdCancel size={24} className="cursor-pointer hover:text-gray-400" onClick={() => dispatch(toggleSidebar())} />
            </div>

            {/* Navigation Items */}
            <ul className="mt-4">
                {navItems.map((item, index) => (
                    <li key={index} className="mb-2">
                        <NavLink 
                            to={item.path} 
                            className={({ isActive }) => 
                                `flex items-center gap-3 px-4 py-2 rounded-lg transition duration-300 ease-in-out 
                                ${isActive ? "bg-green-600 text-white" : "hover:bg-green-200 hover:dark:bg-green-400 hover:dark:text-black"}`
                            }
                        >
                            {item.icon}
                            <span>{item.name}</span>
                        </NavLink>
                    </li>
                ))}
            </ul>
        </aside>
    );
}
