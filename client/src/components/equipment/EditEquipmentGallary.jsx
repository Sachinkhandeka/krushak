import React, { useState } from "react";
import { FaTrash, FaUpload } from "react-icons/fa";
import { fetchWithAuth } from "../../utilityFunction";

const EditEquipmentGallery = ({ video, images, equipmentId, setLoading, setAlert, navigate, onUpdate }) => {
    const [preview, setPreview] = useState(video || images[0] || "/fallback.jpg");
    const [media, setMedia] = useState({ images, video });
    const [selectedImageFiles, setSelectedImageFiles] = useState([]);
    const [selectedVideoFile, setSelectedVideoFile] = useState(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const newMediaURL = URL.createObjectURL(file);

        if (file.type.startsWith("video/")) {
            setMedia((prev) => ({ ...prev, video: newMediaURL }));
            setPreview(newMediaURL);
            setSelectedVideoFile(file);
        } else {
            if (media.images.length >= 5) {
                return setAlert({ type: "warning", message: "You can only upload up to 5 images." });
            }
            setMedia((prev) => ({ ...prev, images: [...prev.images, newMediaURL] }));
            setPreview(newMediaURL);
            setSelectedImageFiles((prev) => [...prev, file]);
        }
    };

    // Upload Images
    const uploadImages = async () => {
        if (!equipmentId) {
            return setAlert({ type: "warning", message: "Cannot find the correct equipment for image upload" });
        }
        if (selectedImageFiles.length === 0) {
            return setAlert({ type: "info", message: "Please select at least one image to upload" });
        }
        setLoading(true);

        const formData = new FormData();
        selectedImageFiles.forEach((image) => formData.append("images", image));

        try {
            const response = await fetchWithAuth(
                `/api/v1/equipment/${equipmentId}/image`,
                { method: "PUT", body: formData },
                setLoading,
                setAlert,
                navigate
            );

            if (response) {
                setAlert({ type: "success", message: response.message || "Images uploaded successfully!" });
                setSelectedImageFiles([]);
                onUpdate({ images: response.data.images });
            }
        } catch (error) {
            setAlert({ type: "error", message: error.message || "Failed to upload images!" });
        } finally {
            setLoading(false);
        }
    };

    // Upload Video
    const uploadVideo = async () => {
        if (!equipmentId) {
            return setAlert({ type: "warning", message: "Cannot find the correct equipment for video upload" });
        }
        if (!selectedVideoFile) {
            return setAlert({ type: "info", message: "Please select a video to upload" });
        }
        setLoading(true);

        const formData = new FormData();
        formData.append("video", selectedVideoFile);

        try {
            const response = await fetchWithAuth(
                `/api/v1/equipment/${equipmentId}/video`,
                { method: "PUT", body: formData },
                setLoading,
                setAlert,
                navigate
            );

            if (response) {
                setAlert({ type: "success", message: response.message || "Video uploaded successfully!" });
                setSelectedVideoFile(null);
                onUpdate({ video: response.data.video });
            }
        } catch (error) {
            setAlert({ type: "error", message: error.message || "Failed to upload video!" });
        } finally {
            setLoading(false);
        }
    };

    // Delete Image from Cloudinary & Database
    const handleDeleteImage = async (imageURL, index) => {
        if (!equipmentId) {
            return setAlert({ type: "warning", message: "Cannot find the correct equipment for image deletion" });
        }

        setLoading(true);
        try {
            const response = await fetchWithAuth(
                `/api/v1/equipment/${equipmentId}/delete`,
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ imageURL }),
                },
                setLoading,
                setAlert,
                navigate
            );

            if (response) {
                setAlert({ type: "success", message: response.message || "Image deleted successfully!" });

                const updatedImages = media.images.filter((_, i) => i !== index);
                setMedia((prev) => ({ ...prev, images: updatedImages }));

                if (preview === imageURL) {
                    setPreview(updatedImages.length > 0 ? updatedImages[0] : "/fallback.jpg");
                }
                onUpdate({ images: response.data.images });
            }
        } catch (error) {
            setAlert({ type: "error", message: error.message || "Failed to delete image!" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full md:w-3/5">
            {/* Preview Section */}
            <div className="w-full h-[400px] bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden relative">
                {preview.includes(".mp4") ? (
                    <video controls src={preview} className="w-full h-full object-cover"></video>
                ) : (
                    <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                )}
            </div>

            {/* Upload Buttons */}
            <div className="mt-4 flex flex-col sm:flex-row items-center gap-3">
                {/* Image Upload */}
                <label
                    htmlFor="upload-image"
                    className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-md cursor-pointer hover:bg-blue-700 flex items-center gap-2 justify-center"
                >
                    <FaUpload /> Select Images
                </label>
                <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    id="upload-image"
                    multiple
                    onChange={handleFileChange}
                />
                <button
                    onClick={uploadImages}
                    className="w-full cursor-pointer sm:w-auto px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center gap-2 justify-center"
                    disabled={selectedImageFiles.length === 0}
                >
                    <FaUpload /> Upload Images
                </button>
            </div>

            <div className="mt-2 flex flex-col sm:flex-row items-center gap-3">
                {/* Video Upload */}
                <label
                    htmlFor="upload-video"
                    className="w-full sm:w-auto px-4 py-2 bg-purple-600 text-white rounded-md cursor-pointer hover:bg-purple-700 flex items-center gap-2 justify-center"
                >
                    <FaUpload /> Select Video
                </label>
                <input
                    type="file"
                    accept="video/*"
                    className="hidden"
                    id="upload-video"
                    onChange={handleFileChange}
                />
                <button
                    onClick={uploadVideo}
                    className="w-full sm:w-auto cursor-pointer px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center gap-2 justify-center"
                    disabled={!selectedVideoFile}
                >
                    <FaUpload /> Upload Video
                </button>
            </div>

            {/* Image Thumbnails */}
            {media.images.length > 0 && (
                <div className="flex gap-2 mt-4 flex-wrap">
                    {media.images.map((img, index) => (
                        <div key={index} className="relative group">
                            <img
                                src={img}
                                alt={`Thumbnail ${index + 1}`}
                                className={`w-16 h-16 object-cover rounded cursor-pointer border-2 transition ${
                                    preview === img ? "border-green-600" : "border-transparent"
                                }`}
                                onClick={() => setPreview(img)}
                            />
                            <button
                                className="absolute cursor-pointer top-0 right-0 bg-red-600 text-white rounded-full p-1 text-xs md:opacity-0 md:group-hover:opacity-100 transition"
                                onClick={() => handleDeleteImage(img, index)}
                            >
                                <FaTrash />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default EditEquipmentGallery;
