import React, { useState } from "react";
import SearchBar from "./SearchBar";
import FilterButton from "./FilterButton";
import FilterModal from "./FilterModal";

const SearchAndFilterWrapper = ({ setEquipmentResults, setAlert }) => {
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
    const [appliedFiltersCount, setAppliedFiltersCount] = useState(0); 

    return (
        <div className="relative w-full p-4">
            <SearchBar setEquipmentResults={setEquipmentResults} setAlert={setAlert} />
            <FilterButton 
                onClick={() => setIsFilterModalOpen(true)} 
                appliedFiltersCount={appliedFiltersCount}
            />
            <FilterModal 
                isOpen={isFilterModalOpen} 
                onClose={() => setIsFilterModalOpen(false)} 
                setAppliedFiltersCount={setAppliedFiltersCount}
                onClearFilters={() => setAppliedFiltersCount(0)}
            />
        </div>
    );
};

export default SearchAndFilterWrapper;
