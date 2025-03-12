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
    wrapAsync(equipment.updateEquipmentDetails),
);

// Update images of an equipment
router.put(
    "/:id/image",
    verifyJwt,
    upload.array("images", 5),
    wrapAsync(equipment.updateEquipmentImage),
);

// Update preview video of an equipment
router.put(
    "/:id/video",
    verifyJwt,
    upload.single("video"),
    wrapAsync(equipment.updateEquipmentVideo),
);

// Delete an equipment image
router.put(
    "/:id/delete",
    verifyJwt,
    wrapAsync(equipment.deleteEquipmentImage),
);

// Delete an equipment listing
router.delete(
    "/:id",
    verifyJwt,
    wrapAsync(equipment.deleteEquipmentListing),
);

// filter all equipment listings by crop
router.get(
    "/filter",
    wrapAsync(equipment.filterEquipment),
);

// Get equipment details by ID
router.get(
    "/:id",
    wrapAsync(equipment.getOneEquipment),
);

// get owner Equipments
router.get(
    "/owner/equipments",
    verifyJwt,
    wrapAsync(equipment.getOwnerEquipments),
);

// Get all equipment listings
router.get(
    "/",
    wrapAsync(equipment.getAllEquipment),
);


module.exports = router ; 