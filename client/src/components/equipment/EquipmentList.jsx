import React from "react";
import EquipmentCard from "./EquipmentCard";

const EquipmentList = () => {
    const dummyData = [
        {
            id: 1,
            name: "Tractor XYZ",
            brand: "John Deere",
            model: "JD 5050D",
            year: 2022,
            category: "Tractors & Power Equipment",
            type: "Tractor",
            condition: "Excellent",
            description: "A high-power tractor suitable for large-scale farming operations.",
            pricing: [{ unit: "hour", price: 500 }],
            availability: true,
            video: "https://www.w3schools.com/html/mov_bbb.mp4", // Example video URL
            images: [
                "https://img.freepik.com/free-psd/powerful-green-john-deere-tractor-modern-agricultural-machinery_191095-82167.jpg",
                "https://img.freepik.com/free-photo/tractor-agriculture-machine-green-tractor-plowing-field_1150-10834.jpg",
                "https://img.freepik.com/free-photo/agriculture-farm-tractor-agricultural-vehicle_1150-10934.jpg",
                "https://img.freepik.com/free-photo/harvesting-agriculture-farming-technology-crops_53876-119676.jpg",
                "https://img.freepik.com/free-photo/large-green-tractor-working-field-spring_1268-14999.jpg",
            ],
        },
        {
            id: 2,
            name: "Harvester ABC",
            brand: "Mahindra",
            model: "Arjun 605",
            year: 2021,
            category: "Harvesting Equipment",
            type: "Harvester",
            condition: "Good",
            description: "A reliable harvester with high efficiency for wheat and rice fields.",
            pricing: [{ unit: "day", price: 2000 }],
            availability: false,
            images: [
                "https://img.freepik.com/free-photo/modern-combine-harvester-agriculture-machine-harvesting-wheat-field_1203-10235.jpg",
                "https://img.freepik.com/free-photo/farming-equipment-harvesting-technology-agriculture-concept_1203-12245.jpg",
            ],
        },
    ];

    return (
        <div className="p-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {dummyData.map((item) => (
                <EquipmentCard key={item.id} item={item} />
            ))}
        </div>
    );
};

export default EquipmentList;
