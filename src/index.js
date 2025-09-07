import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AlertProvider } from "./context/AlertContext";
import "./styles.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <React.StrictMode>
        <BrowserRouter>
            <AlertProvider>
                <App />
            </AlertProvider>
        </BrowserRouter>
    </React.StrictMode>
);
