import React, { useEffect, useState } from "react";
import EquipmentCard from "./EquipmentCard.jsx";
import Loader from "../utils/Loader.jsx";
import NoDataFound from "../common/NoDataFound.jsx";
import { fetchWithAuth } from "../../utilityFunction.js";
import { Link } from "react-router-dom";

const EquipmentList = () => {
    const [equipments, setEquipments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [alert, setAlert] = useState({ type: "", message: "" });

    const getEquipments = async () => {
        try {
            const response = await fetchWithAuth(
                "/api/v1/equipment",
                { method: "GET" },
                setLoading,
                setAlert
            );

            if (response?.data) {
                setEquipments(response.data);
            }
        } catch (error) {
            setAlert({ type: "error", message: error.message });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getEquipments();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader size={50} color="green" variant="dots" />
            </div>
        );
    }

    if (equipments.length === 0) {
        return (
            <NoDataFound 
                message="No Equipments Available" 
                subMessage="Check back later or add a new equipment."
                action={
                    <Link 
                        to={"/register-equipment"}
                        className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
                        Add Equipment
                    </Link>
                }
            />
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {equipments.map((item) => (
                <EquipmentCard key={item._id} item={item} />
            ))}
        </div>
    );
};

export default EquipmentList;
