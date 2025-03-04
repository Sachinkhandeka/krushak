const ApiError = require("../utils/apiError.js");
const ApiResponse = require("../utils/apiResponse.js");
const Equipment = require("../models/equipment.js");
const { uploadOnCloudinary, removeFromCloudinary } = require("../utils/cloudinary.js");
const fs = require("fs");

// post a equipment for rent
module.exports.rentEquipment = async( req , res )=> {
    const { equipmentData } = req.body ; 
    let imagesLocalPath = [];

    if( req.files && Array.isArray(req.files.images) && req.files.images.length > 0 ) {
        req.files.images.map(( img ) => {
            return imagesLocalPath.push(img.path);
        } );
    }

    let videoLocalPath ; 
    if( req.files && Array.isArray(req.files.video) && req.files.video.length > 0 ) {
        videoLocalPath = req.files.video[0].path ;
    }

    let imageFiles = [];
    if (imagesLocalPath.length > 0) {
        imageFiles = await Promise.all(imagesLocalPath.map(imgLocalPath => uploadOnCloudinary(imgLocalPath)));
    }

    let images = []
    imageFiles.map( img => {
        return images.push(img.secure_url);
    } );

    let video;
    if (videoLocalPath) {
        const uploadedVideo = await uploadOnCloudinary(videoLocalPath);
        video = uploadedVideo.secure_url;
    }

    let equipment ; 

    try {
        equipment = await Equipment.create({
            name : equipmentData.name,
            description : equipmentData.description,
            category : equipmentData.category,
            type : equipmentData.type,
            model : equipmentData.model,
            year : equipmentData.year,
            condition : equipmentData.condition,
            images : images,
            video : video,
            pricing : equipmentData.pricing,
            availability : equipmentData.availability,
            owner : req.user?._id,
            availabilityArea : equipmentData.availabilityArea,
            discount : equipmentData.discount,
            usedForCrops : equipmentData.usedForCrops,
        });
    
        await equipment.save();
    } catch (error) {
        throw new ApiError(400, error.message);
    }
    
    const rentedEquipment = await Equipment.findById(equipment._id).populate("owner", "displayName username email avatar");

    if(!rentedEquipment) {
        throw new ApiError(500 , "Something went wrong while registering a equipment!");
    }

    return res.status(200)
    .json(
        new ApiResponse( 200, rentedEquipment,  "Equipment registered successfully")
    );

}

// Update equipment details
module.exports.updateEquipmentDetails = async ( req , res )=> {
    const { equipmentData } = req.body ; 
    const { id } = req.params;

    let equipment = await Equipment.findById(id);

    if(!equipment) {
        throw new ApiError(404, "Equipment not found");
    }

    // remove images and video field from incoming update request
    delete equipmentData?.images;
    delete equipmentData?.video;

    if(!equipmentData || Object.keys(equipmentData).length === 0) {
        throw new ApiError(400, "No equipment update data is provided to proceed");
    }

    if( equipment.owner.toString() !== req.user?._id.toString() ) {
        throw new ApiError(403, "You are not authorized to update this equipment");
    }

    const updatedEquipment = await Equipment.findByIdAndUpdate(
        id,
        {
            ...equipmentData,
        },
        {
            new : true,
        }
    ).populate("owner", "displayName username email avatar");

    if(!updatedEquipment) {
        throw new ApiError(500, "Something went wrong while updating equipment details");
    }

    return res.status(200)
    .json(
        new ApiResponse( 200, updatedEquipment, "Equipment details updated successfully" )
    );
}

// Update images of an equipment
module.exports.updateEquipmentImage = async ( req , res )=> {
    const { id } = req.params;
    const { imageURLToDelete } = req.body;

    //  Find Equipment
    let equipment = await Equipment.findById(id);
    if (!equipment) {
        throw new ApiError(404, "Equipment not found");
    }

    //  Ensure the logged-in user is the owner
    if (equipment.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(403, "You are not authorized to update this equipment");
    }

    let imageLocalPath = req.file?.path;

    //  Ensure at least one operation (delete or upload) is provided
    if (!imageURLToDelete && !imageLocalPath) {
        throw new ApiError(400, "Please provide either an image to upload or an image URL to delete");
    }

    let updatedImages = [...equipment.images];

    //  Delete Old Image (If Requested)
    if (imageURLToDelete) {
        if (!equipment.images.includes(imageURLToDelete)) {
            throw new ApiError(400, "The image you are trying to delete does not exist in this equipment");
        }

        const deleteResponse = await removeFromCloudinary(imageURLToDelete);
        if (!deleteResponse.success) {
            throw new ApiError(500, "Failed to delete image from Cloudinary");
        }

        //  Remove from MongoDB array
         updatedImages = updatedImages.filter(img => img !== imageURLToDelete);
    }

    //  Check Image Upload Limit Before Uploading
    if (imageLocalPath) {
        if (updatedImages.length >= 5) {
            fs.unlinkSync(imageLocalPath); // Remove local file
            throw new ApiError(400, "Image upload limit exceeded (Max: 5 images)");
        }

        try {
            const uploadedImage = await uploadOnCloudinary(imageLocalPath);
            updatedImages.push(uploadedImage?.secure_url || "");
        } catch (error) {
            fs.unlinkSync(imageLocalPath); // Remove local file if upload fails
            throw new ApiError(500, "Failed to upload new image");
        }
    }

    //  Use `findByIdAndUpdate` to prevent race conditions
    const updatedEquipment = await Equipment.findByIdAndUpdate(
        id,
        { 
            $set : { images: updatedImages }
        },
        { new: true, runValidators: true }
    );

    return res.status(200).json(
        new ApiResponse(200, updatedEquipment, "Equipment image updated successfully")
    ); 
}

// Update preview video of an equipment
module.exports.updateEquipmentVideo = async ( req, res )=> {
    const { id } = req.params;
    const videoLocalPath = req.file?.path;
    const allowedMimeTypes = ["video/mp4", "video/avi", "video/mkv", "video/webm", "video/mov"];

    if (!videoLocalPath) {
        throw new ApiError(400, "Video file is missing");
    }

    //  Validate that the uploaded file is a video
    if (!allowedMimeTypes.includes(req.file.mimetype)) {
        fs.unlinkSync(videoLocalPath); // Delete invalid file
        throw new ApiError(400, "Invalid file type. Please upload a valid video format (MP4, AVI, MKV, WEBM, MOV)");
    }

    // Find Equipment
    const equipment = await Equipment.findById(id);
    if (!equipment) {
        throw new ApiError(404, "Equipment not found");
    }

    //  Ensure the logged-in user is the owner
    if (equipment.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(403, "You are not authorized to update this equipment");
    }

    //  Delete Existing Video (If Available)
    if (equipment.video) {
        const deleteResponse = await removeFromCloudinary(equipment.video);
        if (!deleteResponse.success) {
            throw new ApiError(500, "Failed to delete existing video from Cloudinary");
        }
    }

    //  Upload New Video to Cloudinary
    let uploadedVideo;
    try {
        uploadedVideo = await uploadOnCloudinary(videoLocalPath);
    } catch (error) {
        fs.unlinkSync(videoLocalPath); // Remove local file if upload fails
        throw new ApiError(500, "Error while uploading preview video, please try again");
    }

    //  Ensure upload was successful
    if (!uploadedVideo?.secure_url) {
        throw new ApiError(500, "Error while uploading preview video, please try again");
    }

    //  Update Equipment Video Field
    const updatedEquipment = await Equipment.findByIdAndUpdate(
        id,
        { 
            $set : { video: uploadedVideo.secure_url }
         },
        { new: true }
    ).populate("owner", "displayName username email avatar");

    if (!updatedEquipment) {
        throw new ApiError(500, "Something went wrong while updating preview video file");
    }

    return res.status(200).json(
        new ApiResponse(200, updatedEquipment, "Equipment preview video updated successfully")
    );
}

// Delete an equipment listing
module.exports.deleteEquipmentListing = async ( req , res )=> {
    const { id } = req.params ;
    
    // Find Equipment
    const equipment = await Equipment.findById(id);
    if (!equipment) {
        throw new ApiError(404, "Equipment not found");
    }

    //  Ensure the logged-in user is the owner
    if (equipment.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(403, "You are not authorized to update this equipment");
    }

    //  Delete Existing Images (If Available)
    if(equipment.images.length !== 0) {
        await Promise.all(equipment.images.map(imgToDelete => removeFromCloudinary(imgToDelete)));
    }

    //  Delete Existing Video (If Available)
    // if (equipment.video) {
    //     const deleteResponse = await removeFromCloudinary(equipment.video);
    //     if (!deleteResponse.success) {
    //         throw new ApiError(500, "Failed to delete existing video from Cloudinary");
    //     }
    // }

    const deletedEquipment = await Equipment.findByIdAndDelete(id);

    if(!deletedEquipment) {
        throw new ApiError(500, "Something went wrong while deleting equipment");
    }

    return res.status(200)
    .json(
        new ApiResponse(200, {}, `Equipment ( ${deletedEquipment.name} ) deleted successfully`)
    );

}

// Get equipment details by ID
module.exports.getOneEquipment = async ( req , res )=> {
    const { id } = req.params ; 

    // Find Equipment
    const equipment = await Equipment.findById(id).populate("owner", "displayName username email avatar");

    if(!equipment) {
        throw new ApiError(403, "Equipment you are trying to find does not exists or deleted");
    }

    return res.status(200)
    .json(
        new ApiResponse(200, equipment, "Equipment found successfully")
    );
}

// Get all equipment listings
module.exports.getAllEquipment = async ( req , res )=> {
    const { latitude, longitude, radius = 50, sortBy = "createdAt", order = "desc" } = req.query;

    let pipeline = [];

    //  If no location is provided, return all equipment
    if (!latitude || !longitude) {
        pipeline.push({ $sort: { createdAt: -1 } }); // Show latest equipment first
    } else {
        //  Find Equipment within 50 km 
        pipeline.push({
            $geoNear: {
                near: {
                    type: "Point",
                    coordinates: [parseFloat(longitude), parseFloat(latitude)]
                },
                distanceField: "distance", // Field to store distance from user
                spherical: true,
                maxDistance: radius * 1000 // Convert km to meters
            }
        });
    }

    //  Populate Owner Details
    pipeline.push({
        $lookup: {
            from: "users",
            localField: "owner",
            foreignField: "_id",
            as: "ownerDetails",
            pipeline : [
                {
                    $project : {
                        displayName : 1,
                        username : 1,
                        email : 1,
                        avatar : 1,
                    }
                }
            ]
        }
    });

    pipeline.push({
        $addFields: {
            owner: { $arrayElemAt: ["$ownerDetails", 0] }
        }
    });

    //  Sorting Logic (Apply only if sorting is requested)
    let sortOrder = order === "asc" ? 1 : -1;
    let sortField = {};

    if (sortBy === "price") {
        sortField["pricing.price"] = sortOrder;
    } else if (sortBy === "latest") {
        sortField["createdAt"] = sortOrder;
    } else if (sortBy === "availability") {
        sortField["availability"] = sortOrder;
    }

    if (Object.keys(sortField).length > 0) {
        pipeline.push({ $sort: sortField });
    }

    //  Remove unnecessary fields
    pipeline.push({
        $project: {
            ownerDetails: 0,
            __v: 0
        }
    });

    //  Execute Aggregation Pipeline
    const equipmentList = await Equipment.aggregate(pipeline);

    return res.status(200).json(
        new ApiResponse(200, equipmentList, `${equipmentList.length > 1 ? 'Equipments' : 'Equipment'} fetched successfully.`)
    );
}

