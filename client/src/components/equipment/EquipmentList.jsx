import React, { useEffect, useState } from "react";
import EquipmentCard from "./EquipmentCard";
import { fetchWithAuth } from "../../utilityFunction";
import { Link, useNavigate } from "react-router-dom";

const EquipmentList = () => {
    const navigate = useNavigate()
    const [equipments, setEquipments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState({ type : "", message : "" });

    const getEquipments = async ()=> {
        setLoading(true);
        try {
            
            const response = await fetchWithAuth(
                "/api/v1/equipment",
                { method : "GET" },
                setLoading,
                setAlert,
                navigate
            );

            setEquipments(response.data);
        } catch (error) {
            setLoading(false);
            setAlert({ type : "", message : "" });
        }
    }
    useEffect(()=> {
        getEquipments();
    },[]);

    return (
        <div className="p-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {equipments.map((equipment) => (
                <EquipmentCard key={equipment._id} item={equipment} />
            ))}
        </div>
    );
};

export default EquipmentList;
