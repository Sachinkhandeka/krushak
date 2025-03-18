import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { fetchWithAuth } from "../utilityFunction";
import { useSelector } from "react-redux";
import { Helmet } from "react-helmet-async";

const Loader = React.lazy(() => import("../components/utils/Loader"));
const Alert = React.lazy(() => import("../components/utils/Alert"));
const NoDataFound = React.lazy(() => import("../components/common/NoDataFound"));
const EquipmentCard = React.lazy(() => import("../components/equipment/EquipmentCard"));

const RecentlyViewedEquipment = () => {
    const { currUser } = useSelector((state) => state.user);
    const navigate = useNavigate();
    const [recentlyViewed, setRecentlyViewed] = useState([]);
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState({ type: "", message: "" });

    const getRecentlyViewedEquipment = async () => {
        if (!currUser) {
            setAlert({ type: "error", message: "Logged in user not found. Please login to see recently viewed equipment." });
            return;
        }

        try {
            const response = await fetchWithAuth(
                `/api/v1/users/${currUser._id}/recently-viewed-equipment`,
                { method: "GET" },
                setLoading,
                setAlert,
                navigate
            );

            if (response) {
                setRecentlyViewed(response?.data.recentlyViewedEquipment || []);
            }
        } catch (error) {
            console.error("Error fetching recently viewed equipment:", error);
            setAlert({ type: "error", message: "Failed to load recently viewed equipment." });
        }
    };

    useEffect(() => {
        if (currUser?._id) {
            getRecentlyViewedEquipment();
        }
    }, [currUser._id]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader />
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4">
            {/* SEO Meta Tags */}
            <Helmet>
                <title>Recently Viewed Equipment - Revisit Your Selections</title>
                <meta name="description" content="Quickly access your recently viewed equipment, tools, and machinery. Stay up to date with your browsing history." />
                <meta name="keywords" content="recently viewed, equipment history, viewed tools, machinery history" />
                <meta name="robots" content="index, follow" />
                <meta property="og:title" content="Recently Viewed Equipment - Revisit Your Selections" />
                <meta property="og:description" content="Track and revisit your recently viewed equipment with ease. Stay updated with your browsing history." />
                <meta property="og:type" content="website" />
                <meta property="og:url" content={window.location.href} />
                <meta property="og:image" content="/assets/recently-viewed-equipment-banner.jpg" />
            </Helmet>

            {/* Alert Message */}
            <div className="fixed top-14 right-4 z-50 w-[70%] max-w-sm">
                {alert && alert.message && (
                    <Alert type={alert.type} message={alert.message} autoDismiss onClose={() => setAlert({ type: "", message: "" })} />
                )}
            </div>

            {recentlyViewed.length === 0 ? (
                <NoDataFound
                    message="No Recently Viewed Equipment"
                    subMessage="Explore more equipment to see them here."
                    action={
                        <Link
                            to={"/"}
                            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                            Browse Equipment
                        </Link>
                    }
                />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {recentlyViewed.map((equipment) => (
                        <EquipmentCard
                            key={equipment._id}
                            item={equipment.equipmentId}
                            setAlert={setAlert}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default RecentlyViewedEquipment;
