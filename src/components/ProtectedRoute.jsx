import React from 'react';

export default function ProtectedRoute({ children }) {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

    if (!isAuthenticated) {
        return (
            <main className='container access-denied'>
                <div className='card card--pad' style={{ textAlign: 'center' }}>
                    <h2 style={{ color: '#ef4444' }}>Acceso Restringido 🛑</h2>
                    <p style={{ fontSize: '18px', marginBottom: '20px' }}>
                        Debes iniciar sesión para ver el contenido de esta página.
                    </p>
                    <a href="/Login" className='button-primary' style={{ textDecoration: 'none', display: 'inline-block' }}>
                        Ir a Iniciar Sesión
                    </a>
                </div>
            </main>
        );
    }

    return children;
}