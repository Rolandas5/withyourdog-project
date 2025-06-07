import { useEffect, useState } from 'react';
import PlaceCategoryCard from '../../../../components/places/PlaceCategoryCard';
import './all-experiences-card.css';
import { Experience } from '../../../../types/typesExperience';

export default function AllExperiences() {
  const [experiences, setExperiences] = useState<Experience[]>([]);

  useEffect(() => {
    fetch('http://localhost:3001/api/experiences')
      .then((res) => res.json())
      .then((data) => setExperiences(data));
  }, []);

  return (
    <div className="all-sections-page">
      <h2 className="all-sections-heading">Visi kelionių įrašai</h2>
      <div className="all-sections-categories">
        {experiences.map((exp, index) => (
          <>
            <PlaceCategoryCard
              key={index}
              title={exp.title}
              description={exp.description}
              img={exp.img}
              link={exp.link}
            />
            {!exp.title && (
              <div className="all-sections-bottom-desc">{exp.description}</div>
            )}
          </>
        ))}
      </div>
    </div>
  );
}
