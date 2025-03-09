import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/layout/Navbar.jsx";
import Sidebar from "./components/layout/Sidebar.jsx";
import SuspenseWrapper from "./components/utils/SuspenseWrapper.jsx";
import { useSelector, useDispatch } from "react-redux";
import { toggleSidebar } from "./redux/slices/sidebarSlice";
import PrivateRoute from "./components/layout/PrivateRoute.jsx";

const Home = React.lazy(() => import("./pages/Home.jsx"));
const AuthModal = React.lazy(()=> import("./pages/auth/AuthModal.jsx"));
const ForgotPassword = React.lazy(()=> import("./pages/auth/ForgotPassword.jsx"));
const AddEquipment = React.lazy(()=> import("./pages/AddEquipment.jsx"));
const ResetPassword = React.lazy(()=> import("./pages/auth/ResetPassword.jsx"));
const NotFound = React.lazy(() => import("./pages/NotFound.jsx"));
const EquipmentDetail = React.lazy(()=> import("./pages/EquipmentDetail.jsx"));
const MyEquipments = React.lazy(()=> import("./pages/MyEquipments.jsx"));

const App = () => {
    const { isOpen } = useSelector((state) => state.sidebar);
    const dispatch = useDispatch();

    return (
        <Router>
            <div className="relative">
                <Navbar />
                <Sidebar />

                {/*  Blur Effect When Sidebar is Open */}
                {isOpen && (
                    <div 
                        className="fixed inset-0 bg-black opacity-30 backdrop-blur-md z-10"
                        onClick={() => dispatch(toggleSidebar())} // Close sidebar on click
                    ></div>
                )}

                {/*  Main Content */}
                <main className={`transition-all duration-300 mx-2 ${isOpen ? "blur-sm" : ""}`}>
                    <Routes>
                        <Route
                            path="/"
                            element={
                                <SuspenseWrapper>
                                    <Home />
                                </SuspenseWrapper>
                            }
                        />
                        <Route
                            path="/:id/my-equipments"
                            element={
                                <PrivateRoute>
                                    <SuspenseWrapper>
                                        <MyEquipments />
                                    </SuspenseWrapper>
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/about"
                            element={
                                <SuspenseWrapper>
                                    <Home />
                                </SuspenseWrapper>
                            }
                        />
                        <Route
                            path="/contact"
                            element={
                                <SuspenseWrapper>
                                    <Home />
                                </SuspenseWrapper>
                            }
                        />
                        <Route
                            path="/signup"
                            element={
                                <SuspenseWrapper>
                                    <AuthModal />
                                </SuspenseWrapper>
                            }
                        />
                        <Route
                            path="/login"
                            element={
                                <SuspenseWrapper>
                                    <AuthModal />
                                </SuspenseWrapper>
                            }
                        />
                        <Route
                            path="/forgot-password"
                            element={
                                <SuspenseWrapper>
                                    <ForgotPassword />
                                </SuspenseWrapper>
                            }
                        />
                        <Route
                            path="/reset-password/:token"
                            element={
                                <SuspenseWrapper>
                                    <ResetPassword />
                                </SuspenseWrapper>
                            }
                        />
                        <Route
                            path="/register-equipment"
                            element={
                                <PrivateRoute>
                                    <SuspenseWrapper>
                                        <AddEquipment />
                                    </SuspenseWrapper>
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/equipment/:id"
                            element={
                                <SuspenseWrapper>
                                    <EquipmentDetail />
                                </SuspenseWrapper>
                            }
                        />
                        <Route
                            path="*"
                            element={
                                <SuspenseWrapper>
                                    <NotFound />
                                </SuspenseWrapper>
                            }
                        />
                    </Routes>
                </main>
            </div>
        </Router>
    );
};

export default App;
