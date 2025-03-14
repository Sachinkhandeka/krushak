import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { fetchWithAuth } from "../utilityFunction";
import Alert from "../components/utils/Alert";
import Loader from "../components/utils/Loader";
import NoDataFound from "../components/common/NoDataFound";
import EquipmentCard from "../components/equipment/EquipmentCard";
import { useSelector } from "react-redux";
import { Helmet } from "react-helmet-async";

const Favorites = () => {
    const navigate = useNavigate();
    const { currUser } = useSelector((state) => state.user);
    const [favoriteEquipments, setFavoriteEquipments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState({ type: "", message: "" });

    const getUserFavoriteEquipments = async () => {
        try {
            const response = await fetchWithAuth(
                `/api/v1/users/${currUser._id}/favorites`, 
                { method: "GET" },
                setLoading,
                setAlert,
                navigate
            );

            if (response) {
                setFavoriteEquipments(response?.data?.favorites || []);
            }
        } catch (error) {
            console.error("Error fetching favorite equipments:", error);
            setAlert({ type: "error", message: "Failed to load favorite equipments." });
        }
    };

    useEffect(() => {
        if (currUser._id) {
            getUserFavoriteEquipments();
        }
    }, [currUser._id, currUser.favorites]);

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
                <title>Favorite Equipments - Save & Access Your Top Picks</title>
                <meta name="description" content="Explore your favorite equipment, manage saved items, and easily access top-rated machinery, tools, and accessories. Stay organized and never lose track of your favorites." />
                <meta name="keywords" content="favorite equipment, saved items, top machinery, best tools, equipment collection, equipment wishlist" />
                <meta name="robots" content="index, follow" />
                <meta property="og:title" content="Favorite Equipments - Save & Access Your Top Picks" />
                <meta property="og:description" content="Manage and access your favorite equipment collection easily. Keep track of top-rated tools and machinery in one place." />
                <meta property="og:type" content="website" />
                <meta property="og:url" content={window.location.href} />
                <meta property="og:image" content="/assets/favorite-equipment-banner.jpg" />
            </Helmet>

            {/* Alert Message */}
            <div className="fixed top-14 right-4 z-50 w-[70%] max-w-sm">
                {alert && alert.message && (
                    <Alert type={alert.type} message={alert.message} autoDismiss onClose={() => setAlert({ type: "", message: "" })} />
                )}
            </div>

            {favoriteEquipments.length === 0 ? (
                <NoDataFound
                    message="No Favorite Equipments Available"
                    subMessage="Check back later or add new favorite equipment."
                    action={
                        <Link
                            to={"/"}
                            className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
                            Browse Equipment
                        </Link>
                    }
                />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {favoriteEquipments.map((equipment) => (
                        <EquipmentCard
                            key={equipment._id}
                            item={equipment}
                            setAlert={setAlert}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Favorites;
