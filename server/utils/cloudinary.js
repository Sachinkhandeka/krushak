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
        if(!localFilePath) return ApiError(401, "File path  not found!");
        const uploadedFile = await cloudinary.uploader.upload(localFilePath, {
            resource_type : "auto",
        });
        
        fs.unlinkSync(localFilePath);
        return uploadedFile ; 
    } catch (error) {
        fs.unlinkSync(localFilePath);  // removes the locally stored file as the upload operation fails.
        console.log(error.message);
        return ApiError(401, error.message);
    }
}

module.exports = uploadOnCloudinary ; 