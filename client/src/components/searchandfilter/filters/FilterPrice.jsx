import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const MIN_PRICE = 500;
const MAX_PRICE = 75000;

const FilterPrice = ({ setAppliedFiltersCount }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const [minPrice, setMinPrice] = useState(MIN_PRICE);
    const [maxPrice, setMaxPrice] = useState(MAX_PRICE);

    // Load price filters from URL
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const min = parseInt(params.get("minPrice")) || MIN_PRICE;
        const max = parseInt(params.get("maxPrice")) || MAX_PRICE;

        setMinPrice(min);
        setMaxPrice(max);
        setAppliedFiltersCount(min !== MIN_PRICE || max !== MAX_PRICE ? 1 : 0);
    }, [location.search]);

    // Update URL without backend calls
    const updateURL = (newMin, newMax) => {
        const params = new URLSearchParams(location.search);
        newMin !== MIN_PRICE ? params.set("minPrice", newMin) : params.delete("minPrice");
        newMax !== MAX_PRICE ? params.set("maxPrice", newMax) : params.delete("maxPrice");

        navigate({ search: params.toString() }, { replace: true });
        setAppliedFiltersCount(newMin !== MIN_PRICE || newMax !== MAX_PRICE ? 1 : 0);
    };

    // Handle slider & input changes
    const handleMinChange = (e) => {
        let value = Math.min(Number(e.target.value), maxPrice - 500);
        setMinPrice(value);
        updateURL(value, maxPrice);
    };

    const handleMaxChange = (e) => {
        let value = Math.max(Number(e.target.value), minPrice + 500);
        setMaxPrice(value);
        updateURL(minPrice, value);
    };

    return (
        <div className="p-4 w-full bg-white dark:bg-gray-800 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3">
                Select Price Range
            </h3>

            {/* Range Slider */}
            <div className="relative">
                <label htmlFor="minimum">Minimum</label>
                <input
                    type="range"
                    min={MIN_PRICE}
                    max={MAX_PRICE}
                    step="500"
                    name="minimum"
                    value={minPrice}
                    onChange={handleMinChange}
                    className="w-full cursor-pointer"
                />
                <label htmlFor="maximum">Maximum</label>
                <input
                    type="range"
                    min={MIN_PRICE}
                    max={MAX_PRICE}
                    step="500"
                    value={maxPrice}
                    name="maximum"
                    onChange={handleMaxChange}
                    className="w-full cursor-pointer"
                />
            </div>

            {/* Min & Max Price Inputs */}
            <div className="flex justify-between items-center mt-4">
                <div className="flex flex-col items-center">
                    <label className="text-sm text-gray-500 dark:text-gray-400">Min Price</label>
                    <input
                        type="number"
                        min={MIN_PRICE}
                        max={maxPrice - 500}
                        value={minPrice}
                        onChange={handleMinChange}
                        className="mt-1 px-3 py-1 w-24 text-center border border-green-500 
                                   focus:ring-2 focus:ring-green-500 focus:border-green-600
                                   rounded-md bg-white dark:bg-gray-800 text-green-700 
                                   dark:text-green-400"
                    />
                </div>

                <div className="flex flex-col items-center">
                    <label className="text-sm text-gray-500 dark:text-gray-400">Max Price</label>
                    <input
                        type="number"
                        min={minPrice + 500}
                        max={MAX_PRICE}
                        value={maxPrice}
                        onChange={handleMaxChange}
                        className="mt-1 px-3 py-1 w-24 text-center border border-green-500 
                            focus:ring-2 focus:ring-green-500 focus:border-green-600
                            rounded-md bg-white dark:bg-gray-800 text-green-700 
                             dark:text-green-400"
                    />
                </div>
            </div>
        </div>
    );
};

export default FilterPrice;
