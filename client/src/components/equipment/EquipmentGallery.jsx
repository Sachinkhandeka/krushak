import React, { useState } from "react";
import ToggleFavorite from "../common/ToggleFavorite";
import { useSelector } from "react-redux";

const EquipmentGallery = ({ equipmentId, video, images, name, setAlert }) => {
    const { currUser } = useSelector( state => state.user );
    const [preview, setPreview] = useState(video || images[0] || "/fallback.jpg");

    return (
        <div className="w-full md:w-3/5 relative">
            <div className="w-full h-[400px] bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
                <ToggleFavorite 
                    itemId={equipmentId} 
                    isInitiallyFavorite={currUser && currUser.favorites ? currUser.favorites.includes(equipmentId) : false}
                    setAlert={setAlert} 
                />
                {preview.includes(".mp4") ? (
                    <video controls src={preview} className="w-full h-full object-cover"></video>
                ) : (
                    <img src={preview} alt={name} className="w-full h-full object-cover" />
                )}
            </div>

            {/* Image Thumbnails */}
            {images.length > 1 && (
                <div className="flex gap-2 mt-2">
                    {images.slice(0, 5).map((img, index) => (
                        <img
                            key={index}
                            src={img}
                            alt={`Thumbnail ${index + 1}`}
                            className={`w-16 h-16 object-cover rounded cursor-pointer border-2 transition ${
                                preview === img ? "border-green-600" : "border-transparent"
                            }`}
                            onClick={() => setPreview(img)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default EquipmentGallery;
