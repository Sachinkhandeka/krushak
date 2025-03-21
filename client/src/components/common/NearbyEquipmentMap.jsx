import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

const NearbyEquipmentMap = ({ userSearchedLocation, nearByEquipments }) => {
    const mapContainerRef = useRef(null);

    useEffect(() => {
        const map = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: "mapbox://styles/mapbox/streets-v11",
            center: userSearchedLocation?.coordinates || [70.6412, 23.7856],
            zoom: 8
        });

        // User's Location Marker
        if (userSearchedLocation) {
            new mapboxgl.Marker({ color: "green" })
                .setLngLat(userSearchedLocation.coordinates)
                .setPopup(new mapboxgl.Popup().setText("You")) 
                .addTo(map);
        }

        // 🔹 Handle overlapping markers
        const markerCounts = {};

        nearByEquipments.forEach(({ id, coordinates, label, ownerAvatar, ownerName }) => {
            if (!coordinates || coordinates.length !== 2) return;

            const key = coordinates.join(",");
            if (!markerCounts[key]) {
                markerCounts[key] = 0;
            }
            const count = markerCounts[key]++;
            
            // Offset formula: shift markers slightly based on count
            const offsetLng = (count % 2 === 0 ? 0.0001 : -0.0001) * count;
            const offsetLat = (count % 2 === 0 ? 0.0001 : -0.0001) * count;

            const adjustedCoordinates = [coordinates[0] + offsetLng, coordinates[1] + offsetLat];

            const popupContent = `
                <div class="flex items-center gap-2">
                    ${ownerAvatar ? `<img src="${ownerAvatar}" class="w-8 h-8 rounded-full" alt="${ownerName}" />` : ""}
                    <div>
                        <strong>${label}</strong><br/>
                        <small>Owner: ${ownerName}</small>
                        <a href="/equipment/${id}" class="text-blue-600 font-semibold underline mt-2 block">
                            Show Equipment Details
                        </a>
                    </div>
                </div>
            `;

            const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(popupContent);

            new mapboxgl.Marker()
                .setLngLat(adjustedCoordinates) // Apply offset to fix overlap
                .setPopup(popup) 
                .addTo(map);
        });

        return () => map.remove();
    }, [userSearchedLocation, nearByEquipments]);

    return <div ref={mapContainerRef} className="w-full h-[500px] rounded-lg shadow-lg" />;
};

export default NearbyEquipmentMap;
