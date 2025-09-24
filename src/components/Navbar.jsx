import { NavLink } from 'react-router-dom';

export default function Navbar() {
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
        <button className='btn'>Iniciar sesión</button>
      </div>
    </header>
  );
}
