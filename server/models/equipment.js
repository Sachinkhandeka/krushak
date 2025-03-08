const { required } = require("joi");
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
        modelType : { type: String },
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
                required : true
            },
            villages: {
                type: [String],
                required : true,
            },
        },
    ],
    currentLocation : {
        type : String,
        required : true,
    },
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point',
            required: true
        },
        coordinates: {
            type: [Number],
            required: true,
            validate: {
                validator: function (coords) {
                    return coords.length === 2;
                },
            message: "Coordinates must be an array of [longitude, latitude]."
            }
        }
    },
    usedForCrops: [{
        type: String,
        enum: [
            //  Cereal Crops
            "Wheat (ગહું, गेहूं)", "Rice (ચોખા, चावल)", "Maize (મકાઈ, मक्का)", "Barley (જૌ, जौ)", "Millets (બાજરી, बाजरा)", 
            
            //  Pulses
            "Pulses (દાળ, दाल)", "Chickpeas (ચણા, चना)", "Lentils (મસૂર, मसूर)", "Pigeon Pea (તુવેર, अरहर)", "Green Gram (મગ, मूंग)", 
            "Black Gram (ઉડદ, उड़द)", "Peas (મટર, मटर)", 
            
            //  Oilseeds
            "Groundnut (ભૂટ્ટા, मूंगफली)", "Soybean (સોયાબીન, सोयाबीन)", "Mustard (સરસવ, सरसों)", "Sunflower (સૂર્યમુખી, सूरजमुखी)", 
            "Castor (અરંડો, अरंडी)", "Sesame (તલ, तिल)", "Linseed (અળસી, अलसी)", "Safflower (કરસ, केसर)", 
    
            //  Spices & Condiments
            "Cumin (જીરું, जीरा)", "Ajwain (અજમો, अजवाइन)", "Fennel (વરીયારી, सौंफ)", "Coriander (ધાણા, धनिया)", "Fenugreek (મેથી, मेथी)", 
            "Turmeric (હળદર, हल्दी)", "Ginger (આદું, अदरक)", "Garlic (લસણ, लहसुन)", "Black Pepper (કાળી મરી, काली मिर्च)", 
    
            //  Cash Crops
            "Cotton (કપાસ, कपास)", "Sugarcane (ગણ્ણો, गन्ना)", "Jute (જૂટ, जूट)", "Tea (ચા, चाय)", "Coffee (કોફી, कॉफी)", 
    
            //  Vegetables
            "Potato (બટેટા, आलू)", "Tomato (ટામેટાં, टमाटर)", "Onion (ડુંગળી, प्याज)", "Brinjal (રીંગણ, बैंगन)", "Carrot (ગાજર, गाजर)", 
            "Cabbage (પટાગોબી, पत्तागोभी)", "Cauliflower (ફૂલકોબી, फूलगोभी)", "Green Chilli (લીલા મરચાં, हरी मिर्च)", 
    
            //  Other Crops
            "Fodder Crops (ચારા પાક, चारा फसल)", "Medicinal & Aromatic Plants (ઔષધિ અને સુગંધિત છોડ, औषधीय एवं सुगंधित पौधे)"
        ]
    }],
}, { timestamps: true });

equipmentSchema.plugin(mongooseAggrigatePaginate);

const Equipment = mongoose.model("Equipment", equipmentSchema);

module.exports = Equipment;
