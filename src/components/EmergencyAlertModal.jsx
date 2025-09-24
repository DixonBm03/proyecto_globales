import React, { useState, useEffect } from 'react';
import Modal from './Modal';

const EmergencyAlertModal = ({ weatherData, alerts = [] }) => {
  const [showModal, setShowModal] = useState(false);
  const [emergencyConditions, setEmergencyConditions] = useState([]);

  // Function to detect emergency conditions
  const detectEmergencyConditions = (weather, apiAlerts) => {
    const conditions = [];

    if (!weather) return conditions;

    // Extreme temperature conditions
    if (weather.temperature >= 40) {
      conditions.push({
        type: 'extreme-heat',
        severity: 'critical',
        title: '�� Ola de Calor Extrema',
        message: `Temperatura crítica: ${weather.temperature}°C`,
        description:
          'Riesgo extremo de golpe de calor. Evite actividades al aire libre.',
        actions: [
          'Busque refugio inmediatamente',
          'Manténgase hidratado',
          'Use ropa ligera y clara',
          'Evite el sol entre 10 AM - 4 PM',
        ],
      });
    } else if (weather.temperature <= -10) {
      conditions.push({
        type: 'extreme-cold',
        severity: 'critical',
        title: '❄️ Frío Extremo',
        message: `Temperatura peligrosa: ${weather.temperature}°C`,
        description: 'Riesgo de hipotermia y congelación.',
        actions: [
          'Busque refugio inmediatamente',
          'Use múltiples capas de ropa',
          'Evite la exposición prolongada',
          'Mantenga extremidades cubiertas',
        ],
      });
    }

    // Extreme UV conditions
    if (weather.uvIndex >= 11) {
      conditions.push({
        type: 'extreme-uv',
        severity: 'critical',
        title: '☀️ Radiación UV Extrema',
        message: `Índice UV crítico: ${weather.uvIndex.toFixed(1)}`,
        description: 'Riesgo extremo de quemaduras y cáncer de piel.',
        actions: [
          'Evite completamente el sol',
          'Use protector solar SPF 50+',
          'Use ropa protectora',
          'Busque sombra constante',
        ],
      });
    }

    // Extreme wind conditions
    if (weather.windspeed >= 25) {
      conditions.push({
        type: 'extreme-wind',
        severity: 'critical',
        title: '💨 Vientos Extremos',
        message: `Velocidad del viento peligrosa: ${weather.windspeed} km/h`,
        description: 'Riesgo de objetos voladores y dificultad para caminar.',
        actions: [
          'Evite áreas abiertas',
          'Busque refugio sólido',
          'Evite conducir',
          'Manténgase alejado de árboles',
        ],
      });
    }

    // Very low wind (air quality emergency) - Only trigger for truly stagnant conditions
    if (weather.windspeed < 0.5) {
      conditions.push({
        type: 'air-quality-emergency',
        severity: 'critical',
        title: '🌫️ Emergencia Calidad del Aire',
        message: 'Viento prácticamente nulo',
        description: 'Contaminación del aire extremadamente alta.',
        actions: [
          'Evite salir de casa',
          'Use purificadores de aire',
          'Mantenga ventanas cerradas',
          'Personas con asma: use medicación',
        ],
      });
    }

    // API Weather Alerts (from Open-Meteo)
    if (apiAlerts && apiAlerts.length > 0) {
      apiAlerts.forEach(alert => {
        conditions.push({
          type: 'api-alert',
          severity: 'critical',
          title: `⚠️ ${alert.text}`,
          message: alert.action || 'Alerta meteorológica oficial',
          description: 'Alerta oficial emitida por servicios meteorológicos.',
          actions: [
            'Siga las instrucciones oficiales',
            'Manténgase informado',
            'Prepare un plan de emergencia',
            'Evite actividades de riesgo',
          ],
        });
      });
    }

    return conditions;
  };

  // Check for emergency conditions when weather data changes
  useEffect(() => {
    const emergencyConditions = detectEmergencyConditions(weatherData, alerts);
    setEmergencyConditions(emergencyConditions);

    // Show modal if there are critical conditions
    if (emergencyConditions.length > 0) {
      setShowModal(true);
    }
  }, [weatherData, alerts]);

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleAcknowledge = () => {
    setShowModal(false);
    // You could add logic here to track that user acknowledged the alert
    console.log('Emergency alert acknowledged');
  };

  if (emergencyConditions.length === 0) {
    return null;
  }

  return (
    <Modal
      open={showModal}
      onClose={handleCloseModal}
      title='🚨 ALERTA DE EMERGENCIA METEOROLÓGICA'
    >
      <div className='emergency-alert-content'>
        {emergencyConditions.map((condition, index) => (
          <div
            key={index}
            className={`emergency-condition ${condition.severity}`}
          >
            <div className='emergency-header'>
              <h4 className='emergency-title'>{condition.title}</h4>
              <div className='emergency-message'>{condition.message}</div>
            </div>

            <div className='emergency-description'>{condition.description}</div>

            <div className='emergency-actions'>
              <h5>Acciones Inmediatas:</h5>
              <ul>
                {condition.actions.map((action, actionIndex) => (
                  <li key={actionIndex}>{action}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}

        <div className='emergency-footer'>
          <button
            className='emergency-acknowledge-btn'
            onClick={handleAcknowledge}
          >
            Entendido - He leído la alerta
          </button>
          <div className='emergency-note'>
            <small>
              ⚠️ Esta es una alerta de emergencia. Tome las precauciones
              necesarias inmediatamente.
            </small>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default EmergencyAlertModal;
