const express = require("express");
const router = express.Router({ mergeParams : true });
const wrapAsync = require("../utils/wrapAsync.js");
const verifyJwt = require("../middlewares/auth.middleware.js");
const equipment = require("../controllers/equipment.controller.js");
const validateEquipmentSchema = require("../middlewares/equipment.middleware.js");
const upload = require("../middlewares/multer.middleware.js");

// post a equipment for rent
router.post(
    "/",
    verifyJwt,
    validateEquipmentSchema,
    upload.fields([
        { name : "images" , maxCount : 5 },
        { name : "video" , maxCount : 1 }
    ]),
    wrapAsync(equipment.rentEquipment),
);

// Update equipment details
router.put(
    "/:id",
    verifyJwt,
    validateEquipmentSchema,
    wrapAsync(equipment.updateEquipmentDetails),
);

// Update images of an equipment
router.put(
    "/:id/image",
    verifyJwt,
    upload.single("image"),
    wrapAsync(equipment.updateEquipmentImages),
);

// Update preview video of an equipment
router.put(
    "/:id/video",
    verifyJwt,
    wrapAsync(equipment.updateEquipmentVideo),
);

// Delete an equipment listing
router.delete(
    "/:id",
    verifyJwt,
    wrapAsync(equipment.deleteEquipmentListing),
);

// Get equipment details by ID
router.get(
    "/:id",
    verifyJwt,
    wrapAsync(equipment.getOneEquipment),
);

// Get all equipment listings
router.get(
    "/",
    verifyJwt,
    wrapAsync(equipment.getAllEquipment),
);

// Search for equipment by location & availability
router.get(
    "/search",
    verifyJwt,
    wrapAsync(equipment.searchEquipment),
);

module.exports = router ; 