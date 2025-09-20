import { NavLink } from 'react-router-dom';

export default function Header() {
  return (
    <header className='header'>
      <div className='container header__bar'>
        <div className='brand'>
          <span className='brand__dot' />
          <span>Climate App</span>
        </div>

        <nav className='nav'>
          <NavLink
            to='/'
            end
            className={({ isActive }) => (isActive ? 'active' : undefined)}
          >
            Inicio
          </NavLink>
          <NavLink
            to='/suscripcion'
            className={({ isActive }) => (isActive ? 'active' : undefined)}
          >
            Suscripción
          </NavLink>
          <NavLink
            to='/material'
            className={({ isActive }) => (isActive ? 'active' : undefined)}
          >
            Material
          </NavLink>
          <NavLink
            to='/calidad-del-aire'
            className={({ isActive }) => (isActive ? 'active' : undefined)}
          >
            Calidad del Aire
          </NavLink>
          <NavLink
            to='/pronostico'
            className={({ isActive }) => (isActive ? 'active' : undefined)}
          >
            Pronóstico
          </NavLink>
          <button className='btn'>Iniciar sesión</button>
        </nav>
      </div>
    </header>
  );
}
