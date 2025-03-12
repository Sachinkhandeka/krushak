import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { EQUIPMENT_CONDITIONS } from "../../../constants/equipmentOptions";

const FilterCondition = ({ setAppliedFiltersCount }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [selectedCondition, setSelectedCondition] = useState("");

    // Load selected condition from URL
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const conditionFromURL = params.get("condition") || "";
        setSelectedCondition(conditionFromURL);
        setAppliedFiltersCount(conditionFromURL ? 1 : 0);
    }, [location.search]);

    // Handle condition selection
    const handleConditionSelect = (condition) => {
        const params = new URLSearchParams(location.search);

        if (selectedCondition === condition) {
            // Deselect if already selected
            setSelectedCondition("");
            params.delete("condition");
            setAppliedFiltersCount(0);
        } else {
            // Select new condition
            setSelectedCondition(condition);
            params.set("condition", condition);
            setAppliedFiltersCount(1);
        }

        navigate({ search: params.toString() }, { replace: true });
    };

    return (
        <div className="p-4 w-full bg-white dark:bg-gray-800 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3">
                Filter by Condition
            </h3>

            {/* Horizontal Scrollable List */}
            <div className="flex space-x-2 overflow-x-auto scroll-hidden">
                {EQUIPMENT_CONDITIONS.map((condition) => (
                    <button
                        key={condition}
                        onClick={() => handleConditionSelect(condition)}
                        className={`px-4 py-2 cursor-pointer rounded-full text-sm font-medium transition border ${
                            selectedCondition === condition
                                ? "bg-green-600 text-white border-green-600"
                                : "border-gray-300 text-gray-700 dark:border-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        }`}
                    >
                        {condition}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default FilterCondition;
