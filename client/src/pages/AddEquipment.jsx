import React, { useState } from "react";
import { TextInput, SelectInput } from "../components/common/FormComponents";
import { fetchWithAuth } from "../utilityFunction";
import { useNavigate } from "react-router-dom";
import Loader from "../components/utils/Loader";
import Alert from "../components/utils/Alert";
import Stepper from "../components/common/Stepper";
import { Helmet } from "react-helmet-async";

const StepOneEquipment = React.lazy(()=> import("../components/common/StepOneEquipment"))
const StepTwoEquipment = React.lazy(()=> import("../components/common/StepTwoEquipment"));
const StepFourMediaUpload = React.lazy(()=> import("../components/common/StepFourMediaUpload"));

const units = ['hour (કલાક)', 'day (દિવસ)', 'week (અઠવાડિયું)', 'quantity (જથ્થો)', 'other (અન્ય)'];

const steps = [
    { title: "Equipment Info", details: "Add basic details of equipment" },
    { title: "Equipment used for", details: "Add equipment usage and availability details" },
    { title: "Equipment Price", details: "Set your pricing" },
    { title: "Upload Media", details: "Upload images and videos for equipment" },
];

const AddEquipment = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [equipmentId, setEquipmentId] = useState(null);
    const [formData, setformData] = useState({
        name: "", 
        description: "", 
        type: "Tractor (ટ્રેક્ટર)", 
        category: "Tractors & Power Equipment (ટ્રેક્ટર અને પાવર ઉપકરણો)", 
        modelType: "", 
        isLatestModel: true, 
        year: "", 
        condition: "Excellent (ઉત્તમ)", 
        images: [],
        video: "", 
        unit: "hour (કલાક)", price: "", 
        availability: "Available",
        country: "", state: "", district: "", villages: "",
        currentLocation : "",
        usedForCrops: []
    });
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState({ type: "", message: "" });

    const handleDetailChange = (e)=> {
        const { name, value } = e.target ; 

        setformData({
            ...formData,
            [name] : value,
        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const formDataToSend = {
                name: formData.name,
                description: formData.description,
                category: formData.category,
                type: formData.type,
                year: formData.year,
                condition: formData.condition,
                availability: formData.availability === "Available" ? true : false,
                model: {
                    modelType: formData.modelType,
                    isLatestModel: formData.isLatestModel === "Yes" ? true : false,
                },
                availabilityArea: [
                    {
                        country: formData.country,
                        state: formData.state,
                        district: formData.district,
                        villages: [formData.villages], 
                    },
                ],
                currentLocation : formData.currentLocation,
                pricing: [
                    {
                        unit: formData.unit,
                        price: formData.price,
                    },
                ],
                usedForCrops: formData.usedForCrops, 
            };
            const result = await fetchWithAuth(
                "/api/v1/equipment",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ equipmentData : formDataToSend }),
                },
                setLoading,
                setAlert,
                navigate
            );

            if(result) {
                setAlert({ type : "success", message : result.message });
                setEquipmentId(result.data._id); 
                setStep(4); 
            }
        } catch (error) {
            setAlert({ type : "error", message : error.message});
        }
    };

    const handleCropSelection = (name, updatedValues) => {
        setformData((prevData) => ({
            ...prevData,
            [name]: updatedValues, // Ensures it updates correctly
        }));
    }

    return (
        <>
            {/*  SEO-Optimized Metadata for Maximum Rankings */}
            <Helmet>
                <title>Rent Farm Equipment | Hire Tractors, Harvesters & More | krushak</title>
                <meta 
                    name="description" 
                    content="List your farm equipment for rent with krushak. Rent out tractors, harvesters, and agricultural machinery to farmers in need. Get more earnings from your idle equipment." 
                />
                <meta 
                    name="keywords" 
                    content="rent farm equipment, hire tractor, agricultural machinery rental, farm tools rental, krushak rental, farm equipment hire, leasing farm tools, farming tools rent" 
                />

                {/* OpenGraph (For social media sharing) */}
                <meta property="og:title" content="Rent Farm Equipment | Hire Tractors, Harvesters & More | krushak" />
                <meta 
                    property="og:description" 
                    content="Earn extra by renting out your farm equipment. Farmers can find tractors, harvesters, and agricultural tools for hire on krushak." 
                />
                <meta property="og:image" content="https://res.cloudinary.com/dg840otuv/image/upload/v1741839605/krushak_logo_zllvhe.png" />
                <meta property="og:url" content="https://www.krushak.co.in/register-equipment" />
                <meta property="og:type" content="website" />

                {/* Twitter Cards */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="Earn by Renting Out Your Farm Equipment | krushak" />
                <meta 
                    name="twitter:description" 
                    content="Make money by leasing tractors, harvesters, and agricultural tools. Farmers can rent your equipment easily via krushak." 
                />
                <meta name="twitter:image" content="https://res.cloudinary.com/dg840otuv/image/upload/v1741839605/krushak_logo_zllvhe.png" />

                {/* Canonical URL */}
                <link rel="canonical" href="https://www.krushak.co.in/register-equipment" />
            </Helmet>
            <div className="w-full p-6 my-4 mx-1 bg-white dark:bg-gray-900 shadow-lg rounded-lg">
                {/* Alert Message */}
                <div className="fixed top-14 right-4 z-50 w-[70%] max-w-sm">
                    {alert && alert.message && (
                        <Alert type={alert.type} message={alert.message} autoDismiss onClose={() => setAlert(null)} />
                    )}
                </div>

                {/* Stepper */}
                <Stepper steps={steps} currentStep={step} />

                <h2 className="text-2xl font-bold my-6 text-gray-800 dark:text-gray-100">
                    Rent Your Equipment
                </h2>

                <form onSubmit={handleSubmit}>
                    {/* Step 1: Equipment Information */}
                    {step === 1 && (
                        <StepOneEquipment formData={formData} handleChange={handleDetailChange} />
                    )}

                    {/* Step 2: Equipment Usage & Availability */}
                    {step === 2 && (
                        <StepTwoEquipment formData={formData} handleChange={handleDetailChange} handleCropSelection={handleCropSelection} />
                    )}

                    {/* Step 3: Equipment Price */}
                    {step === 3 && (
                        <>
                            <h3 className="text-lg font-semibold mt-6 mb-2">Pricing</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <SelectInput label="Unit" value={formData.unit} onChange={handleDetailChange} name="unit" options={units} required />
                                <TextInput label="Price" value={formData.price} onChange={handleDetailChange} name="price" placeholder="Enter Price" required />
                            </div>
                        </>
                    )}

                    {/* Navigation Buttons (Hide in Step 4) */}
                    {step !== 4 && (
                        <div className="flex justify-between mt-6">
                            {step > 1 && (
                                <button
                                    type="button"
                                    className="bg-gray-500 cursor-pointer text-white px-4 py-2 rounded-md"
                                    onClick={() => setStep(step - 1)}
                                >
                                    Back
                                </button>
                            )}
                            {step < 3 ? (
                                <button
                                    type="button"
                                    className="bg-blue-500 cursor-pointer text-white px-4 py-2 rounded-md"
                                    onClick={() => setStep(step + 1)}
                                >
                                    Next
                                </button>
                            ) : (
                                <button
                                    type="submit"
                                    className="bg-green-500 cursor-pointer text-white px-4 py-2 rounded-md"
                                    disabled={loading}
                                >
                                    {loading ? <Loader size={18} color="white" variant="dots" /> : "Submit"}
                                </button>
                            )}
                        </div>
                    )}

                
                    {/* Step 4: Equipment Media */}
                    {step === 4 && (
                        <StepFourMediaUpload equipmentId={equipmentId} navigate={navigate} />
                    )}
                </form>
            </div>
        </>
    );
};

export default AddEquipment;
