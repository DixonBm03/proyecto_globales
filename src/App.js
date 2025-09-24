import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
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

      <Footer />
    </div>
  );
}
