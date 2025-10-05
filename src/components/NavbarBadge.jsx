// Navbar.jsx (ejemplo mínimo)
import { useState } from 'react';

export function NavbarBadge({ alert }) {
    if (!alert) return null;
    return (
        <span style={{
            marginLeft: 8,
            padding: '2px 8px',
            borderRadius: 999,
            background: '#cc0033',
            color: '#fff',
            fontSize: 12,
            fontWeight: 700
        }}>
      AQI {alert.category} · {alert.aqi}
    </span>
    );
}
