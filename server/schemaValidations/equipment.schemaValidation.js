const Joi = require("joi");

const equipmentSchemaValidation = Joi.object({})
.required()
.options({ abortEarly : false });

module.exports = equipmentSchemaValidation ; 