import { useEffect, useState } from 'react';
import './dog-hotels.css';
import { DogHotel } from '../../../../types/typesDogHotel';

export default function DogHotels() {
  const [hotels, setHotels] = useState<DogHotel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:3001/api/dog-hotels?cities=Marijampolė,Kaunas')
      .then((res) => res.json())
      .then((data) => {
        setHotels(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="dog-hotels-loading">Kraunama...</div>;

  return (
    <div className="dog-hotels-page">
      <h2 className="dog-hotels-heading">
        Šunų viešbučiai Marijampolės ir Kauno apskrityse
      </h2>
      <div className="dog-hotels-grid">
        {hotels.map((hotel, i) => (
          <div className="dog-hotel-card" key={i}>
            <img
              src={hotel.image || '/images/dog-hotel.png'}
              alt={hotel.name}
              className="dog-hotel-img"
            />
            <div className="dog-hotel-info">
              <h3>{hotel.name}</h3>
              <p className="dog-hotel-address">{hotel.address}</p>
              <p className="dog-hotel-city">{hotel.city}</p>
              {hotel.phone && <p className="dog-hotel-phone">{hotel.phone}</p>}
              {hotel.hours && <p className="dog-hotel-hours">{hotel.hours}</p>}
              {hotel.website && (
                <a
                  href={hotel.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="dog-hotel-link"
                >
                  Svetainė
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
