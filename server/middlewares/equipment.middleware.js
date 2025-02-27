const equipmentSchemaValidation = require("../schemaValidations/equipment.schemaValidation.js");
const ApiError = require("../utils/apiError.js");

const validateEquipmentSchema = ( req, res, next )=> {
    try {
        const { equipmentData } = req.body;

        if (!equipmentData) {
            return next(new ApiError(400, "Please provide equipment data to proceed."));
        }

        const { error } = equipmentSchemaValidation.validate(equipmentData);
        
        if (error) {
            // Directly access error.details
            let errMsg = error.details.map(el => el.message).join(", ");

            return next(new ApiError(406, errMsg));
        }

        next();
    } catch (err) {
        return next(new ApiError(500, "Internal Server Error!"));
    }
}
module.exports = validateEquipmentSchema ; 