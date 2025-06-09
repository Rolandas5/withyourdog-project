import { useEffect, useState } from 'react';
import axios from 'axios';
import './health.css';
import { VetClinic } from '../../../../types/typesVetClinic';

export default function Health() {
  const [clinics, setClinics] = useState<VetClinic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    axios
      .get('/api/veterinary-clinics?cities=Marijampolė,Marijampolės r.')
      .then((res) => setClinics(res.data))
      .catch(() => setError('Nepavyko gauti veterinarijos įmonių duomenų'))
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div style={{ textAlign: 'center', marginTop: 40 }}>Kraunama...</div>
    );
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div className="health-container">
      <h2 className="health-title">
        Veterinarijos paslaugos Marijampolės apskrityje
      </h2>
      <div className="health-list">
        {clinics.map((clinic, idx) => (
          <div className="health-card" key={idx}>
            <img
              src={clinic.image || '/images/vet.png'}
              alt={clinic.name}
              className="health-image"
            />
            <div className="health-info">
              <div className="health-name">{clinic.name}</div>
              <div className="health-address">{clinic.address}</div>
              <div className="health-phone">{clinic.phone}</div>
              {clinic.hours && (
                <div className="health-hours">Darbo laikas: {clinic.hours}</div>
              )}
              {clinic.website && (
                <a
                  href={clinic.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="health-website"
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
}
