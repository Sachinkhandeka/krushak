import React, { useState, useEffect } from "react";

const Loader = ({ loading }) => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        if (!loading) {
            setProgress(0);
            return;
        }

        let speed = 100; // Initial speed
        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval);
                    return 100;
                }
                if (prev < 30) speed = 200; // Slow start
                if (prev > 50) speed = 50;  // Fast finish
                return prev + 10;
            });
        }, speed);

        return () => clearInterval(interval);
    }, [loading]);

    return (
        <button
            disabled={loading}
            className={`relative flex items-center justify-center w-full px-4 py-2 font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition ${
                loading ? "opacity-75 cursor-not-allowed" : ""
            }`}
        >
            {/* Progress Effect Inside Button */}
            {loading && (
                <div
                    className="absolute left-0 top-0 h-full bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 transition-all ease-out rounded-md"
                    style={{ width: `${progress}%` }}
                ></div>
            )}

            {/* Button Text */}
            <span className="relative z-10">{loading ? "Processing..."  : null}</span>
        </button>
    );
};

export default Loader;
