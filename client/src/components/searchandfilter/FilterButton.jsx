import React from "react";
import { FaFilter } from "react-icons/fa";
import { motion } from "framer-motion";

const FilterButton = ({ onClick, appliedFiltersCount }) => {
    return (
        <div className="fixed bottom-6 right-6 z-40">
            <button 
                onClick={onClick} 
                className={`relative cursor-pointer hover:shadow-md bg-green-600 dark:bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-700 dark:hover:bg-green-400 transition-all duration-300 
                    ${appliedFiltersCount > 0 ? "border-2 border-yellow-500" : ""}`}
            >
                <FaFilter size={20} />
                
                {/* Badge for filter count */}
                {appliedFiltersCount > 0 && (
                    <motion.span 
                        initial={{ scale: 0, opacity: 0 }} 
                        animate={{ scale: 1, opacity: 1 }} 
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="absolute -top-2 -right-2 bg-yellow-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-md"
                    >
                        {appliedFiltersCount}
                    </motion.span>
                )}
            </button>
        </div>
    );
};

export default FilterButton;
