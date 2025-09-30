import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Forecast from './pages/Forecast';
import AirQuality from './pages/AirQuality';
import Material from './pages/Materials';
import Suscripcion from './pages/Subscription';
import Login from './pages/Login';
import SignUp from './pages/SignUp';

import './styles.css';

export default function App() {
    return (
        <div className='app-shell'>
            <Navbar />
            <Routes>

                <Route path='/' element={<Home />} />

                <Route
                    path='/Login'
                    element={
                        <main className='login-container'>
                            <Login />
                        </main>
                    }
                />
                <Route
                    path='/SignUp'
                    element={
                        <main className='login-container'>
                            <SignUp />
                        </main>
                    }
                />

                <Route
                    path='/pronostico'
                    element={
                        <ProtectedRoute>
                            <main className='container'>
                                <Forecast />
                            </main>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path='/calidad-del-aire'
                    element={
                        <ProtectedRoute>
                            <main className='container'>
                                <AirQuality />
                            </main>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path='/material'
                    element={
                        <ProtectedRoute>
                            <main className='container'>
                                <Material />
                            </main>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path='/suscripcion'
                    element={
                        <ProtectedRoute>
                            <main className='container'>
                                <Suscripcion />
                            </main>
                        </ProtectedRoute>
                    }
                />

                <Route path="*" element={<Navigate to="/" />} />
            </Routes>

            <Footer />
        </div>
    );
}
