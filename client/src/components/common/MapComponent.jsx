import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import { useNavigate } from "react-router-dom";
import "mapbox-gl/dist/mapbox-gl.css";

// 🔹 Replace with your Mapbox token
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

const DEFAULT_CENTER = [70.6412, 23.7856]; // 📌 Default: Rapar, Kutch, Gujarat

const MapComponent = ({ equipmentLocations = [] }) => {
    const mapContainerRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!Array.isArray(equipmentLocations) || equipmentLocations.length === 0) {
            console.warn("⚠️ No valid locations provided, using default location.");
        }

        // ✅ Determine initial map center
        const defaultCenter =
            equipmentLocations.length === 1 && equipmentLocations[0].coordinates?.length === 2
                ? equipmentLocations[0].coordinates
                : DEFAULT_CENTER;

        //  Initialize Mapbox map
        const map = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: "mapbox://styles/mapbox/streets-v11",
            center: defaultCenter,
            zoom: equipmentLocations.length === 1 ? 12 : 8, //  Closer zoom for single location
        });

        //  Add Default Mapbox Markers for Each Equipment
        equipmentLocations.forEach((equipment) => {
            if (!equipment.coordinates || equipment.coordinates.length !== 2) {
                console.warn(" Skipping invalid coordinates:", equipment);
                return;
            }

            const [lng, lat] = equipment.coordinates;

            //  Create Mapbox marker
            const marker = new mapboxgl.Marker()
                .setLngLat([lng, lat])
                .addTo(map);

            //  Add a popup showing location name on hover
            const popup = new mapboxgl.Popup({
                closeButton: false,
                closeOnClick: false,
                offset: 25,
            }).setText(equipment.locationName || "Unknown Location");

            marker.getElement().addEventListener("mouseenter", () => popup.addTo(map));
            marker.getElement().addEventListener("mouseleave", () => popup.remove());

            //  Navigate to equipment detail on click
            marker.getElement().addEventListener("click", () => {
                if (equipment.id) {
                    navigate(`/equipment/${equipment.id}`);
                }
            });
        });

        return () => map.remove(); // ✅ Cleanup on unmount
    }, [equipmentLocations, navigate]);

    return <div ref={mapContainerRef} className="w-full h-full rounded-lg shadow-lg" />;
};

export default MapComponent;
