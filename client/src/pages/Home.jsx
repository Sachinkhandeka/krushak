import React, { useState } from "react";
import EquipmentList from "../components/equipment/EquipmentList";
import SearchAndFilterWrapper from "../components/searchandfilter/SearchAndFilterWrapper";
import Alert from "../components/utils/Alert";

const Home = () => {
    const [equipmentResults, setEquipmentResults] = useState([]); 
    const [alert, setAlert] = useState({ type: "", message: "" });

    return (
        <section className="my-4">
            {/* alert message */}
            <div className="fixed top-14 right-4 z-50 w-[70%] max-w-sm">
                {alert && alert.message && (
                    <Alert type={alert.type} message={alert.message} autoDismiss onClose={() => setAlert(null)} />
                )}
            </div>
            <SearchAndFilterWrapper setEquipmentResults={setEquipmentResults} setAlert={setAlert} />
            <EquipmentList equipmentResults={equipmentResults} setAlert={setAlert} />
        </section>
    );
};

export default Home;
