import { useEffect, useState } from 'react';
import './AllService/all-service-card.css';

interface VetService {
  id: string;
  name: string;
  description: string;
  location: string;
  image: string;
  url: string;
}

export default function Health() {
  const [clinics, setClinics] = useState<VetService[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Čia gali būti API fetch, dabar - pavyzdiniai duomenys
    setTimeout(() => {
      setClinics([
        {
          id: '1',
          name: 'VetPet klinika',
          description:
            'Moderni veterinarijos klinika Vilniuje, teikianti visas paslaugas augintiniams.',
          location: 'Vilnius, Žirmūnų g. 70',
          image: '/images/vet1.jpg',
          url: 'https://vetpet.lt/',
        },
        {
          id: '2',
          name: 'Šeimos veterinaras',
          description:
            'Draugiška klinika Kaune, skiepai, gydymas, konsultacijos.',
          location: 'Kaunas, Savanorių pr. 123',
          image: '/images/vet2.jpg',
          url: 'https://seimosvet.lt/',
        },
        {
          id: '3',
          name: 'PetHelp',
          description:
            'Pagalba gyvūnams visą parą, skubi pagalba ir chirurgija.',
          location: 'Klaipėda, Taikos pr. 45',
          image: '/images/vet3.jpg',
          url: 'https://pethelp.lt/',
        },
      ]);
      setLoading(false);
    }, 800);
  }, []);

  if (loading)
    return (
      <div style={{ textAlign: 'center', marginTop: 40 }}>Kraunama...</div>
    );
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div className="all-services-container">
      <h2 className="services-title">Veterinarijos paslaugos</h2>
      <div className="services-grid">
        {clinics.map((clinic) => (
          <a
            key={clinic.id}
            href={clinic.url}
            target="_blank"
            rel="noopener noreferrer"
            className="service-card"
            style={{ textDecoration: 'none' }}
          >
            <img src={clinic.image} alt={clinic.name} />
            <h3>{clinic.name}</h3>
            <p>{clinic.description}</p>
            <p style={{ fontWeight: 600, color: '#007bff' }}>
              {clinic.location}
            </p>
          </a>
        ))}
      </div>
    </div>
  );
}
