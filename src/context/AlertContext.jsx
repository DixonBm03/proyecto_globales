import React, { createContext, useContext, useEffect, useState } from "react";

const AlertContext = createContext(null);

export function AlertProvider({ children }) {
    const [email, setEmail] = useState(() => localStorage.getItem("alertEmail") || "");
    const [enabled, setEnabled] = useState(() => localStorage.getItem("alertsEnabled") === "true");

    useEffect(() => { localStorage.setItem("alertEmail", email || ""); }, [email]);
    useEffect(() => { localStorage.setItem("alertsEnabled", enabled ? "true" : "false"); }, [enabled]);

    const value = { email, setEmail, enabled, setEnabled };
    return <AlertContext.Provider value={value}>{children}</AlertContext.Provider>;
}

/** Hook seguro: si olvidamos el Provider, no rompe la app */
export function useAlerts() {
    const ctx = useContext(AlertContext);
    if (ctx == null) {
        return {
            email: "",
            setEmail: () => {},
            enabled: false,
            setEnabled: () => {},
        };
    }
    return ctx;
}
