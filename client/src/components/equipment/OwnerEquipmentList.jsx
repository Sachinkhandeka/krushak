import React, { useEffect, useState } from "react";
import Loader from "../utils/Loader.jsx";
import { fetchWithAuth } from "../../utilityFunction.js";
import { Link } from "react-router-dom";
import OwnerEquipmentCard from "./OwnerEquipmentCard.jsx";

const NoDataFound = React.lazy(()=> import("../common/NoDataFound.jsx"))

const OwnerEquipmentList = () => {
    const [equipments, setEquipments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [alert, setAlert] = useState({ type: "", message: "" });

    const getEquipments = async () => {
        try {
            const response = await fetchWithAuth(
                "/api/v1/equipment/owner/equipments", 
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
                message="You have no listed equipment"
                subMessage="Add your equipment to start renting out."
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
                <OwnerEquipmentCard key={item._id} item={item} />
            ))}
        </div>
    );
};

export default OwnerEquipmentList;
