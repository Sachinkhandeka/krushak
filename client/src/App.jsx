import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/layout/Navbar.jsx";
import Sidebar from "./components/layout/Sidebar.jsx";
import SuspenseWrapper from "./components/utils/SuspenseWrapper.jsx";
import { useSelector, useDispatch } from "react-redux";
import { toggleSidebar } from "./redux/slices/sidebarSlice";

const Home = React.lazy(() => import("./pages/Home.jsx"));
const Signup = React.lazy(() => import("./pages/auth/Signup.jsx"));
const Login = React.lazy(() => import("./pages/auth/Login.jsx"));
const NotFound = React.lazy(() => import("./pages/NotFound.jsx"));

const App = () => {
    const { isOpen } = useSelector((state) => state.sidebar);
    const dispatch = useDispatch();

    return (
        <Router>
            <div className="relative">
                <Navbar />
                <Sidebar />

                {/* ✅ Blur Effect When Sidebar is Open */}
                {isOpen && (
                    <div 
                        className="fixed inset-0 bg-black opacity-30 backdrop-blur-md z-10"
                        onClick={() => dispatch(toggleSidebar())} // Close sidebar on click
                    ></div>
                )}

                {/* ✅ Main Content */}
                <main className={`transition-all duration-300 ${isOpen ? "blur-sm" : ""}`}>
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
                            path="/equipment"
                            element={
                                <SuspenseWrapper>
                                    <Home />
                                </SuspenseWrapper>
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
                                    <Signup />
                                </SuspenseWrapper>
                            }
                        />
                        <Route
                            path="/login"
                            element={
                                <SuspenseWrapper>
                                    <Login />
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
