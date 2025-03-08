import React, { useState } from "react";
import { fetchWithAuth } from "../../utilityFunction";
import Loader from "../utils/Loader";
import Alert from "../utils/Alert";

const StepFourMediaUpload = ({ equipmentId, navigate }) => {
    const [images, setImages] = useState([]);
    const [video, setVideo] = useState(null);
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState({ type: "", message: "" });

    // Handle image selection
    const handleImageChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        setImages(selectedFiles);
    };

    // Remove selected image
    const removeImage = (index) => {
        setImages(images.filter((_, i) => i !== index));
    };

    // Handle video selection
    const handleVideoChange = (e) => {
        setVideo(e.target.files[0]);
    };

    // Remove selected video
    const removeVideo = () => {
        setVideo(null);
    };

    // Handle Image Upload
    const uploadImages = async () => {
        if(!equipmentId) {
            return setAlert({ type : "warning", message : "Cannot found right equipment for image upload" });
        }
        if (images.length === 0) {
            return setAlert({ type : "info", message : "Atleast upload one image to proceed" });
        }
        setLoading(true);

        const formData = new FormData();
        images.forEach((image) => formData.append("images", image));

        try {
            const response = await fetchWithAuth(
                `/api/v1/equipment/${equipmentId}/image`, 
                { method: "PUT", body: formData},
                setLoading,
                setAlert,
                navigate        
        );

            setAlert({ type: "success", message: response.message || "Images uploaded successfully!" });
            setImages([]);
        } catch (error) {
            setAlert({ type: "error", message: error.message || "Failed to upload images!" });
        } finally {
            setLoading(false);
        }
    };

    // Handle Video Upload
    const uploadVideo = async () => {
        if(!equipmentId) {
            return setAlert({ type : "warning", message : "Cannot found right equipment for video upload" });
        }
        if (!video) {
            return setAlert({ type : "info", message : "Upload video to proceed" });
        }
        setLoading(true);

        const formData = new FormData();
        formData.append("video", video);

        try {
            const response = await fetchWithAuth(`/api/v1/equipment/${equipmentId}/video`, {
                method: "PUT",
                body: formData,
            },
            setLoading,
            setAlert,
            navigate );

            setAlert({ type: "success", message: response.message || "Video uploaded successfully!" });
        } catch (error) {
            setAlert({ type: "error", message: error.message || "Failed to upload video!" });
        } finally {
            setLoading(false);
        }
    };

    // Final Submit & Navigate
    const finishProcess = () => {
        navigate("/");
    };

    return (
        <div className="w-full p-6 bg-white dark:bg-gray-900 shadow-lg rounded-lg">
            {/* Alert Messages */}
            <div className="fixed top-14 right-4 z-50 w-[70%] max-w-sm">
                {alert.message && <Alert type={alert.type} message={alert.message} autoDismiss onClose={() => setAlert({ type : "", message : ""})} />}
            </div>

            <h2 className="text-2xl font-bold my-6 text-gray-800 dark:text-gray-100">
                Upload Equipment Media
            </h2>

            {/* Image Upload Section */}
            <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Upload Images</h3>
                <label className="block bg-gray-100 dark:bg-gray-800 p-4 border-dashed border-2 rounded-lg cursor-pointer text-center">
                    <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageChange} />
                    <p className="text-gray-500 dark:text-gray-300">Click to select or drag and drop images</p>
                </label>

                {/* Image Previews */}
                {images.length > 0 && (
                    <div className="mt-4 flex gap-2 flex-wrap">
                        {images.map((image, index) => (
                            <div key={index} className="relative">
                                <img src={URL.createObjectURL(image)} alt="Preview" className="h-20 w-20 object-cover rounded-lg" />
                                <span
                                    className="absolute top-0 right-0 bg-red-500 hover:bg-red-700 cursor-pointer text-xs text-white rounded-full px-1.5 py-0.5"
                                    onClick={() => removeImage(index)}
                                >
                                    ✕
                                </span>
                            </div>
                        ))}
                    </div>
                )}

                <button
                    type="button"
                    className="mt-4 bg-green-500 cursor-pointer text-white px-4 py-2 rounded-md"
                    onClick={uploadImages}
                    disabled={images.length === 0 || loading}
                >
                    {loading ? <Loader size={18} color="white" variant="dots" /> : "Upload Images"}
                </button>
            </div>

            {/* Video Upload Section */}
            <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Upload Video</h3>
                <label className="block bg-gray-100 dark:bg-gray-800 p-4 border-dashed border-2 rounded-lg cursor-pointer text-center">
                    <input type="file" accept="video/*" className="hidden" onChange={handleVideoChange} />
                    <p className="text-gray-500 dark:text-gray-300">Click to select a video file</p>
                </label>

                {/* Video Preview */}
                {video && (
                    <div className="mt-4 relative">
                        <video src={URL.createObjectURL(video)} controls className="w-full max-w-md rounded-lg shadow-lg"></video>
                        <span
                            className="absolute top-0 right-0 bg-red-500 hover:bg-red-700 cursor-pointer text-xs text-white rounded-full px-1.5 py-0.5"
                            onClick={() => removeVideo()}
                        >
                            ✕
                        </span>
                    </div>
                )}

                <button
                    type="button"
                    className="mt-4 bg-green-500 cursor-pointer text-white px-4 py-2 rounded-md"
                    onClick={uploadVideo}
                    disabled={!video || loading}
                >
                    {loading ? <Loader size={18} color="white" variant="dots" /> : "Upload Video"}
                </button>
            </div>

            {/* Finish Process Button */}
            <div className="mt-6 text-right">
                <button type="button" className="bg-green-500 text-white px-4 py-2 rounded-md" onClick={finishProcess}>
                    Finish & Go to Home
                </button>
            </div>
        </div>
    );
};

export default StepFourMediaUpload;
