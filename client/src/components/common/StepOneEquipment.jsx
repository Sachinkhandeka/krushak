import React from 'react'
import { SelectInput, TextInput } from './FormComponents';

const categories = [
    'Tractors & Power Equipment (ટ્રેક્ટર અને પાવર ઉપકરણો)',
    'Soil Preparation Equipment (જમીન તૈયારી સાધનો)',
    'Planting & Seeding Equipment (વાવણી અને બીજ રોપવાના સાધનો)',
    'Irrigation Equipment (સિંચાઈ સાધનો)',
    'Harvesting Equipment (કાપણી સાધનો)',
    'Post-Harvest & Processing Equipment (કાપણી પછી અને પ્રક્રિયા સાધનો)',
    'Other Agricultural Equipment (અન્ય કૃષિ સાધનો)'
];
const type = [
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
    'Post-Harvest Equipment (કાપણી પછીના સાધનો)'
];
const conditions = ['Excellent (ઉત્તમ)', 'Good (સારો)', 'Fair (મધ્યમ)', 'Poor (નબળો)'];
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
                options={type} 
                required 
            />
            <SelectInput 
                label="Category" 
                value={formData.category} 
                onChange={handleChange} 
                name="category" 
                options={categories} 
                required 
            />
            <SelectInput 
                label="Condition" 
                value={formData.condition} 
                onChange={handleChange} 
                name="condition" 
                options={conditions} 
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