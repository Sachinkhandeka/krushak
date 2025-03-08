import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateRoute = ({ children }) => {
    const { currUser } = useSelector((state) => state.user);

    return currUser ? children : <Navigate to="/" replace />;
};

export default PrivateRoute;
