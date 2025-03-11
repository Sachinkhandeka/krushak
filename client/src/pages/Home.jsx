import React, { useState, useRef, useEffect } from "react";
import EquipmentList from "../components/equipment/EquipmentList";
import SearchAndFilterWrapper from "../components/searchandfilter/SearchAndFilterWrapper";
import Alert from "../components/utils/Alert";
import NearbyEquipmentMap from "../components/common/NearbyEquipmentMap";
const BottomSheet = React.lazy(()=> import("../components/common/BottomSheet"));

const Home = () => {
    const [equipmentResults, setEquipmentResults] = useState([]);
    const [mapData, setMapData] = useState(null);
    const [alert, setAlert] = useState({ type: "", message: "" });

    return (
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
    );
};

export default Home;
