import React from "react";
import { motion } from "framer-motion";

const Loader = ({ size = 40, color = "#ffffff", variant = "dots" }) => {
    return (
        <div className="flex justify-center items-center">
            {variant === "dots" ? (
                <div className="relative" style={{ width: size, height: size }}>
                    {[...Array(8)].map((_, i) => (
                        <motion.span
                            key={i}
                            className="absolute w-1 h-1 bg-green-500 rounded-full"
                            style={{
                                backgroundColor: color,
                                top: "50%",
                                left: "50%",
                                transformOrigin: "center",
                                transform: `rotate(${i * 45}deg) translate(${size / 2}px)`,
                            }}
                            animate={{ opacity: [0.3, 1, 0.3] }}
                            transition={{
                                duration: 1,
                                repeat: Infinity,
                                delay: i * 0.1,
                                ease: "easeInOut",
                            }}
                        />
                    ))}
                </div>
            ) : (
                <motion.div
                    className="border-4 border-t-transparent border-black rounded-full"
                    style={{ width: size, height: size, borderColor: color }}
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                />
            )}
        </div>
    );
};

export default Loader;
