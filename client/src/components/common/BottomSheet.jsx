import React, { useState, useRef, useEffect } from "react";

const EquipmentList = React.lazy(()=> import("../equipment/EquipmentList"));

const BottomSheet = ({ equipmentResults, setAlert }) => {
    const [isExpanded, setIsExpanded] = useState(false); 
    const bottomSheetRef = useRef(null);
    const dragHandleRef = useRef(null);

    useEffect(() => {
        const bottomSheet = bottomSheetRef.current;
        if (!bottomSheet) return;

        let startY, currentY;
        const minHeight = window.innerHeight * 0.1; 
        const maxHeight = window.innerHeight * 0.85; 

        const startDrag = (y) => {
            startY = y;
            bottomSheet.style.transition = "none";
            document.body.classList.add("select-none");
        };

        const onDrag = (y) => {
            currentY = y;
            let newHeight = window.innerHeight - currentY;
            newHeight = Math.max(minHeight, Math.min(newHeight, maxHeight));
            bottomSheet.style.height = `${newHeight}px`;
        };

        const endDrag = () => {
            bottomSheet.style.transition = "height 0.3s ease-in-out";
            document.body.classList.remove("select-none");

            if (currentY < window.innerHeight / 2) {
                setIsExpanded(true);
                bottomSheet.style.height = `${maxHeight}px`;
            } else {
                setIsExpanded(false);
                bottomSheet.style.height = `${minHeight}px`;
            }
        };

        // Touch Events (Mobile)
        const handleTouchStart = (e) => startDrag(e.touches[0].clientY);
        const handleTouchMove = (e) => onDrag(e.touches[0].clientY);
        const handleTouchEnd = () => endDrag();

        // Mouse Events (Desktop)
        const handleMouseDown = (e) => {
            startDrag(e.clientY);
            document.addEventListener("mousemove", handleMouseMove);
            document.addEventListener("mouseup", handleMouseUp);
        };

        const handleMouseMove = (e) => onDrag(e.clientY);
        const handleMouseUp = () => {
            endDrag();
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        };

        // Attach event listeners
        dragHandleRef.current.addEventListener("touchstart", handleTouchStart);
        dragHandleRef.current.addEventListener("touchmove", handleTouchMove);
        dragHandleRef.current.addEventListener("touchend", handleTouchEnd);
        dragHandleRef.current.addEventListener("mousedown", handleMouseDown);

        return () => {
            if (dragHandleRef.current) {
                dragHandleRef.current.removeEventListener("touchstart", handleTouchStart);
                dragHandleRef.current.removeEventListener("touchmove", handleTouchMove);
                dragHandleRef.current.removeEventListener("touchend", handleTouchEnd);
                dragHandleRef.current.removeEventListener("mousedown", handleMouseDown);
            }
        };
    }, []);

    return (
        <div
            ref={bottomSheetRef}
            className="absolute bottom-0 left-0 right-0 w-full bg-white dark:bg-gray-800 rounded-t-2xl z-10 transition-all duration-300 flex flex-col"
            style={{ height: isExpanded ? "90vh" : "20vh" }} 
        >
            {/* Drag Handle */}
            <div ref={dragHandleRef} className="w-full flex justify-center bg-white dark:bg-gray-800 py-2 cursor-pointer select-none">
                <div className="w-12 h-1.5 bg-gray-400 rounded-full"></div>
            </div>

            {/* Equipment List - Ensuring it takes full remaining height */}
            <div className="flex-1 flex flex-col overflow-hidden scroll-hidden min-h-screen bg-white dark:bg-gray-800">
                {/* Ensure the list fills the remaining space */}
                <div className="flex-1 overflow-y-auto scroll-hidden">
                    <EquipmentList equipmentResults={equipmentResults} setAlert={setAlert} />
                </div>
            </div>
        </div>
    );
};

export default BottomSheet;
