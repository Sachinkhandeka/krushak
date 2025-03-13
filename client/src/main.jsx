import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import "./index.css";
import App from "./App.jsx";
import { persistor, store } from "./redux/store.js";
import ThemeProvider from "./components/utils/ThemeProvider.jsx";

const rootElement = document.getElementById("root");

// If server-side rendered, hydrate. Otherwise, render normally
if (rootElement.hasChildNodes()) {
    hydrateRoot(
        rootElement,
        <StrictMode>
            <Provider store={store}>
                <PersistGate loading={null} persistor={persistor}>
                    <ThemeProvider>
                        <App />  
                    </ThemeProvider>
                </PersistGate>
            </Provider>
        </StrictMode>
    );
} else {
    createRoot(rootElement).render(
        <StrictMode>
            <Provider store={store}>
                <PersistGate loading={null} persistor={persistor}>
                    <ThemeProvider>
                        <App />  
                    </ThemeProvider>
                </PersistGate>
            </Provider>
        </StrictMode>
    );
}
