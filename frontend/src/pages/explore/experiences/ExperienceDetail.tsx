import OwnerExperiences from './OwnerExperiences';
import ExperienceReviews from './ExperienceReviews';
import './all-experiences-card.css';

export default function ExperienceDetail() {
  return (
    <div className="experience-detail-container">
      <h1 className="experience-detail-title">Kelionės patirtys</h1>
      <OwnerExperiences />
      <ExperienceReviews />
    </div>
  );
}
