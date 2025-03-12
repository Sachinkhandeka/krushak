import React, { useState } from "react";
import { FiCamera } from "react-icons/fi";
import { useDispatch } from "react-redux";
import { fetchWithAuth } from "../../utilityFunction";
import { updateSuccess } from "../../redux/slices/userSlice";
import Loader from "../utils/Loader";

const ProfileHeader = ({ user, setAlert }) => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);

    // Handle Image Upload
    const handleImageUpload = async (e, type) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append(type, file);

        const apiUrl = type === "avatar" 
            ? "/api/v1/users/profile/update-avatar" 
            : "/api/v1/users/profile/update-cover";

        setLoading(true);

        try {
            const response = await fetchWithAuth(
                apiUrl,
                { method: "PUT", body: formData },
                setLoading,
                setAlert
            );

            if (response.success) {
                dispatch(updateSuccess(response.data)); // Update Redux User State
                setAlert({ type: "success", message: `${type === "avatar" ? "Avatar" : "Cover"} updated successfully!` });
            }
        } catch (error) {
            setAlert({ type: "error", message: error.message });
        }
    };

    return (
        <div className="relative w-full h-36 md:h-44 rounded-lg overflow-hidden">
            {/* Cover Image */}
            {user.coverImage ? (
                <img src={user.coverImage} alt="Cover" className="w-full h-full object-cover" />
            ) : (
                <div className="w-full h-full bg-gradient-to-r from-green-500 to-blue-500" />
            )}

            {/* Edit Cover Button */}
            <label className="absolute top-1 right-1 ml-3 px-3 py-1 text-sm bg-gray-700 text-white rounded-md flex items-center gap-2 hover:bg-gray-800 cursor-pointer">
                {loading ? <Loader size={15} color="white" /> : <><FiCamera /> Change Cover</>}
                <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, "coverImage")} />
            </label>

            {/* Avatar (Overlapping Cover) */}
            <div className="absolute bottom-1 left-5 flex items-center">
                <div className="relative w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-lg">
                    {user.avatar ? (
                        <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-300 text-xl font-semibold text-gray-700">
                            {user.displayName[0]}
                        </div>
                    )}
                </div>

                {/* Edit Avatar Button */}
                <label className="ml-3 px-3 py-1 text-sm bg-gray-700 text-white rounded-md flex items-center gap-2 hover:bg-gray-800 cursor-pointer">
                    {loading ? <Loader size={15} color="white" /> : <><FiCamera /> Change Avatar</>}
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, "avatar")} />
                </label>
            </div>
        </div>
    );
};

export default ProfileHeader;
