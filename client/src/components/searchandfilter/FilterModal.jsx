import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import FilterCategory from "./filters/FilterCategory";
import FilterType from "./filters/FilterType";
import FilterPrice from "./filters/FilterPrice";
import FilterCondition from "./filters/FilterCondition";
import FilterCrop from "./filters/FilterCrop";
import { fetchWithAuth } from "../../utilityFunction";

const FilterModal = ({ isOpen, onClose, setEquipmentResults, setAlert, setAppliedFiltersCount, onClearFilters, setMapData }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState(false);
    const [filterCount, setFilterCount] = useState(0);

    // Update filter count based on applied filters in the URL
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        setFilterCount(Array.from(params.keys()).length);
        setAppliedFiltersCount(Array.from(params.keys()).length);
    }, [location.search]);

   
    const handleFilterSubmit = async () => {
        setLoading(true);

        try {
            const params = new URLSearchParams(window.location.search);
            const queryString = params.toString();

            const response = await fetchWithAuth(
                `/api/v1/equipment/filter?${queryString}`, 
                { method: "GET" },
                setLoading,
                setAlert,
                navigate
            );

            if (response.success) {
                setEquipmentResults(response.data.equipments);
                setMapData(response.data.mapData);
                setFilterCount(Array.from(params.keys()).length);
                setAppliedFiltersCount(Array.from(params.keys()).length);
                onClose();
            }
        } catch (error) {
            setLoading(false);
            setAlert({ type: "error", message: error.message });
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }} 
                animate={{ opacity: 1, scale: 1 }} 
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="bg-white dark:bg-gray-900 w-full max-w-lg p-0 rounded-lg shadow-lg flex flex-col max-h-[80vh]"
            >
                {/* Sticky Header */}
                <div className="sticky top-0 bg-white dark:bg-gray-900 px-6 py-4 border-b border-gray-300 dark:border-gray-700 z-10">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Filter Equipment</h2>
                        <button 
                            onClick={onClose} 
                            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 cursor-pointer text-xl"
                        >
                            ✕
                        </button>
                    </div>
                </div>

                {/* Scrollable Content */}
                <div className="overflow-y-auto scroll-hidden px-0.5 py-4 space-y-4 flex-1">
                    <FilterCrop
                        setEquipmentResults={setEquipmentResults}
                        setAlert={setAlert}
                        setAppliedFiltersCount={setAppliedFiltersCount} 
                    />
                    <FilterCategory 
                        setAppliedFiltersCount={setAppliedFiltersCount}
                    />
                    <FilterType
                        setAppliedFiltersCount={setAppliedFiltersCount} 
                    />
                    <FilterPrice 
                        setAppliedFiltersCount={setAppliedFiltersCount} 
                    />
                    <FilterCondition
                        setAppliedFiltersCount={setAppliedFiltersCount}  
                    />
                </div>

                {/* Sticky Footer */}
                <div className="sticky bottom-0 bg-white dark:bg-gray-900 px-6 py-4 border-t border-gray-300 dark:border-gray-700 flex justify-between z-10">
                    <button 
                        className="bg-gray-500 text-white cursor-pointer py-2 px-4 rounded-md font-semibold hover:bg-gray-600 transition"
                        onClick={onClearFilters}
                    >
                        Clear All
                    </button>
                    <button 
                        className="bg-green-600 text-white cursor-pointer py-2 px-4 rounded-md font-semibold hover:bg-green-700 transition flex items-center"
                        onClick={handleFilterSubmit}
                    >
                        {loading ? "Applying..." : `Apply Filters ${filterCount > 0 ? `(${filterCount})` : ""}`}
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default FilterModal;
