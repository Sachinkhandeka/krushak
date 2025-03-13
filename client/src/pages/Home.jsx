import React, { useState, useRef, useEffect } from "react";
import Alert from "../components/utils/Alert";
import { Helmet } from "react-helmet-async";

const SearchAndFilterWrapper = React.lazy(()=> import("../components/searchandfilter/SearchAndFilterWrapper"));
const BottomSheet = React.lazy(()=> import("../components/common/BottomSheet"));
const NearbyEquipmentMap = React.lazy(()=> import("../components/common/NearbyEquipmentMap"));
const EquipmentList = React.lazy(()=> import("../components/equipment/EquipmentList"));

const Home = () => {
    const [equipmentResults, setEquipmentResults] = useState([]);
    const [mapData, setMapData] = useState(null);
    const [alert, setAlert] = useState({ type: "", message: "" });

    return (
        <>
            {/*  SEO Optimized Metadata */}
            <Helmet>
                {/* Title for Search Engines */}
                <title>krushak - Rent Farm Equipment | Tractor, Harvester & More</title>
                <meta 
                    name="description" 
                    content="Find and rent farm equipment easily with krushak. Choose from tractors, harvesters, and more. Affordable agricultural machinery available near you." 
                />
                <meta name="keywords" content="farm equipment rental, rent tractor, hire harvester, agricultural machinery, affordable farming tools, farm tools near me, krushak" />

                {/* OpenGraph Meta Tags (for social media) */}
                <meta property="og:title" content="krushak - Rent Farm Equipment | Tractor, Harvester & More" />
                <meta 
                    property="og:description" 
                    content="Need farming tools? Rent high-quality agricultural machinery, including tractors and harvesters, with krushak's easy-to-use platform." 
                />
                <meta property="og:image" content="https://res.cloudinary.com/dg840otuv/image/upload/v1741839605/krushak_logo_zllvhe.png" />
                <meta property="og:url" content="https://www.krushak.co.in/" />
                <meta property="og:type" content="website" />

                {/* Twitter Meta Tags */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="krushak - Rent Farm Equipment Easily" />
                <meta 
                    name="twitter:description" 
                    content="Looking for farming tools? Rent high-quality tractors, harvesters, and more with krushak’s seamless equipment rental service." 
                />
                <meta name="twitter:image" content="https://res.cloudinary.com/dg840otuv/image/upload/v1741839605/krushak_logo_zllvhe.png" />

                {/* Canonical URL (Prevents duplicate content issues) */}
                <link rel="canonical" href="https://www.krushak.co.in/" />

                {/* Robots Meta Tag (Ensures indexing) */}
                <meta name="robots" content="index, follow" />
            </Helmet>
            <section className="my-1">
                {/* Alert Message */}
                <div className="fixed top-14 right-4 z-50 w-[70%] max-w-sm">
                    {alert && alert.message && (
                        <Alert type={alert.type} message={alert.message} autoDismiss onClose={() => setAlert(null)} />
                    )}
                </div>

                {/* Search & Filter */}
                <SearchAndFilterWrapper 
                    setEquipmentResults={setEquipmentResults} 
                    setMapData={setMapData} 
                    setAlert={setAlert} 
                />

                {/* If mapData exists, show map and bottom sheet */}
                {mapData ? (
                    <>
                        {/* Map Section */}
                        <div className="w-full">
                            <div className="w-full h-[300px] sm:h-[400px] lg:h-[500px] rounded-lg overflow-hidden">
                                <NearbyEquipmentMap {...mapData} />
                            </div>
                        </div>

                        {/* Bottom Sheet */}
                        <BottomSheet equipmentResults={equipmentResults} setAlert={setAlert} />
                    </>
                ) : (
                    // If no mapData, show only the equipment list
                    <EquipmentList equipmentResults={equipmentResults} setAlert={setAlert} />
                )}
            </section>
        </>
    );
};

export default Home;
