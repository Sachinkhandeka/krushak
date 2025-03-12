import React, { useState } from "react";
import { useSelector } from "react-redux";
import ProfileHeader from "../components/common/ProfileHeader";
import ProfileDetails from "../components/common/ProfileDetails";
import ChangePassword from "../components/common/ChangePassword";
import Alert from "../components/utils/Alert";


const UserProfile = () => {
    const { currUser } = useSelector((state) => state.user);
    const [alert, setAlert] = useState({ type : "", message : "" });
    
    if (!currUser) {
        return <div className="flex justify-center items-center h-screen text-xl">Loading...</div>;
    }

    return (
        <div className="max-w-3xl mx-auto p-1">
            {/* Alert Message */}
            <div className="fixed top-14 right-4 z-50 w-[70%] max-w-sm">
                {alert && alert.message && (
                    <Alert type={alert.type} message={alert.message} autoDismiss onClose={() => setAlert(null)} />
                )}
            </div>
            
            {/* Profile Header (Cover Image & Avatar) */}
            <ProfileHeader user={currUser} setAlert={setAlert} />

            {/* Profile Details (Editable Sections) */}
            <ProfileDetails user={currUser} setAlert={setAlert} />

            {/* Change Password Section */}
            <ChangePassword setAlert={setAlert}  />
        </div>
    );
};

export default UserProfile;
