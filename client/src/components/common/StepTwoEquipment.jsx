import React from "react";
import { CheckboxSelectInput, SelectInput, TextInput } from "./FormComponents";

const cropsList = [
    "Wheat (ગહું, गेहूं)", "Rice (ચોખા, चावल)", "Maize (મકાઈ, मक्का)", "Barley (જૌ, जौ)", "Millets (બાજરી, बाजरा)",
    "Pulses (દાળ, दाल)", "Chickpeas (ચણા, चना)", "Lentils (મસૂર, मसूर)", "Pigeon Pea (તુવેર, अरहर)", "Green Gram (મગ, मूंग)",
    "Black Gram (ઉડદ, उड़द)", "Peas (મટર, मटर)", "Groundnut (ભૂટ્ટા, मूंगफली)", "Soybean (સોયાબીન, सोयाबीन)", "Mustard (સરસવ, सरसों)",
    "Sunflower (સૂર્યમુખી, सूरजमुखी)", "Castor (અરંડો, अरंडी)", "Sesame (તલ, तिल)", "Linseed (અળસી, अलसी)", "Safflower (કરસ, केसर)",
    "Cumin (જીરું, जीरा)", "Ajwain (અજમો, अजवाइन)", "Fennel (વરીયારી, सौंफ)", "Coriander (ધાણા, धनिया)", "Fenugreek (મેથી, मेथી)",
    "Turmeric (હળદર, हल्दी)", "Ginger (આદું, अदरक)", "Garlic (લસણ, लहसुन)", "Black Pepper (કાળી મરી, काली मिर्च)",
    "Cotton (કપાસ, कपास)", "Sugarcane (ગણ્ણો, गन्ना)", "Jute (જૂટ, जूट)", "Tea (ચા, चाय)", "Coffee (કોફી, कॉफी)",
    "Potato (બટેટા, आलू)", "Tomato (ટામેટાં, टमाटर)", "Onion (ડુંગળી, प्याज)", "Brinjal (રીંગણ, बैंगन)", "Carrot (ગાજર, गाजर)",
    "Cabbage (પટાગોબી, पत्तागोभी)", "Cauliflower (ફૂલકોબી, फूलगोभी)", "Green Chilli (લીલા મરચાં, हरी मिर्च)",
    "Fodder Crops (ચારા પાક, चारा फसल)", "Medicinal & Aromatic Plants (ઔષધિ અને સુગંધિત છોડ, औषधीय एवं सुगंधित पौधे)"
];

const StepTwoEquipment = ({ formData, handleChange, handleCropSelection }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextInput 
                label="Country" 
                value={formData.country} 
                onChange={handleChange} 
                name="country" 
                placeholder="Enter Country" 
                required 
            />
            <TextInput 
                label="State" 
                value={formData.state} 
                onChange={handleChange} 
                name="state" 
                placeholder="Enter State" 
                required 
            />
            <TextInput 
                label="District" 
                value={formData.district} 
                onChange={handleChange} 
                name="district" 
                placeholder="Enter District" 
                required 
            />
            <TextInput 
                label="Villages" 
                value={formData.villages} 
                onChange={handleChange} 
                name="villages" 
                placeholder="Enter Villages (comma-separated)" 
                required 
            />
            <div className="md:col-span-2">
                <TextInput 
                    label="Your Location" 
                    value={formData.currentLocation} 
                    onChange={handleChange} 
                    name="currentLocation" 
                    placeholder="Enter your current location" 
                    required 
                />
            </div>
            <div className="md:col-span-2">
                <CheckboxSelectInput
                    label="Used For Crops" 
                    value={formData.usedForCrops} 
                    onChange={handleCropSelection}
                    name="usedForCrops" 
                    options={cropsList}
                />
            </div>
        </div>
    );
};

export default StepTwoEquipment;
