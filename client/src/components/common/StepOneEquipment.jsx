import React from 'react'
import { SelectInput, TextInput } from './FormComponents';
import { EQUIPMENT_CATEGORIES, EQUIPMENT_TYPES, EQUIPMENT_CONDITIONS } from "../../constants/equipmentOptions";

const availabilityOptions = ["Available", "Not Available"];
const latestModelOptions = ["Yes", "No"];

const StepOneEquipment = ({ formData, handleChange }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextInput 
                label="Equipment Name" 
                value={formData.name} 
                onChange={handleChange} 
                name="name" 
                placeholder="Enter Equipment Name" 
                required 
            />
            <TextInput 
                label="Description" 
                value={formData.description} 
                onChange={handleChange} 
                name="description" 
                placeholder="Enter Description" 
                required 
            />
            <TextInput 
                label="Model Type" 
                value={formData.modelType} 
                onChange={handleChange} 
                name="modelType" 
                placeholder="Enter Model Type" 
                required 
            />
            <TextInput 
                label="Manufacturing Year" 
                value={formData.year} 
                onChange={handleChange} 
                name="year" 
                placeholder="Enter Year" 
                required 
            />
            <SelectInput 
                label="Latest Model" 
                value={formData.isLatest} 
                onChange={handleChange} 
                name="isLatestModel" 
                options={latestModelOptions} 
                required 
            />
            <SelectInput 
                label="Type" 
                value={formData.type} 
                onChange={handleChange} 
                name="type" 
                options={EQUIPMENT_TYPES} 
                required 
            />
            <SelectInput 
                label="Category" 
                value={formData.category} 
                onChange={handleChange} 
                name="category" 
                options={EQUIPMENT_CATEGORIES} 
                required 
            />
            <SelectInput 
                label="Condition" 
                value={formData.condition} 
                onChange={handleChange} 
                name="condition" 
                options={EQUIPMENT_CONDITIONS} 
                required 
            />
            <SelectInput 
                label="Availability" 
                value={formData.availability} 
                onChange={handleChange} 
                name="availability" 
                options={availabilityOptions} 
                required 
            />
        </div>
    );
}

export default StepOneEquipment