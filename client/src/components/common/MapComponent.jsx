import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";

// 🔹 Replace with your Mapbox token
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;;

const MapComponent = () => {
    const mapContainerRef = useRef(null);

    useEffect(() => {
        const map = new mapboxgl.Map({
            container: mapContainerRef.current, // Reference to our div
            style: "mapbox://styles/mapbox/streets-v11", // Map style
            center: [72.5714, 23.0225], // Ahmedabad [Longitude, Latitude]
            zoom: 10, // Zoom level
        });

        return () => map.remove(); // Cleanup map on unmount
    }, []);

    return (
        <div
            ref={mapContainerRef}
            className="w-full h-[500px] rounded-lg shadow-lg"
        />
    );
};

export default MapComponent;
