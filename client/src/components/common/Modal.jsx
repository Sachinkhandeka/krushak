import React from "react";
import Loader from "../utils/Loader";

const Modal = ({ isOpen, onClose, onConfirm, title, message, confirmText, cancelText, loading }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-40 bg-opacity-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">{title}</h2>
                <p className="text-gray-700 dark:text-gray-300 mb-6">{message}</p>
                <div className="flex justify-end gap-4">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                    >
                        {cancelText || "Cancel"}
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 cursor-pointer bg-green-600 text-white rounded-md hover:bg-green-700"
                        disabled={loading}
                    >
                        {
                        loading ? 
                        <Loader size={15} color="white" variant="dots" /> :
                        confirmText || "Confirm" }
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Modal;
