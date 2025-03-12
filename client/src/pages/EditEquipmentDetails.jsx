import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../components/utils/Loader";
import Alert from "../components/utils/Alert";
import { fetchWithAuth } from "../utilityFunction";
import { RiUserLocationLine } from "react-icons/ri";
import { FaPencilAlt, FaSave } from "react-icons/fa";

const EditEquipmentGallery = React.lazy(()=> import("../components/equipment/EditEquipmentGallary"));
const EditEquipmentInfo = React.lazy(()=> import("../components/equipment/EditEquipmentInfo"));
const EditEquipmentLocation = React.lazy(()=> import("../components/equipment/EditEquipmentLocation"));
const MapComponent = React.lazy(()=> import("../components/common/MapComponent"));

const EditEquipmentDetails = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [equipment, setEquipment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [alert, setAlert] = useState({ type: "", message: "" });
    const [isEditingLocation, setIsEditingLocation] = useState(false);
    const [newLocation, setNewLocation] = useState("");

    // Fetch Equipment Details
    const getEquipment = async () => {
        try {
            const response = await fetchWithAuth(
                `/api/v1/equipment/${id}`,
                setLoading,
                setAlert,
                navigate
            );

            if (response?.data) {
                setEquipment(response.data);
            }
        } catch (error) {
            setAlert({ type: "error", message: error.message });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getEquipment();
    }, [id]);

    // Function to update location
    const handleLocationUpdate = async () => {
        if (!newLocation.trim()) {
            setAlert({ type: "warning", message: "Location cannot be empty!" });
            return;
        }

        setLoading(true);
        try {
            const response = await fetchWithAuth(
                `/api/v1/equipment/${id}`,
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ equipmentData: { currentLocation: newLocation } }),
                },
                setLoading,
                setAlert,
                navigate
            );

            if (response.success) {
                setAlert({ type: "success", message: "Location updated successfully!" });
                setEquipment((prev) => ({
                    ...prev,
                    currentLocation: newLocation,
                    geometry: response.data.geometry, // Ensure geometry gets updated
                }));
                setIsEditingLocation(false); // Exit edit mode
            }
        } catch (error) {
            setAlert({ type: "error", message: "Failed to update location." });
        } finally {
            setLoading(false);
        }
    };

    const handleMediaUpdate = (updatedMedia) => {
        setEquipment((prev) => ({
            ...prev,
            ...updatedMedia,
        }));
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader size={50} color="green" variant="dots" />
            </div>
        );
    }

    if (!equipment) {
        return (
            <div className="text-center text-gray-700 dark:text-gray-300 py-20">
                <p className="text-xl font-semibold">Equipment not found</p>
                <button
                    className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                    onClick={() => navigate("/")}
                >
                    Go Back
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-0.5 py-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Edit Equipment</h1>

            {/* Alert Message */}
            <div className="fixed top-14 right-4 z-50 w-[70%] max-w-sm">
                {alert && alert.message && (
                    <Alert type={alert.type} message={alert.message} autoDismiss onClose={() => setAlert(null)} />
                )}
            </div>

            {/* Editable Gallery */}
            <div className="flex flex-col md:flex-row gap-4">
                <EditEquipmentGallery
                    video={equipment.video}
                    images={equipment.images}
                    equipmentId={equipment._id}
                    setLoading={setLoading}
                    setAlert={setAlert}
                    navigate={navigate}
                    onUpdate={handleMediaUpdate}
                />

                {/* Editable Equipment Info */}
                <EditEquipmentInfo
                    equipment={equipment}
                    setAlert={setAlert}
                    onUpdate={(updatedInfo) =>
                        setEquipment((prev) => ({ ...prev, ...updatedInfo }))
                    }
                />
            </div>

            {/* Editable Equipment Location */}
            <EditEquipmentLocation
                location={equipment.availabilityArea[0]}
                crops={equipment.usedForCrops}
                equipmentId={equipment._id}
                setAlert={setAlert}
                onLocationUpdate={(updatedInfo) =>
                    setEquipment((prev) => ({ ...prev, ...updatedInfo }))
                }
            />

            {/* Map Display (Location Preview) */}
            {equipment.geometry?.coordinates && equipment.geometry?.coordinates.length === 2 ? (
                <div className="w-full h-[400px] mt-4 rounded-lg shadow dark:bg-gray-900 mb-20 border border-gray-300 dark:border-gray-700">
                    
                    {/* Owner's Current Location */}
                    <div className="mt-6 p-3 flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-medium text-gray-800 dark:text-gray-300 mb-2 flex items-center gap-2">
                                <RiUserLocationLine size={28} /> Owner's Current Location
                            </h3>
                            
                            {isEditingLocation ? (
                                <input
                                    type="text"
                                    value={newLocation}
                                    onChange={(e) => setNewLocation(e.target.value)}
                                    className="border-b border-gray-400 bg-transparent text-gray-800 dark:text-white w-full outline-none py-1"
                                    autoFocus
                                />
                            ) : (
                                <p className="text-gray-700 dark:text-gray-400">
                                    {equipment.currentLocation || "Not specified"}
                                </p>
                            )}
                        </div>

                        <div className="flex items-center gap-2">
                            {isEditingLocation ? (
                                <button
                                    onClick={handleLocationUpdate}
                                    className="cursor-pointer text-green-500 hover:text-green-700"
                                >
                                    <FaSave size={20} />
                                </button>
                            ) : (
                                <button
                                    onClick={() => {
                                        setIsEditingLocation(true);
                                        setNewLocation(equipment.currentLocation || "");
                                    }}
                                    className="cursor-pointer text-gray-500 hover:text-gray-700"
                                >
                                    <FaPencilAlt size={20} />
                                </button>
                            )}
                        </div>
                    </div>

                    <MapComponent
                        equipmentLocations={[
                            { 
                                coordinates: equipment.geometry.coordinates, 
                                id: equipment._id, 
                                locationName: equipment.currentLocation 
                            }
                        ]}
                    />
                </div>
            ) : (
                <p className="text-sm text-gray-500 mt-4">Map not available</p>
            )}
        </div>
    );
};

export default EditEquipmentDetails;
