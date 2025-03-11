import React, { useEffect, useState, useCallback } from "react";
import { FaSearch, FaAngleRight, FaAngleLeft } from "react-icons/fa";
import { fetchWithAuth } from "../../utilityFunction";
import Loader from "../utils/Loader";
import { debounce } from "lodash"; 
import { useNavigate, useSearchParams } from "react-router-dom";

const SearchBar = ({ setEquipmentResults, setMapData, setAlert }) => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const [isVisible, setIsVisible] = useState(true);
    const [isFocused, setIsFocused] = useState(false);
    const [searchQuery, setSearchQuery] = useState(searchParams.get("location") || "");
    const [radius, setRadius] = useState(searchParams.get("radius") || "50"); 
    const [showRadiusSelection, setShowRadiusSelection] = useState(false);
    const [loading, setLoading] = useState(false);
    let scrollTimeout;

    useEffect(() => {
        let lastScrollY = window.scrollY;

        const handleScroll = () => {
            if (isFocused) return;
            const currentScrollY = window.scrollY;

            if (currentScrollY === 0) {
                setIsVisible(true);
            } else if (currentScrollY > lastScrollY) {
                setIsVisible(false);
            } else {
                setIsVisible(true);
                clearTimeout(scrollTimeout);
                scrollTimeout = setTimeout(() => setIsVisible(false), 4000);
            }
            lastScrollY = currentScrollY;
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [isFocused]);

    //  Debounced API Call
    const fetchEquipments = useCallback(
        debounce(async (query, radius) => {
            if (!query.trim()) {
                setEquipmentResults([]);
                return;
            }

            setLoading(true); 
            try {
                const response = await fetchWithAuth(
                    `/api/v1/equipment?location=${query}&radius=${radius}`,
                    { method: "GET" },
                    setLoading,
                    setAlert,
                    navigate
                );
                if (response.success) {
                    if(response.data.length === 0) {
                        return setAlert({ type: "info", message: `No equipment found near "${query !== "" ? query : 'this'}" location.` });
                    }
                    setEquipmentResults(response.data.equipments);
                    setMapData(response.data.mapData);
                } else {
                    setAlert({ type: "info", message: "No equipment found in this location." });
                    setEquipmentResults([]);
                }
            } catch (error) {
                setAlert({ type: "error", message: "Failed to fetch results. Try again." });
            } finally {
                setLoading(false);
            }
        }, 1000), // Debounce by 300ms
        []
    );

    //  Sync state with URL changes
    useEffect(() => {
        const urlLocation = searchParams.get("location") || "";
        const urlRadius = searchParams.get("radius") || "50";
        if (urlLocation !== searchQuery) setSearchQuery(urlLocation);
        if (urlRadius !== radius) setRadius(urlRadius);
    }, [searchParams]);

    //  Trigger API when searchQuery or radius changes
    useEffect(() => {
        fetchEquipments(searchQuery, radius);
    }, [searchQuery, radius]);

    //  Handle Input Change & Update URL
    const handleSearchChange = (e) => {
        const newQuery = e.target.value;
        setSearchQuery(newQuery);
        updateUrlParams(newQuery, radius);
    };

    //  Handle Radius Change & Update URL
    const handleRadiusChange = (e) => {
        const newRadius = e.target.value;
        setRadius(newRadius);
        updateUrlParams(searchQuery, newRadius);
    };

    //  Function to update URL Params without reloading
    const updateUrlParams = (query, radius) => {
        const updatedParams = new URLSearchParams(searchParams);
        if (query) {
            updatedParams.set("location", query);
        } else {
            updatedParams.delete("location");
        }
        updatedParams.set("radius", radius); 
        setSearchParams(updatedParams, { replace: true });
    };

    return (
        <div
            className={`fixed top-16 left-0 right-0 mx-auto max-w-lg z-40 p-4 transition-all duration-300 ${
                isVisible || isFocused ? "translate-y-0 opacity-100" : "-translate-y-20 opacity-0"
            }`}
        >
            <div
                className={`flex items-center bg-white dark:bg-gray-900 shadow-md rounded-full px-4 py-2 border-2 transition-all duration-300 ${
                    isFocused
                        ? "border-green-500 ring-2 ring-green-300 dark:ring-green-600"
                        : "border-gray-300 dark:border-gray-700"
                }`}
            >
                <FaSearch className="text-green-500 dark:text-green-400" />
                <input
                    type="text"
                    value={searchQuery}
                    placeholder="Search equipment by location..."
                    className="ml-2 w-full bg-transparent outline-none text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                    onChange={handleSearchChange}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                />
                {loading && <Loader size={18} color="green" />}
            </div>

            {/* Range Slider for Radius Selection */}
            <div className={`mt-3 p-3 bg-gray-100 dark:bg-gray-900 rounded-md ml-auto ${!showRadiusSelection ? 'w-20 self-end' : ''}`}>
                <span onClick={()=> setShowRadiusSelection(!showRadiusSelection)} className="cursor-pointer mb-1" >
                    { showRadiusSelection ?  <FaAngleRight  /> : <FaAngleLeft /> }
                </span>
                <div className={`flex ${ !showRadiusSelection ? 'items-center justify-center' : ''} justify-between text-gray-700 dark:text-gray-300 text-sm mb-2`}>
                    { showRadiusSelection ?  <span>Show equipment within</span> : null }
                    <span className="font-semibold">{radius} km</span>
                </div>
                { showRadiusSelection ?
                    <>
                        <input
                            type="range"
                            min="10"
                            max="200"
                            step="10"
                            value={radius}
                            onChange={handleRadiusChange}
                            className="w-full cursor-pointer accent-green-600"
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>10 km</span>
                            <span>100 km</span>
                            <span>200 km</span>
                        </div>
                    </> : null }
            </div>
        </div>
    );
};

export default SearchBar;
