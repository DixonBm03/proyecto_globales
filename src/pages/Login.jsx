import React, { useState } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { MOCKAPI_URL_USERS } from '../data/ mockAqi';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async e => {
    e.preventDefault();

    try {
      const mockApiUrl = `${MOCKAPI_URL_USERS}/users`;
      const url = `${mockApiUrl}?username=${username}&password=${password}`;

      const response = await fetch(url);
      const users = await response.json();

      if (response.ok && users.length === 1) {
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('currentUsername', username);

        alert(`¡Bienvenido, ${username}!`);

        window.location.href = '/inicio';
      } else {
        alert(
          'Credenciales inválidas. Verifica tu usuario y contraseña, o regístrate.'
        );
      }
    } catch (error) {
      console.error('Error de red durante el login:', error);
      alert('Error de conexión. Inténtalo de nuevo más tarde.');
    }
  };

  return (
    <div className='login-container'>
      <div className='card login-card'>
        <h1 className='h1' style={{ marginBottom: '20px' }}>
          Iniciar sesión
        </h1>
        <p
          className='p'
          style={{
            textAlign: 'center',
            marginBottom: '30px',
            color: '#6b7280',
          }}
        >
          Ingresa tus credenciales para acceder a todas las funciones de Climate
          App.
        </p>

        <form onSubmit={handleLogin} className='login-form'>
          <div className='form-group'>
            <label htmlFor='username'>Usuario</label>
            <input
              type='text'
              id='username'
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
              className='input-field'
              placeholder='Tu nombre de usuario'
            />
          </div>

          <div className='form-group'>
            <label htmlFor='password'>Contraseña</label>
            <input
              type='password'
              id='password'
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className='input-field'
              placeholder='Tu contraseña secreta'
            />
          </div>

          <button type='submit' className='button-primary'>
            Entrar
          </button>
        </form>

        <p className='p-small'>
          ¿No tienes una cuenta?{' '}
          <NavLink to='/SignUp' className='link-text'>
            Regístrate aquí
          </NavLink>
        </p>
      </div>
    </div>
  );
}
