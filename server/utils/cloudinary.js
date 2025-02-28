const cloudinary = require("cloudinary").v2 ; 
const ApiError = require("./apiError.js");
const fs = require("fs");

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath)=> {
    try {
        if(!localFilePath) throw new ApiError(401, "File path  not found!");
        const uploadedFile = await cloudinary.uploader.upload(localFilePath, {
            resource_type : "auto",
        });
        
        fs.unlinkSync(localFilePath); // removes the locally stored file as the upload operation completes.
        return uploadedFile ; 
    } catch (error) {
        fs.unlinkSync(localFilePath);  // removes the locally stored file as the upload operation fails.
        throw new ApiError(401, error.message);
    }
}

const removeFromCloudinary = async (imgURL)=> {
    try {
        if(!imgURL) throw new ApiError(401, "File URL is missing");

        // Extract `public_id` from Cloudinary URL
        const urlParts = imgURL.split("/");
        const publicIdWithExtension = urlParts.pop(); // e.g., "sample.jpg"
        const publicId = `${publicIdWithExtension.split(".")[0]}`; // Remove file extension

        // Delete image from Cloudinary
        const response = await cloudinary.uploader.destroy(publicId);

        if (response.result !== "ok") {
            throw new Error("Failed to delete file from Cloudinary");
        }

        return { success: true, message: "File deleted successfully" };
        
    } catch (error) {
        // console.log(error.message);
        throw new ApiError(401, error.message);
    }
}

module.exports = { uploadOnCloudinary, removeFromCloudinary } ; 