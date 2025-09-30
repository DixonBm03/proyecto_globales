import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkLoginStatus = () => {
      setIsLoggedIn(localStorage.getItem('isAuthenticated') === 'true');
    };

    window.addEventListener('storage', checkLoginStatus);
    checkLoginStatus(); // Llamada inicial al montar el componente

    return () => {
      window.removeEventListener('storage', checkLoginStatus);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('currentUsername');

    setIsLoggedIn(false);

    alert('Sesión cerrada correctamente.');
    navigate('/');
  };

  return (
      <header className='navbar'>
        <div className='nav-inner'>
          <div className='brand'>
            <span className='dot' /> Climate App
          </div>
          <nav>
            <NavLink to='/' className='nav-link'>
              Inicio
            </NavLink>
            <NavLink to='/suscripcion' className='nav-link'>
              Suscripción
            </NavLink>
            <NavLink to='/material' className='nav-link'>
              Material
            </NavLink>
            <NavLink to='/calidad-del-aire' className='nav-link'>
              Calidad del Aire
            </NavLink>
            <NavLink to='/pronostico' className='nav-link'>
              Pronóstico
            </NavLink>
          </nav>

          {isLoggedIn ? (
              <button
                  className='btn btn-logout'
                  onClick={handleLogout}
              >
                Cerrar sesión
              </button>
          ) : (
              <NavLink to='/Login' className='btn'>
                Iniciar sesión
              </NavLink>
          )}
        </div>
      </header>
  );
}