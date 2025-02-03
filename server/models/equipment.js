const { required } = require("joi");
const mongoose = require("mongoose");

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
    pricePerHour : {
        type : Number,
        min : 1,
    },
    pricePerDay : {
        type : Number,
        min : 1,
    },
    pricePerWeek : {
        type : Number,
        min : 1
    },
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

const Equipment = mongoose.model("Equipment", equipmentSchema);

module.exports = Equipment ; 