import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { EQUIPMENT_TYPES } from "../../../constants/equipmentOptions";
import { FaCheckCircle } from "react-icons/fa"; 

const FilterType = ({ setAppliedFiltersCount }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [selectedType, setSelectedType] = useState("");

    //  Load selected type from URL on mount
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const typeFromURL = params.get("type") || "";
        setSelectedType(typeFromURL);
        setAppliedFiltersCount(typeFromURL ? 1 : 0);
    }, [location.search]);

    //  Handle type selection (Only one at a time)
    const handleTypeChange = (type) => {
        let updatedType = type === selectedType ? "" : type; // Toggle selection

        setSelectedType(updatedType);
        setAppliedFiltersCount(updatedType ? 1 : 0);

        //  Update URL (No backend call here)
        const params = new URLSearchParams(location.search);
        if (updatedType) {
            params.set("type", updatedType);
        } else {
            params.delete("type");
        }
        navigate({ search: params.toString() }, { replace: true });
    };

    return (
        <div className="p-4 w-full bg-white dark:bg-gray-800 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3">
                Filter by Equipment Type
            </h3>

            {/*  Horizontally Scrollable Equipment Type List */}
            <div className="flex space-x-2 overflow-x-auto scroll-hidden p-1">
                {EQUIPMENT_TYPES.map((type) => (
                    <button
                        key={type}
                        className={`flex items-center cursor-pointer space-x-2 px-4 py-2 border rounded-lg transition whitespace-nowrap
                            ${
                                selectedType === type
                                    ? "bg-green-600 text-white border-green-600"
                                    : "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-white border-gray-300 dark:border-gray-600"
                            }
                        `}
                        onClick={() => handleTypeChange(type)}
                    >
                        {selectedType === type && <FaCheckCircle className="text-white" />}
                        <span>{type}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default FilterType;
