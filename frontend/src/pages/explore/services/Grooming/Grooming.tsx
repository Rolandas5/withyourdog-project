import { useEffect, useState } from 'react';
import axios from 'axios';
import './Grooming.css';
import { GroomingSalon } from '../../../../types/typesGroomingSalon';

const Grooming = () => {
  const [salons, setSalons] = useState<GroomingSalon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    axios
      .get('/api/grooming-salons')
      .then((res) => setSalons(res.data))
      .catch(() => setError('Nepavyko gauti kirpyklų duomenų'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="grooming-container">
      <h2 className="grooming-heading">
        Šunų kirpyklos Marijampolės apskrityje
      </h2>
      <div className="grooming-title"></div>
      {loading && <div>Kraunama...</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {!loading && !error && salons.length === 0 && (
        <div>Nerasta kirpyklų Marijampolės apskrityje.</div>
      )}
      <div className="grooming-list">
        {salons.map((salon, idx) => (
          <div className="grooming-card" key={idx}>
            <img
              src={salon.image || '/images/grooming.png'}
              alt={salon.name}
              className="grooming-image"
            />
            <div className="grooming-info">
              <div className="grooming-name">{salon.name}</div>
              <div className="grooming-address">{salon.address}</div>
              <div className="grooming-phone">
                Tel.: <a href={`tel:${salon.phone}`}>{salon.phone}</a>
              </div>
              {salon.hours && (
                <div className="grooming-hours">
                  Darbo laikas: {salon.hours}
                </div>
              )}
              {salon.website && (
                <a
                  href={salon.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="grooming-website"
                >
                  Svetainė / Facebook
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Grooming;
