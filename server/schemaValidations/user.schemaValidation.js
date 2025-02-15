const Joi = require("joi");

const userSchemaValidation = Joi.object({
    displayName: Joi.string().trim().required()
        .messages({ "any.required": "Display name is required" }),

    username: Joi.string().trim().lowercase().required()
        .messages({ "any.required": "Username is required" }),

    email: Joi.string().email().required()
        .messages({ 
            "string.email": "Invalid email format",
            "any.required": "Email is required" 
        }),

    avatar: Joi.string().uri().optional()
        .messages({ "string.uri": "Avatar must be a valid URL" }),

    coverImage: Joi.string().uri().optional()
        .messages({ "string.uri": "Cover image must be a valid URL" }),

    password: Joi.string().min(6).required()
        .messages({ 
            "string.base" : "Invalid phone number type. must be a type of string",
            "string.min": "Password should be at least 6 characters long",
            "any.required": "Password is required" 
        }),

    phone: Joi.string().pattern(/^\+?\d{10,15}$/).required()
        .messages({ 
            "string.pattern.base": "Phone number must be 10-15 digits and can start with +",
            "any.required": "Phone number is required" 
        }),

    role: Joi.string().valid("Farmer", "EquipmentOwner").required()
        .messages({ 
            "any.only": "Role must be either Farmer or EquipmentOwner",
            "any.required": "Role is required"
        }),

    rentalHistory: Joi.array().items(
        Joi.object({
            equipmentId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
                .messages({ "string.pattern.base": "Invalid Equipment ID format" }),

            rentedOn: Joi.date().optional(),
            rentalPeriod: Joi.string().optional(),
            returnDate: Joi.date().optional(),
            rentalStatus: Joi.string().valid("Active", "Completed", "Cancelled").default("Active"),
            pricePaid: Joi.number().optional(),
        })
    ).optional(),

    recentlyViewedEquipment: Joi.array().items(
        Joi.object({
            equipmentId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
                .messages({ "string.pattern.base": "Invalid Equipment ID format" }),

            viewedOn: Joi.date().optional(),
        })
    ).optional(),

    favorites: Joi.array().items(
        Joi.string().regex(/^[0-9a-fA-F]{24}$/)
            .messages({ "string.pattern.base": "Invalid Equipment ID format" })
    ).optional(),

    refreshToken: Joi.string().optional(),
})
.required()
.options({ abortEarly: false });

module.exports = userSchemaValidation ; 