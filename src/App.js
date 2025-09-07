import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Forecast from "./pages/Forecast";
import AirQuality from "./pages/AirQuality";
import Material from "./pages/Materials";
import Suscripcion from "./pages/Subscription";
import "./styles.css";

export default function App() {
    return (
        <div className="app-shell">
            <Navbar />
            <main className="container">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/pronostico" element={<Forecast />} />
                    <Route path="/calidad-del-aire" element={<AirQuality />} />
                    <Route path="/material" element={<Material />} />
                    <Route path="/suscripcion" element={<Suscripcion />} />
                </Routes>
            </main>

            <footer className="footer">
                <div className="footer-grid">
                    <div>
                        <div className="dot" /> <strong>Climate App</strong>
                        <p>Datos útiles para entender el clima y actuar.</p>
                    </div>
                    <div>
                        <h4>Proyecto</h4>
                        <a href="/">Acerca</a>
                        <a href="/">Equipo</a>
                        <a href="/">Contacto</a>
                    </div>
                    <div>
                        <h4>Recursos</h4>
                        <a href="/material">Guías</a>
                        <a href="/">API pública</a>
                        <a href="/">FAQ</a>
                    </div>
                    <div>
                        <h4>Legal</h4>
                        <a href="/">Términos</a>
                        <a href="/">Privacidad</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
