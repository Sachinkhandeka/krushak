import React, { useEffect, useState } from "react";
import { FaCircleCheck, FaCircleInfo } from "react-icons/fa6"; 
import { IoCloseCircleSharp } from "react-icons/io5"; 
import { IoIosWarning } from "react-icons/io"; 

export default function Alert({ type = "info", message, link, linkText = "Click here", autoDismiss = true, duration = 5000, onClose}) {
    const [progress, setProgress] = useState(100);
    const [visible, setVisible] = useState(true);
    const [opacity, setOpacity] = useState("opacity-0");

    const alertStyles = {
        info: {
            bgColor: "bg-blue-50",
            textColor: "text-blue-800",
            borderColor: "border-blue-300",
            progressBarColor: "bg-blue-500",
            darkTextColor: "dark:text-blue-400",
            darkBgColor: "dark:bg-gray-800",
            darkBorderColor: "dark:border-blue-800",
            icon: <FaCircleInfo className="flex-shrink-0 w-5 h-5" />,
        },
        error: {
            bgColor: "bg-red-50",
            textColor: "text-red-800",
            borderColor: "border-red-300",
            progressBarColor: "bg-red-500",
            darkTextColor: "dark:text-red-400",
            darkBgColor: "dark:bg-gray-800",
            darkBorderColor: "dark:border-red-800",
            icon: <IoCloseCircleSharp className="flex-shrink-0 w-5 h-5" />,
        },
        success: {
            bgColor: "bg-green-50",
            textColor: "text-green-800",
            borderColor: "border-green-300",
            progressBarColor: "bg-green-500",
            darkTextColor: "dark:text-green-400",
            darkBgColor: "dark:bg-gray-800",
            darkBorderColor: "dark:border-green-800",
            icon: <FaCircleCheck className="flex-shrink-0 w-5 h-5" />,
        },
        warning: {
            bgColor: "bg-yellow-50",
            textColor: "text-yellow-800",
            borderColor: "border-yellow-300",
            progressBarColor: "bg-yellow-500",
            darkTextColor: "dark:text-yellow-300",
            darkBgColor: "dark:bg-gray-800",
            darkBorderColor: "dark:border-yellow-800",
            icon: <IoIosWarning className="flex-shrink-0 w-5 h-5" />,
        },
        dark: {
            bgColor: "bg-gray-50",
            textColor: "text-gray-800",
            borderColor: "border-gray-300",
            progressBarColor: "bg-gray-500",
            darkTextColor: "dark:text-gray-300",
            darkBgColor: "dark:bg-gray-800",
            darkBorderColor: "dark:border-gray-600",
            icon: null,
        },
    };

    const styles = alertStyles[type] || alertStyles.info;

    useEffect(() => {
        // Trigger fade-in effect
        setOpacity("opacity-100");

        if (autoDismiss) {
            const interval = setInterval(() => {
                setProgress((prev) => {
                    const newValue = prev - 100 / (duration / 100);
                    return newValue > 0 ? newValue : 0;
                });
            }, 100);

            const timeout = setTimeout(() => {
                setProgress(0); 
                setOpacity("opacity-0");
                setTimeout(() => {
                    setVisible(false);
                    if (onClose) onClose();
                }, 500);
            }, duration);

            return () => {
                clearInterval(interval);
                clearTimeout(timeout);
            };
        }
    }, [duration, autoDismiss, onClose]);

    if (!visible) return null;

    return (
        <div
            className={`flex relative items-center p-4 my-4 ${styles.textColor} ${styles.bgColor} border-t-4 ${styles.borderColor} ${styles.darkTextColor} ${styles.darkBgColor} ${styles.darkBorderColor} transition-opacity duration-500 ${opacity}`}
            role="alert"
        >
            {styles.icon && styles.icon}
            <div className="ms-3 text-sm font-medium">
                <span className="font-bold" >" { type } ! " </span>
                {message}{" "}
                {link && (
                    <a href={link} className="font-semibold underline hover:no-underline">{linkText}</a>
                )}
            </div>
            <button
                type="button"
                className="ms-auto -mx-1.5 -my-1.5 rounded-lg focus:ring-2 p-1.5 hover:bg-opacity-50 inline-flex items-center justify-center h-8 w-8"
                onClick={() => {
                    setOpacity("opacity-0"); // Start fade-out
                    setTimeout(() => {
                        setVisible(false);
                        if (onClose) onClose();
                    }, 500); // Duration for fade-out effect
                }}
                aria-label="Close"
            >
                <span className="sr-only">Dismiss</span>
                <svg
                    className="w-3 h-3"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 14"
                >
                    <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                    />
                </svg>
            </button>
            <div
                className={`absolute left-0 top-[-4px] h-1 ${styles.progressBarColor} transition-all duration-1000`}
                style={{ width: `${progress}%` }}
            ></div>
        </div>
    );
}