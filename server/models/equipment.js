const mongoose = require("mongoose");
const mongooseAggrigatePaginate = require("mongoose-aggregate-paginate-v2");

const equipmentSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
        trim : true,
    },
    description : {
        type : String,
        required : true,
    },
    type : {
        type : String,
        enum : [
            'Tractor',
            'Water Tanker',
            'Plough',
            'Seed Drill',
            'Cultivator',
            'Rotavator',
            'Harvester',
            'Sprayer',
            'Weeder',
            'Irrigation Equipment',
            'Chaff Cutter',
            'Thresher',
            'Balers',
            'Power Tiller',
            'Combine Harvester',
            'Soil Testing Kit',
            'Post-Harvest Equipment',
            'Greenhouse Equipment',
            'Water Pumps',
            'Milking Machine',
            'Grain Storage Bin',
            'Crop Protection Drones',
            'Seed Treatment Machine',
            'Transplanter',
            'Precision Farming Tools',
            'Fertilizer Spreader',
            'Crop Monitoring Sensors',
            'Bio-Mechanical Pest Control Tools'
        ],
        required : true,
    },
    model : {
        type : String,
        isLatestModel : {
            type : Boolean,
        }
    },
    year : {
        type : Number,
        min : 1900,
        max : new Date().getFullYear(),
    },
    condition : {
        type : String,
        enum : ['Excellent', 'Good', 'Fair', 'Poor'],
    },
    images : [
        {
            type : String,
        }
    ],
    video : {
        type : String,
    },
    pricing : [
        {
            unit: {
                type: String,
                enum: ['hour', 'day', 'week', 'quantity', 'other'], 
                required: true,
            },
            price: {
                type: Number,
                min: 1,
                required: true,
            },
        }
    ],
    availability : {
        type : Boolean,
        default : true,
    },
    owner : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true,
    },
    availabilityArea: [
        {
            country: {
                type: String,
                required: true,
            },
            state: {
                type: String,
                required: true,
            },
            district: {
                type: String,
            },
            village: {
                type: String,
            },
            coordinates: {
                type: [Number], // [longitude, latitude]
                index: '2dsphere',
                required: true,
            },
        },
    ],
    discount: {
        amount: {
            type: Number,
            min: 0,
            default: 0,
        },
        type: {
            type: String,
            enum: ['Flat', 'Percentage'],
            default: 'Flat',
        },
        validTill: {
            type: Date,
        },
        isActive: {
            type: Boolean,
            default: false,
        },
    },
    reviews : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Review',
    }],
},{ timestamps : true });

equipmentSchema.plugin(mongooseAggrigatePaginate);

const Equipment = mongoose.model("Equipment", equipmentSchema);

module.exports = Equipment ; 