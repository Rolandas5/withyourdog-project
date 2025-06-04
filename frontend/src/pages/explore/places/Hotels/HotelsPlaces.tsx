import { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FiMap } from 'react-icons/fi';
import './hotels-places.css';
import { PetPlace } from '../../../../types/typePetPlace';
import UniversalComments from '../../../../components/UniversalComments';
import { AuthContext } from '../context/AuthContext';

export default function HotelsPlaces() {
  const [places, setPlaces] = useState<PetPlace[]>([]);

  useEffect(() => {
    axios
      .get('http://localhost:3001/api/pet-places')
      .then((res) => setPlaces(res.data))
      .catch((err) => console.error('Klaida gaunant duomenis:', err));
  }, []);

  return (
    <section className="hotels-section">
      <h2 className="hotels-heading">Viešbučiai, sodybos ir kempingai</h2>
      <div className="hotels-categories">
        {places.map((place) => (
          <div
            key={place.id}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'stretch',
              width: '100%',
            }}
          >
            <motion.a
              href={place.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hotel-card"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="hotel-img-wrapper">
                <img
                  src={place.image}
                  alt={place.title}
                  className="hotel-img"
                />
              </div>
              <div className="hotel-overlay">
                <h3 className="hotel-title">
                  <FiMap /> {place.title}
                </h3>
                <p className="hotel-desc">{place.description}</p>
                <p className="hotel-location">📍 {place.location}</p>
              </div>
            </motion.a>
            <UniversalComments entityId={place.id} entityType={place.type} />
          </div>
        ))}
      </div>
    </section>
  );
}
