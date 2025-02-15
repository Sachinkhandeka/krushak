const userSchemaValidation = require("../schemaValidations/user.schemaValidation.js");
const ApiError = require("../utils/apiError.js");

const validateUserSchema = (req, res, next) => {
    try {
        const { userData } = req.body;

        if (!userData) {
            return next(new ApiError(400, "Please provide user data to proceed."));
        }

        const { error } = userSchemaValidation.validate(userData);
        
        if (error) {
            // Directly access error.details (fixing the isJoi issue)
            let errMsg = error.details.map(el => el.message).join(", ");

            return next(new ApiError(406, errMsg));
        }

        next();
    } catch (err) {
        return next(new ApiError(500, "Internal Server Error!"));
    }
};

module.exports = validateUserSchema ; 