import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PiUserLight } from "react-icons/pi";

const OwnerEquipmentCard = ({ item }) => {
    const navigate = useNavigate();
    const [preview, setPreview] = useState(item.video || item.images[0]); 

    //  Function to handle navigation
    const handleCardClick = (e) => {
        if (e.target.tagName === "IMG" || e.target.tagName === "VIDEO") return;
        navigate(`/${item._id}/my-equipments/edit`);
    };

    return (
        <div 
            onClick={handleCardClick} 
            className="relative bg-white dark:bg-gray-900 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition cursor-pointer"
        >
            {/*  Preview Section */}
            <div className="w-full h-72 bg-gray-200 dark:bg-gray-700 overflow-hidden">
                {preview && preview.includes(".mp4") ? (
                    <video 
                        controls 
                        src={preview} 
                        className="w-full h-full object-cover"
                        onClick={(e) => e.stopPropagation()} 
                    ></video>
                ) : (
                    <img 
                        src={preview} 
                        alt={item.name} 
                        className="w-full h-full object-cover" 
                        onClick={(e) => e.stopPropagation()}
                    />
                )}
            </div>

            {/*  Image Thumbnails */}
            {item.images.length > 1 && (
                <div className="flex justify-center gap-2 p-2 bg-gray-100 dark:bg-gray-700">
                    {item.images.slice(0, 5).map((img, index) => (
                        <img
                            key={index}
                            src={img}
                            alt={`Thumbnail ${index + 1}`}
                            className={`w-12 h-12 object-cover rounded cursor-pointer border-2 transition ${preview === img ? "border-green-600" : "border-transparent"}`}
                            onClick={(e) => {
                                e.stopPropagation();
                                setPreview(img);
                            }}
                        />
                    ))}
                </div>
            )}

            {/*  Equipment Details */}
            <div className="p-4 space-y-3">
                <div className="flex flex-col gap-2">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{item.name}</h3>
                    <div className="grid grid-cols-1 gap-1">
                        <span className="px-2 py-1 text-xs font-medium bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-md">{item.category}</span>
                        <span className="px-2 py-1 text-xs font-medium bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-md">{item.type}</span>
                    </div>
                </div>

                {/*  Pricing & Condition */}
                <div className="flex justify-between items-center text-sm text-gray-700 dark:text-gray-300">
                    <p className="font-medium">Condition: <span className="font-normal">{item.condition}</span></p>
                    <p className="text-green-600 dark:text-green-400 text-xl font-bold">
                        ₹{item.pricing[0]?.price || "--"} <span className="text-sm font-normal">/ {item.pricing[0]?.unit || "--"}</span>
                    </p>
                </div>

                {/*  Model & Year */}
                <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400">
                    <p>Model: <span className="font-medium">{item.model?.modelType || "N/A"}</span></p>
                    <p>Year: <span className="font-medium">{item.year || "N/A"}</span></p>
                </div>

                {/*  Location */}
                <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400">
                    <p>State: <span className="font-medium">{item.availabilityArea[0]?.state || "N/A"}</span></p>
                    <p>District: <span className="font-medium">{item.availabilityArea[0]?.district || "N/A"}</span></p>
                </div>

                {/*  Owner Details */}
                <div className="flex items-center gap-2 mt-3">
                    { item.owner.avatar ? (
                        <img 
                            src={item.owner.avatar} 
                            alt={item.owner.displayName || "Owner"} 
                            className="w-12 h-12 rounded-full object-cover border border-gray-300 dark:border-gray-600"
                        />
                    ) : (
                        <span className="w-10 h-10 rounded-full flex items-center justify-center text-gray-400 dark:text-gray-600 border border-gray-300 dark:border-gray-600">
                            <PiUserLight size={32} />
                        </span>
                    )}
                    <p className="text-sm text-gray-700 dark:text-gray-300">Owned by <span className="font-medium">{item.owner.displayName}</span></p>
                </div>
            </div>
        </div>
    );
};

export default OwnerEquipmentCard;
