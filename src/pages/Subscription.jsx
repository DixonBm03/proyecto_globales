import { useAlerts } from '../context/AlertContext';

export default function Suscripcion() {
  const { email, setEmail, enabled, setEnabled } = useAlerts();

  const save = e => {
    e.preventDefault();
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      alert('Ingresa un correo válido');
      return;
    }
    alert(
      '¡Suscripción guardada! Te enviaremos alertas cuando el AQI sea riesgoso.'
    );
  };

  return (
    <section className='page'>
      <h1>Suscripción a alertas</h1>
      <p className='lead'>
        Recibe un correo cuando el indicador esté en <b>No recomendable</b> o{' '}
        <b>Muy peligroso</b>.
      </p>

      <form className='card form' onSubmit={save}>
        <label>
          Correo electrónico
          <input
            type='email'
            placeholder='tucorreo@ejemplo.com'
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </label>

        <label className='row'>
          <input
            type='checkbox'
            checked={enabled}
            onChange={e => setEnabled(e.target.checked)}
          />
          Activar alertas por correo
        </label>

        <button className='btn' type='submit'>
          Guardar
        </button>

        <p className='hint'>
          Para enviar correos se usa EmailJS. Configura las claves en{' '}
          <code>.env</code> y personaliza la plantilla.
        </p>
      </form>
    </section>
  );
}
