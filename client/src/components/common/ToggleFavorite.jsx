import React, { useState, useEffect } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { motion } from "framer-motion";
import { fetchWithAuth } from "../../utilityFunction";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const ToggleFavorite = ({ itemId, isInitiallyFavorite, setAlert }) => {
    const navigate = useNavigate();
    const { currUser } = useSelector((state) => state.user);
    const [isFavorite, setIsFavorite] = useState(isInitiallyFavorite);
    const [animating, setAnimating] = useState(false);
    const [loading, setLoading] = useState(false);

    // ✅ Sync state with updated props
    useEffect(() => {
        setIsFavorite(isInitiallyFavorite);
    }, [isInitiallyFavorite]);

    const handleFavoriteToggle = async (e) => {
        e.stopPropagation();
        if (!currUser) {
            return setAlert({ type: "error", message: "You need to log in to favorite an item." });
        }

        setAnimating(true);
        try {
            const response = await fetchWithAuth(
                `/api/v1/users/${currUser._id}/favorite/${itemId}`,
                { method: "PUT" },
                setLoading,
                setAlert,
                navigate,
            );

            if (response.success) {
                setIsFavorite((prev) => !prev);
                setAlert({
                    type: "success",
                    message: isFavorite ? "Removed from favorites" : "Added to favorites",
                });
            }
        } catch (error) {
            setAlert({ type: "error", message: "Failed to update favorites." });
        } finally {
            setTimeout(() => setAnimating(false), 500);
        }
    };

    return (
        <motion.button
            className="absolute top-3 right-3 z-20 cursor-pointer"
            whileTap={{ scale: 0.8 }}
            whileHover={{ scale: 1.2 }}
            onClick={handleFavoriteToggle}
        >
            {isFavorite ? (
                <motion.div
                    initial={{ scale: 0.8, opacity: 0.6 }}
                    animate={{ scale: animating ? [1.2, 1, 1.2] : 1, opacity: 1 }}
                    transition={{ duration: 0.4, ease: "easeInOut", repeat: animating ? Infinity : 0 }}
                >
                    <FaHeart className="text-red-500 text-3xl drop-shadow-lg" />
                </motion.div>
            ) : (
                <motion.div
                    initial={{ scale: 0.8, opacity: 0.6 }}
                    animate={{ scale: animating ? [1, 1.2, 1] : 1, opacity: 1 }}
                    transition={{ duration: 0.4, ease: "easeInOut", repeat: animating ? Infinity : 0 }}
                >
                    <FaRegHeart className="text-gray-700 text-3xl drop-shadow-lg" />
                </motion.div>
            )}
        </motion.button>
    );
};

export default ToggleFavorite;
