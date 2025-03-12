import React, { useEffect, useState } from "react";
import SearchBar from "./SearchBar";
import FilterButton from "./FilterButton";
import FilterModal from "./FilterModal";
import { useLocation } from "react-router-dom";

const SearchAndFilterWrapper = ({ setEquipmentResults, setMapData, setAlert }) => {
    const location = useLocation();
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
    const [appliedFiltersCount, setAppliedFiltersCount] = useState(0); 

    //  Load applied filters from URL on mount
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const cropsFromURL = params.get("cropType") ? params.get("cropType").split("|||") : [];
        setAppliedFiltersCount(cropsFromURL.length);
    }, [location.search]);

    const handleClearFilters = () => {
        //  Remove all query parameters from the URL
        const params = new URLSearchParams(location.search);
        params.delete("cropType"); // Remove crop filter (Add more deletes if needed)
    
        //  Update the URL without any filters
        window.history.replaceState({}, "", `${location.pathname}`);
    
        //  Reset applied filters count
        setAppliedFiltersCount(0);
    };

    return (
        <div className="relative w-full p-4">
            <SearchBar setEquipmentResults={setEquipmentResults} setMapData={setMapData} setAlert={setAlert} />
            <FilterButton 
                onClick={() => setIsFilterModalOpen(true)} 
                appliedFiltersCount={appliedFiltersCount}
            />
            <FilterModal 
                isOpen={isFilterModalOpen} 
                onClose={() => setIsFilterModalOpen(false)} 
                setEquipmentResults={setEquipmentResults}
                setAlert={setAlert}
                setAppliedFiltersCount={setAppliedFiltersCount}
                onClearFilters={handleClearFilters}
                setMapData={setMapData}
            />
        </div>
    );
};

export default SearchAndFilterWrapper;
