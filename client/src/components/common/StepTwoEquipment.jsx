import React from "react";
import { CheckboxSelectInput, TextInput } from "./FormComponents";

const cropsList = [
    //  Spices & Condiments
    "Cumin (જીરું, जीरा)", "Ajwain (અજમો, अजवाइन)", "Fennel (વરીયારી, सौंफ)", "Coriander (ધાણા, धनिया)", "Fenugreek (મેથી, मेथी)",
    "Garden Cress Seeds (અસાળિયો,हलीम)",
    //  Cereal Crops
    "Wheat (ગહું, गेहूं)",  "Millets (બાજરી, बाजरा)", 
    //  Pulses
    "Pulses (દાળ, दाल)", "Chickpeas (ચણા, चना)", "Pigeon Pea (તુવેર, अरहर)", "Green Gram (મગ, मूंग)",  
    //  Oilseeds
    "Groundnut (ભૂટ્ટા, मूंगफली)", "Soybean (સોયાબીન, सोयाबीन)", "Mustard (રાયડો, सरसों)", 
    "Castor (અરંડો, अरंडी)", "Sesame (તલ, तिल)", "Linseed (અળસી, अलसी)"
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
