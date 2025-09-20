import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Forecast from './pages/Forecast';
import AirQuality from './pages/AirQuality';
import Material from './pages/Materials';
import Suscripcion from './pages/Subscription';
import './styles.css';

export default function App() {
  return (
    <div className='app-shell'>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route
          path='/pronostico'
          element={
            <main className='container'>
              <Forecast />
            </main>
          }
        />
        <Route
          path='/calidad-del-aire'
          element={
            <main className='container'>
              <AirQuality />
            </main>
          }
        />
        <Route
          path='/material'
          element={
            <main className='container'>
              <Material />
            </main>
          }
        />
        <Route
          path='/suscripcion'
          element={
            <main className='container'>
              <Suscripcion />
            </main>
          }
        />
      </Routes>

      <footer className='footer'>
        <div className='footer-grid'>
          <div>
            <div className='dot' /> <strong>Climate App</strong>
            <p>Datos útiles para entender el clima y actuar.</p>
          </div>
          <div>
            <h4>Proyecto</h4>
            <a href='/'>Acerca</a>
            <a href='/'>Equipo</a>
            <a href='/'>Contacto</a>
          </div>
          <div>
            <h4>Recursos</h4>
            <a href='/material'>Guías</a>
            <a href='/'>API pública</a>
            <a href='/'>FAQ</a>
          </div>
          <div>
            <h4>Datos</h4>
            <a
              href='https://open-meteo.com/'
              target='_blank'
              rel='noopener noreferrer'
            >
              Open-Meteo
            </a>
            <a
              href='https://www.openstreetmap.org/'
              target='_blank'
              rel='noopener noreferrer'
            >
              OpenStreetMap
            </a>
          </div>
          <div>
            <h4>Legal</h4>
            <a href='/'>Términos</a>
            <a href='/'>Privacidad</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
