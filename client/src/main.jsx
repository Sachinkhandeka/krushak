import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import './index.css'
import App from './App.jsx'
import { persistor, store } from './redux/store.js';
import ThemeProvider from './components/utils/ThemeProvider.jsx';

createRoot(document.getElementById('root')).render(
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