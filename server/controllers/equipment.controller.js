const ApiError = require("../utils/apiError.js");
const ApiResponse = require("../utils/apiResponse.js");
const Equipment = require("../models/equipment.js");
const { uploadOnCloudinary, removeFromCloudinary } = require("../utils/cloudinary.js");
const fs = require("fs");
const User = require("../models/user.js");

const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const { updateEquipmentSchema } = require("../schemaValidations/equipment.schemaValidation.js");
const geocodingClient = mbxGeocoding({ accessToken: process.env.MAPBOX_TOKEN });

// post a equipment for rent
module.exports.rentEquipment = async( req , res )=> {
    const { equipmentData } = req.body ; 
    let imagesLocalPath = [];

    const response = await geocodingClient.forwardGeocode({
        query: equipmentData.currentLocation,
        limit: 1
    }).send();

    const geometry = response.body.features[0].geometry ; 
    const userId = req.user?._id; 

    const user = await User.findByIdAndUpdate(
        userId,
        {
            $set: { role: "EquipmentOwner" },
        }
    );

    if(!user) {
        throw new ApiError(401, "Unauthorized user request");
    }

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
            currentLocation : equipmentData.currentLocation,
            geometry : geometry,
            owner : user._id,
            availabilityArea : equipmentData.availabilityArea,
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
module.exports.updateEquipmentDetails = async (req, res) => {
    const { equipmentData } = req.body;
    const { id } = req.params;

    let equipment = await Equipment.findById(id);
    if (!equipment) {
        throw new ApiError(404, "Equipment not found");
    }

    if (equipment.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(403, "You are not authorized to update this equipment");
    }

    // Remove restricted fields from update request
    delete equipmentData?.images;
    delete equipmentData?.video;

    if (!equipmentData || Object.keys(equipmentData).length === 0) {
        throw new ApiError(400, "No equipment update data is provided to proceed");
    }

    // Validate request data
    const { error, value } = updateEquipmentSchema.validate(equipmentData, { stripUnknown: true });
    if (error) {
        throw new ApiError(400, error.details.map((err) => err.message).join(", "));
    }

    // If `currentLocation` is updated, fetch new coordinates
    if (equipmentData.currentLocation && equipmentData.currentLocation !== equipment.currentLocation) {
        try {
            const response = await geocodingClient
                .forwardGeocode({
                    query: equipmentData.currentLocation,
                    limit: 1,
                })
                .send();

            if (!response.body.features.length) {
                throw new ApiError(400, "Invalid location provided.");
            }

            // Update both `currentLocation` and `geometry`
            value.geometry = response.body.features[0].geometry;
        } catch (error) {
            throw new ApiError(500, "Failed to fetch coordinates for the updated location.");
        }
    }

    const updatedEquipment = await Equipment.findByIdAndUpdate(id, value, {
        new: true,
        runValidators: false,
    }).populate("owner", "displayName username email avatar");

    if (!updatedEquipment) {
        throw new ApiError(500, "Something went wrong while updating equipment details");
    }

    return res.status(200).json(new ApiResponse(200, updatedEquipment, "Equipment details updated successfully"));
};


//update equipment images
module.exports.updateEquipmentImage = async (req, res) => {
    const { id } = req.params;
    const { imagesToDelete } = req.body; 
    let imageLocalPaths = req.files?.map(file => file.path) || []; 

    // Find Equipment
    let equipment = await Equipment.findById(id);
    if (!equipment) {
        throw new ApiError(404, "Equipment not found");
    }

    // Ensure the logged-in user is the owner
    if (equipment.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(403, "You are not authorized to update this equipment");
    }

    let updatedImages = [...equipment.images];

    // Delete Old Images (If Requested)
    if (imagesToDelete && Array.isArray(imagesToDelete)) {
        for (let imageURL of imagesToDelete) {
            if (!updatedImages.includes(imageURL)) {
                throw new ApiError(400, `Image ${imageURL} does not exist in this equipment`);
            }

            const deleteResponse = await removeFromCloudinary(imageURL);
            if (!deleteResponse.success) {
                throw new ApiError(500, `Failed to delete image ${imageURL} from Cloudinary`);
            }

            // Remove from MongoDB array
            updatedImages = updatedImages.filter(img => img !== imageURL);
        }
    }

    // Check Image Upload Limit Before Uploading New Images
    if (imageLocalPaths.length > 0) {
        const availableSlots = 5 - updatedImages.length; // Maximum limit of 5 images
        if (imageLocalPaths.length > availableSlots) {
            // Remove local files if exceeding limit
            imageLocalPaths.forEach(path => fs.unlinkSync(path));
            throw new ApiError(400, `You can only upload ${availableSlots} more image(s). Maximum limit: 5 images.`);
        }

        try {
            // Upload images to Cloudinary
            for (let localPath of imageLocalPaths) {
                const uploadedImage = await uploadOnCloudinary(localPath);
                if (uploadedImage?.secure_url) {
                    updatedImages.push(uploadedImage.secure_url);
                }
            }
        } catch (error) {
            // Cleanup local files if upload fails
            imageLocalPaths.forEach(path => fs.unlinkSync(path));
            throw new ApiError(500, "Failed to upload images");
        }
    }

    // Update the Equipment Images in MongoDB
    const updatedEquipment = await Equipment.findByIdAndUpdate(
        id,
        { $set: { images: updatedImages } },
        { new: true, runValidators: true }
    );

    return res.status(200).json(
        new ApiResponse(200, updatedEquipment, "Equipment images updated successfully")
    );
};


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

//delete equipment images
module.exports.deleteEquipmentImage = async (req, res) => {
    const { id } = req.params; 
    const { imageURL } = req.body; 

    if (!imageURL) {
        throw new ApiError(400, "Image URL is required");
    }

    // Find Equipment
    const equipment = await Equipment.findById(id);
    if (!equipment) {
        throw new ApiError(404, "Equipment not found");
    }

    // Ensure the logged-in user is the owner
    if (equipment.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(403, "You are not authorized to delete this image");
    }

    // Check if the image exists in the equipment
    if (!equipment.images.includes(imageURL)) {
        throw new ApiError(400, "This image does not exist in the equipment");
    }

    // Remove Image from Cloudinary
    const deleteResponse = await removeFromCloudinary(imageURL);
    if (!deleteResponse.success) {
        throw new ApiError(500, `Failed to delete image from Cloudinary`);
    }

    // Remove image from MongoDB array
    const updatedImages = equipment.images.filter(img => img !== imageURL);

    // Update the Equipment Images in MongoDB
    const updatedEquipment = await Equipment.findByIdAndUpdate(
        id,
        { $set: { images: updatedImages } },
        { new: true, runValidators: true }
    );

    return res.status(200).json(
        new ApiResponse(200, updatedEquipment, "Image deleted successfully")
    );
};

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

// owner Equipments
module.exports.getOwnerEquipments = async ( req , res )=> {
    const userId = req.user?._id;

    //  Fetch equipment where the owner matches the logged-in user
    const ownerEquipments = await Equipment.find({ owner: userId }).populate("owner", "displayName username email avatar");

    if (ownerEquipments.length === 0) {
        return res.status(404).json(new ApiResponse(404, [], "You have not listed any equipment yet."));
    }

    return res.status(200).json(new ApiResponse(200, ownerEquipments, "Owner's equipment fetched successfully."));
}

// Get all equipment listings
module.exports.getAllEquipment = async (req, res) => {
    const { location, radius = 50, sortBy = "createdAt", order = "desc" } = req.query;

    let longitude, latitude;
    if (location) {
        const response = await geocodingClient.forwardGeocode({
            query: location,
            limit: 1
        }).send();

        if (response.body.features.length > 0) {
            [longitude, latitude] = response.body.features[0].geometry.coordinates;
        }
    }

    let pipeline = [];

    if (!latitude || !longitude) {
        pipeline.push({ $sort: { createdAt: -1 } });
    } else {
        pipeline.push({
            $geoNear: {
                near: { type: "Point", coordinates: [longitude, latitude] },
                distanceField: "distance",
                spherical: true,
                maxDistance: radius * 1000
            }
        });
    }

    pipeline.push({
        $lookup: {
            from: "users",
            localField: "owner",
            foreignField: "_id",
            as: "ownerDetails",
            pipeline: [{ $project: { displayName: 1, avatar: 1 } }]
        }
    });

    pipeline.push({ $addFields: { owner: { $arrayElemAt: ["$ownerDetails", 0] } } });

    let sortOrder = order === "asc" ? 1 : -1;
    let sortField = {};
    if (sortBy === "price") sortField["pricing.price"] = sortOrder;
    else if (sortBy === "latest") sortField["createdAt"] = sortOrder;
    else if (sortBy === "availability") sortField["availability"] = sortOrder;
    if (Object.keys(sortField).length > 0) {
        pipeline.push({ $sort: sortField });
    }

    pipeline.push({
        $project: {
            _id: 1,
            name: 1,
            description: 1,
            category: 1,
            type: 1,
            model : 1,
            year: 1,
            condition: 1,
            images: 1,
            video: 1,
            pricing: 1,
            availability: 1,
            availabilityArea: 1,
            currentLocation: 1,
            usedForCrops: 1,
            createdAt: 1,
            updatedAt: 1,
            owner: 1,
            coordinates: "$geometry.coordinates"
        }
    });

    const equipmentList = await Equipment.aggregate(pipeline);

    // ✅ Construct the map-related data
    const mapData = {
        userSearchedLocation: location ? { location, coordinates: [longitude, latitude] } : null,
        nearByEquipments: equipmentList.map(equipment => ({
            id: equipment._id,
            coordinates: equipment.coordinates,
            label: equipment.name,
            ownerAvatar: equipment.owner?.avatar || null,
            ownerName: equipment.owner?.displayName || "Unknown"
        }))
    };

    return res.status(200).json(
        new ApiResponse(
            200, 
            { equipments: equipmentList, mapData }, 
            "Equipments fetched successfully."
        )
    );
};


