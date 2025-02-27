const Joi = require("joi");

const equipmentSchemaValidation = Joi.object({
    name: Joi.string().trim().required().messages({
        "any.required": "Equipment name is required",
        "string.empty": "Equipment name cannot be empty",
    }),

    description: Joi.string().required().messages({
        "any.required": "Description is required",
        "string.empty": "Description cannot be empty",
    }),

    category: Joi.string().valid(
        "Tractors & Power Equipment (ટ્રેક્ટર અને પાવર ઉપકરણો)",
        "Soil Preparation Equipment (જમીન તૈયારી સાધનો)",
        "Planting & Seeding Equipment (વાવણી અને બીજ રોપવાના સાધનો)",
        "Irrigation Equipment (સિંચાઈ સાધનો)",
        "Harvesting Equipment (કાપણી સાધનો)",
        "Post-Harvest & Processing Equipment (કાપણી પછી અને પ્રક્રિયા સાધનો)",
        "Other Agricultural Equipment (અન્ય કૃષિ સાધનો)"
    ).required().messages({
        "any.required": "Category is required",
        "any.only": "Invalid category selected",
    }),

    type: Joi.string().valid(
        "Tractor (ટ્રેક્ટર)",
        "Power Tiller (પાવર ટિલર)",
        "Water Tanker (પાણીનો ટેન્કર)",
        "Plough (હળ)",
        "Seed Drill (બીજ ડ્રિલ)",
        "Cultivator (ખેતર ખેડવા માટેનું સાધન)",
        "Rotavator (રોટાવેટર)",
        "Harvester (કાપણી મશીન)",
        "Combine Harvester (કૉમ્બાઇન હાર્વેસ્ટર)",
        "Sprayer (સ્પ્રેયર)",
        "Weeder (વીડર)",
        "Irrigation Equipment (સિંચાઈ સાધનો)",
        "Chaff Cutter (ચાફ કટર)",
        "Thresher (થ્રેશર)",
        "Balers (બેલર્સ)",
        "Soil Testing Kit (માટી પરીક્ષણ કીટ)",
        "Post-Harvest Equipment (કાપણી પછીના સાધનો)"
    ).required().messages({
        "any.required": "Equipment type is required",
        "any.only": "Invalid equipment type selected",
    }),

    model: Joi.object({
        modelType: Joi.string().trim().optional(),
        isLatestModel: Joi.boolean().optional().default(false)
    }).optional(),

    year: Joi.number().integer().min(1900).max(new Date().getFullYear()).optional().messages({
        "number.min": "Year must be after 1900",
        "number.max": `Year cannot be greater than ${new Date().getFullYear()}`,
    }),

    condition: Joi.string().valid("Excellent (ઉત્તમ)", "Good (સારો)", "Fair (મધ્યમ)", "Poor (નબળો)").optional(),

    images: Joi.array().items(Joi.string().uri()).optional().messages({
        "array.base": "Images must be an array of URLs",
        "string.uri": "Each image must be a valid URL",
    }),

    video: Joi.string().uri().optional().messages({
        "string.uri": "Video must be a valid URL",
    }),

    pricing: Joi.array().items(
        Joi.object({
            unit: Joi.string().valid("hour (કલાક)", "day (દિવસ)", "week (અઠવાડિયું)", "quantity (જથ્થો)", "other (અન્ય)").required(),
            price: Joi.number().min(1).required().messages({
                "number.min": "Price must be at least 1",
            }),
        })
    ).min(1).required().messages({
        "any.required": "At least one pricing option is required",
        "array.min": "At least one pricing entry is required",
    }),

    availability: Joi.boolean().default(true),


    availabilityArea: Joi.array().items(
        Joi.object({
            country: Joi.string().required(),
            state: Joi.string().required(),
            district: Joi.string().optional(),
            village: Joi.string().optional(),
            coordinates: Joi.array().length(2).items(Joi.number()).required().messages({
                "array.length": "Coordinates must have exactly 2 values [longitude, latitude]",
                "number.base": "Coordinates must be numbers",
            }),
        })
    ).required().messages({
        "any.required": "At least one availability area is required",
    }),

    discount: Joi.object({
        amount: Joi.number().min(0).default(0),
        type: Joi.string().valid("Flat (સિદ્ધાંત)", "Percentage (ટકાવારી)").default("Flat (સિદ્ધાંત)"),
        validTill: Joi.date().optional(),
        isActive: Joi.boolean().default(false),
    }).optional(),

})
.required()
.options({ abortEarly: false });

module.exports = equipmentSchemaValidation;
