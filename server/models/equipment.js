const mongoose = require("mongoose");
const mongooseAggrigatePaginate = require("mongoose-aggregate-paginate-v2");

const equipmentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
    },
    category: { 
        type: String,
        enum: [
            'Tractors & Power Equipment (ટ્રેક્ટર અને પાવર ઉપકરણો)',
            'Soil Preparation Equipment (જમીન તૈયારી સાધનો)',
            'Planting & Seeding Equipment (વાવણી અને બીજ રોપવાના સાધનો)',
            'Irrigation Equipment (સિંચાઈ સાધનો)',
            'Harvesting Equipment (કાપણી સાધનો)',
            'Post-Harvest & Processing Equipment (કાપણી પછી અને પ્રક્રિયા સાધનો)',
            'Other Agricultural Equipment (અન્ય કૃષિ સાધનો)',
        ],
        required: true,
    },
    type: {
        type: String,
        enum: [
            'Tractor (ટ્રેક્ટર)',
            'Power Tiller (પાવર ટિલર)',
            'Water Tanker (પાણીનો ટેન્કર)',
            'Plough (હળ)',
            'Seed Drill (બીજ ડ્રિલ)',
            'Cultivator (ખેતર ખેડવા માટેનું સાધન)',
            'Rotavator (રોટાવેટર)',
            'Harvester (કાપણી મશીન)',
            'Combine Harvester (કૉમ્બાઇન હાર્વેસ્ટર)',
            'Sprayer (સ્પ્રેયર)',
            'Weeder (વીડર)',
            'Irrigation Equipment (સિંચાઈ સાધનો)',
            'Chaff Cutter (ચાફ કટર)',
            'Thresher (થ્રેશર)',
            'Balers (બેલર્સ)',
            'Soil Testing Kit (માટી પરીક્ષણ કીટ)',
            'Post-Harvest Equipment (કાપણી પછીના સાધનો)',
        ],
        required: true,
    },
    model: {
        type: String,
        isLatestModel: {
            type: Boolean,
        }
    },
    year: {
        type: Number,
        min: 1900,
        max: new Date().getFullYear(),
    },
    condition: {
        type: String,
        enum: ['Excellent (ઉત્તમ)', 'Good (સારો)', 'Fair (મધ્યમ)', 'Poor (નબળો)'],
    },
    images: [
        {
            type: String,
        }
    ],
    video: {
        type: String,
    },
    pricing: [
        {
            unit: {
                type: String,
                enum: ['hour (કલાક)', 'day (દિવસ)', 'week (અઠવાડિયું)', 'quantity (જથ્થો)', 'other (અન્ય)'], 
                required: true,
            },
            price: {
                type: Number,
                min: 1,
                required: true,
            },
        }
    ],
    availability: {
        type: Boolean,
        default: true,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
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
            enum: ['Flat (સિદ્ધાંત)', 'Percentage (ટકાવારી)'],
            default: 'Flat (સિદ્ધાંત)',
        },
        validTill: {
            type: Date,
        },
        isActive: {
            type: Boolean,
            default: false,
        },
    },
    reviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review',
    }],
}, { timestamps: true });

equipmentSchema.plugin(mongooseAggrigatePaginate);

const Equipment = mongoose.model("Equipment", equipmentSchema);

module.exports = Equipment;
