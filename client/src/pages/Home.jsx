import React, { useEffect, useState } from "react";
import EquipmentCard from "../components/equipment/EquipmentCard";
import Loader from "../components/utils/Loader";
import NoDataFound from "../components/common/NoDataFound";
import { fetchWithAuth } from "../utilityFunction";
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
                <Loader size={50} color="blue" variant="dots" />
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4 py-8">
            {equipments.map((item) => (
                <EquipmentCard key={item._id} item={item} />
            ))}
        </div>
    );
};

export default EquipmentList;
