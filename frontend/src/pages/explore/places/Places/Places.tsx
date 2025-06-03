import PlaceCategoryCard from '../../../../components/places/PlaceCategoryCard';
import './places-page.css';

const categories = [
  {
    title: 'Viešbučiai, sodybos, kempingai',
    description: 'Aplankyk geriausius būstus su savo augintiniu.',
    img: '/assets/places/hotels-dog.png',
    link: '/places/hotels',
  },
  {
    title: 'Paplūdimiai',
    description: 'Atrask draugiškus šunims paplūdimius ir poilsio vietas.',
    img: '/assets/places/beaches-dog.png',
    link: '/places/beaches',
  },
  {
    title: 'Parkai ir kitos vietos',
    description: 'Mėgaukis gamta kartu su šunimi parkuose ir lauko zonose.',
    img: '/assets/places/parks-dog.png',
    link: '/places/parks',
  },
];

export default function PlacesPage() {
  return (
    <div className="places-page">
      <h2 className="places-heading">Kur keliausite su šunimi?</h2>
      <div className="places-categories">
        {categories.map((cat) => (
          <PlaceCategoryCard key={cat.title} {...cat} />
        ))}
      </div>
    </div>
  );
}
