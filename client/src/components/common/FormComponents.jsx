import React from "react";

export const TextInput = ({ label, value, onChange, name, placeholder, required = false }) => (
    <div className="mb-4 w-full flex-1">
        <label className="block font-medium mb-2 text-gray-700 dark:text-gray-300">
            {label}{required && <span className="text-red-500">*</span>}
        </label>
        <input 
            type="text" 
            value={value} 
            onChange={onChange} 
            placeholder={placeholder} 
            name={name}
            className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-black dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:outline-none transition"
            required={required}
        />
    </div>
);

export const SelectInput = ({ label, value, onChange, name, options, required = false }) => {
    return (
        <div className="mb-4 w-full flex-1">
            <label className="block font-medium mb-2 text-gray-700 dark:text-gray-300">
                {label}{required && <span className="text-red-500">*</span>}
            </label>
            <select
                value={value}
                onChange={onChange}
                name={name}
                className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-black dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:outline-none transition"
                required={required}
            >
                <option value="" disabled>Select {label}</option>
                {options.map((option, index) => (
                    <option key={index} value={option}>{option}</option>
                ))}
            </select>
        </div>
    );
};

export const CheckboxSelectInput = ({ label, value, onChange, name, options }) => {
    // Ensure value is always an array
    const selectedValues = Array.isArray(value) ? value : [];

    const handleCheckboxChange = (option) => {
        let updatedValues = selectedValues.includes(option)
            ? selectedValues.filter((item) => item !== option) // Remove if already selected
            : [...selectedValues, option]; // Add if not selected

        // Instead of passing just updatedValues, pass an object with the correct key
        onChange(name, updatedValues);
    };

    return (
        <div className="mb-4 w-full">
            <label className="block font-medium mb-2 text-gray-700 dark:text-gray-300">
                {label}
            </label>
            <div className="flex flex-wrap gap-2">
                {options.map((option, index) => (
                    <label
                        key={index}
                        className={`cursor-pointer px-4 py-2 border rounded-lg transition ${
                            selectedValues.includes(option)
                                ? "bg-green-500 text-white border-green-500"
                                : "bg-gray-200 text-black dark:bg-gray-700 dark:text-white"
                        }`}
                    >
                        <input
                            type="checkbox"
                            value={option}
                            checked={selectedValues.includes(option)}
                            onChange={() => handleCheckboxChange(option)}
                            name={name}
                            className="hidden"
                        />
                        {option}
                    </label>
                ))}
            </div>
        </div>
    );
};
