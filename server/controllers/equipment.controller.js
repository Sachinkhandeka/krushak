const ApiError = require("../utils/apiError.js");
const ApiResponse = require("../utils/apiResponse.js");
const Equipment = require("../models/equipment.js");
const uploadOnCloudinary = require("../utils/cloudinary.js");

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
        });
    
        await equipment.save();
    } catch (error) {
        throw new ApiError(400, error.message);
    }
    
    const rentedEquipment = await Equipment.findById(equipment._id);

    if(!rentedEquipment) {
        throw new ApiError(500 , "Something went wrong while registering a equipment!");
    }

    return res.status(200)
    .json(
        new ApiResponse( 200, rentedEquipment,  "Equipment registered successfully")
    );

}

// Update equipment details
module.exports.updateEquipmentDetails = async ( req , res )=> {}

// Update images of an equipment
module.exports.updateEquipmentImages = async ( req , res )=> {}

// Update preview video of an equipment
module.exports.updateEquipmentVideo = async ( req, res )=> {}

// Delete an equipment listing
module.exports.deleteEquipmentListing = async ( req , res )=> {}

// Get equipment details by ID
module.exports.getOneEquipment = async ( req , res )=> {}

// Get all equipment listings
module.exports.getAllEquipment = async ( req , res )=> {}

// Search for equipment by location & availability
module.exports.searchEquipment = async ( req , res )=> {}
