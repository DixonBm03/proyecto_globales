import React from 'react';

const Footer = () => {
  return (
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
  );
};

export default Footer;
