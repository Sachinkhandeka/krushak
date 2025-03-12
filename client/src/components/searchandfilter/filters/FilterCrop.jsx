import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { CROP_OPTIONS } from "../../../constants/equipmentOptions";
import { CheckboxSelectInput } from "../../common/FormComponents";

const FilterCrop = ({ setAppliedFiltersCount }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [selectedCrops, setSelectedCrops] = useState([]);

    //  Load selected crops from URL on mount
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const cropsFromURL = params.get("cropType") ? params.get("cropType").split("|||") : [];

        setSelectedCrops(cropsFromURL);
        setAppliedFiltersCount(cropsFromURL.length);
    }, [location.search]);

    // Handle Checkbox Selection
    const handleCropChange = (name, updatedValues) => {
        setSelectedCrops(updatedValues);
        setAppliedFiltersCount(updatedValues.length);

        //  Update the URL query params (No backend call here)
        const params = new URLSearchParams(location.search);
        if (updatedValues.length > 0) {
            params.set("cropType", updatedValues.join("|||"));
        } else {
            params.delete("cropType");
        }
        navigate({ search: params.toString() }, { replace: true });
    };

    return (
        <div className="p-4 w-full bg-white dark:bg-gray-800 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3">
                Filter by Crop Type
            </h3>

            {/*  Instant Selection Without Backend Call */}
            <CheckboxSelectInput
                label="Select Crops"
                name="cropType"
                value={selectedCrops}
                onChange={handleCropChange}
                options={CROP_OPTIONS}
            />
        </div>
    );
};

export default FilterCrop;
