import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { MOCKAPI_URL_USERS } from '../data/ mockAqi';

export default function SignUp() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();

    const handleSignUp = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            alert('Las contraseñas no coinciden.');
            return;
        }

        if (username.length < 4 || password.length < 6) {
            alert('El usuario debe tener al menos 4 caracteres y la contraseña 6.');
            return;
        }

        try {
            const mockApiUrl = `${MOCKAPI_URL_USERS}/users`;

            const checkResponse = await fetch(`${mockApiUrl}?username=${username}`);
            const existingUsers = await checkResponse.json();

            if (existingUsers.length > 0) {
                alert('Ese nombre de usuario ya está en uso. Por favor, elige otro.');
                return;
            }

            const registerResponse = await fetch(mockApiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            if (registerResponse.ok) {
                alert('¡Registro exitoso! Ya puedes iniciar sesión con tu nueva cuenta.');
                navigate('/iniciar-sesion'); // Redirige al login para que inicie sesión
            } else {
                alert('Hubo un error al registrar el usuario. Inténtalo de nuevo.');
            }
        } catch (error) {
            console.error('Error de red durante el registro:', error);
            alert('Error de conexión. Verifica tu URL de MockAPI.');
        }
    };

    return (

        <div className="login-container">
            <div className="card login-card">
                <h1 className="h1" style={{ marginBottom: '20px' }}>Crear una cuenta</h1>
                <p className="p" style={{ textAlign: 'center', marginBottom: '30px', color: '#6b7280' }}>
                    Regístrate para acceder al pronóstico extendido y las herramientas de Climate App.
                </p>

                <form onSubmit={handleSignUp} className="login-form">
                    <div className="form-group">
                        <label htmlFor="username">Nombre de Usuario</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            className="input-field"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Contraseña</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="input-field"
                            placeholder="Mínimo 6 caracteres"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirmar Contraseña</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            className="input-field"
                            placeholder="Repite tu contraseña"
                        />
                    </div>

                    <button type="submit" className="button-primary">
                        Registrarme
                    </button>
                </form>

                <p className="p-small">
                    ¿Ya tienes una cuenta? <NavLink to="/Login" className="link-text">Iniciar sesión</NavLink>
                </p>
            </div>
        </div>
    );
}
