import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../components/utils/Loader";
import { fetchWithAuth } from "../utilityFunction";
import { RiUserLocationLine } from "react-icons/ri";
import Alert from "../components/utils/Alert";
import { Helmet } from "react-helmet-async";

const EquipmentGallery = React.lazy(()=> import("../components/equipment/EquipmentGallery"));
const EquipmentInfo = React.lazy(()=> import("../components/equipment/EquipmentInfo"));
const EquipmentLocation = React.lazy(()=> import("../components/equipment/EquipmentLocation"));
const MapComponent = React.lazy(()=> import("../components/common/MapComponent"));

const EquipmentDetail = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [equipment, setEquipment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [alert, setAlert] = useState({ type: "", message: "" });

    const getEquipment = async () => {
        try {
            const response = await fetchWithAuth(
                `/api/v1/equipment/${id}`,
                { method: "GET" },
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

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader size={50} color="blue" variant="dots" />
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
        <>
        {/* SEO Metadata using react-helmet-async */}
        <Helmet>
            <title>{equipment.name} for Rent - Rent {equipment.category} Equipment | krushak</title>
            <meta 
                name="description" 
                content={`Find and rent the best ${equipment.name} in your location. 
                Perfect for farming and agricultural needs.Ideal for ${equipment.usedForCrops?.join(", ")}.
                Available in ${equipment.currentLocation}. 
                Affordable pricing starting at ${equipment.pricing?.[0]?.price} per ${equipment.pricing?.[0]?.unit}. 
                Get the best farm equipment rental service with krushak.`} />
            <meta name="keywords" content="farm equipment rental, rent tractors, krushak, hire farm tools, rent agricultural machinery" />
                
            {/* Open Graph Meta Tags for better social media previews */}
            <meta property="og:title" content={equipment.name} />
            <meta property="og:description" content={equipment.description} />
            <meta property="og:image" content="${equipment.images.length > 0 ? equipment.images[0] : 'https://res.cloudinary.com/dg840otuv/image/upload/v1741839605/krushak_logo_zllvhe.png'}" />
            <meta property="og:url" content={`https://krushak.co.in/equipment/${id}`} />
            <meta property="og:type" content="website" />
            <meta property="og:site_name" content="krushak - Farm Equipment Rentals" />
            <meta property="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={`Rent ${equipment?.name} - Best Equipment for Farming | krushak`} />
            <meta 
                name="twitter:description" 
                content={equipment?.description || "Find the best farm equipment for rent on krushak."} />
            <meta property="twitter:image" content={equipment?.images || "https://res.cloudinary.com/dg840otuv/image/upload/v1741839605/krushak_logo_zllvhe.png"} />
            <link rel="canonical" href={`https://krushak.co.in/equipment/${equipment?._id}`} />
        </Helmet>
        <div className="max-w-6xl mx-auto px-0.5 py-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{equipment.name}</h1>

            {/* alert message */}
            <div className="fixed top-14 right-4 z-50 w-[70%] max-w-sm">
                {alert && alert.message && (
                    <Alert type={alert.type} message={alert.message} autoDismiss onClose={() => setAlert(null)} />
                )}
            </div>

            <div className="flex flex-col md:flex-row gap-4">
                <EquipmentGallery 
                    equipmentId={equipment._id}
                    video={equipment.video} 
                    images={equipment.images} 
                    name={equipment.name} 
                    setAlert={setAlert}
                />

                <EquipmentInfo 
                    equipment={equipment}
                    owner={equipment.owner} 
                    pricing={equipment.pricing} 
                    availability={equipment.availability}
                    category={equipment.category} 
                    type={equipment.type} 
                    model={equipment.model} 
                    year={equipment.year} 
                    condition={equipment.condition} 
                    description={equipment.description} 
                />
            </div>

            <EquipmentLocation 
                location={equipment.availabilityArea[0]} 
                crops={equipment.usedForCrops} 
                ownerLocation={equipment.currentLocation}
            />
            
            {/*  Map Display (Only Showing Equipment Coordinates) */}
            {equipment.geometry?.coordinates && equipment.geometry?.coordinates.length === 2 ? (
                <div className="w-full h-[400px] mt-4 rounded-lg shadow dark:bg-gray-900 mb-20 border border-gray-300 dark:border-gray-700">
                    
                    {/*  Owner's Current Location (Displayed as String) */}
                    <div className="mt-6 p-3">
                        <h3 className="text-lg font-medium text-gray-800 dark:text-gray-300 mb-2 flex items-center gap-2">
                            <RiUserLocationLine size={28} /> Owner's Current Location
                        </h3>
                        <p className="text-gray-700 dark:text-gray-400">
                            {equipment.currentLocation ? equipment.currentLocation : "Not specified"}
                        </p>
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
        </>
    );
};

export default EquipmentDetail;
