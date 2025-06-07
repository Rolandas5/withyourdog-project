import { useEffect, useState } from 'react';
import PlaceCategoryCard from '../../../../components/places/PlaceCategoryCard';
import './all-service-card.css';
import { Service } from '../../../../types/typesService';
import { Link } from 'react-router-dom';

export default function AllServices() {
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    fetch('http://localhost:3001/api/services')
      .then((res) => res.json())
      .then((data) => setServices(data));
  }, []);

  return (
    <div className="all-services-page">
      <h2 className="all-services-heading">
        Kokių paslaugų ieškote savo šuniui?
      </h2>
      <div className="all-services-categories">
        {services.map((service, index) => (
          <PlaceCategoryCard
            key={index}
            title={service.title}
            description={service.description}
            img={service.img}
            link={service.link}
          />
        ))}
      </div>
    </div>
  );
}
