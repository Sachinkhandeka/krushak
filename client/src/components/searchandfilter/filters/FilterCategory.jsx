import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { EQUIPMENT_CATEGORIES } from "../../../constants/equipmentOptions";
import { FaCheckCircle } from "react-icons/fa";

const FilterCategory = ({ setAppliedFiltersCount }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [selectedCategory, setSelectedCategory] = useState("");

    //  Load selected category from URL on mount
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const categoryFromURL = params.get("category") || "";
        setSelectedCategory(categoryFromURL);
        setAppliedFiltersCount(categoryFromURL ? 1 : 0);
    }, [location.search]);

    //  Handle category selection (Only one at a time)
    const handleCategoryChange = (category) => {
        let updatedCategory = category === selectedCategory ? "" : category; // Toggle selection

        setSelectedCategory(updatedCategory);
        setAppliedFiltersCount(updatedCategory ? 1 : 0);

        //  Update URL (No backend call here)
        const params = new URLSearchParams(location.search);
        if (updatedCategory) {
            params.set("category", updatedCategory);
        } else {
            params.delete("category");
        }
        navigate({ search: params.toString() }, { replace: true });
    };

    return (
        <div className="p-4 w-full bg-white dark:bg-gray-800 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3">
                Filter by Category
            </h3>

            {/*  Horizontally Scrollable Category List */}
            <div className="flex space-x-2 overflow-x-auto scroll-hidden p-1">
                {EQUIPMENT_CATEGORIES.map((category) => (
                    <button
                        key={category}
                        className={`flex cursor-pointer items-center space-x-2 px-4 py-2 border rounded-lg transition whitespace-nowrap
                            ${
                                selectedCategory === category
                                    ? "bg-green-600 text-white border-green-600"
                                    : "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-white border-gray-300 dark:border-gray-600"
                            }
                        `}
                        onClick={() => handleCategoryChange(category)}
                    >
                        {selectedCategory === category && <FaCheckCircle className="text-white" />} {/* ✅ Show check icon */}
                        <span>{category}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default FilterCategory;
