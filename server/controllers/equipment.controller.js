const ApiError = require("../utils/apiError.js");
const ApiResponse = require("../utils/apiResponse.js");
const Equipment = require("../models/equipment.js");

// post a equipment for rent
module.exports.rentEquipment = async( req , res )=> {

    console.log("basic setup");
    return res.status(200)
    .json(
        new ApiResponse(
            200,
            {},
            "Basic setup successful"
        )
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
