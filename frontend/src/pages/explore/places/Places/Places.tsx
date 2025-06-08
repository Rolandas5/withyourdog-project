import { useEffect, useState } from 'react';
import axios from 'axios';
import PlaceCategoryCard from '../../../../components/places/PlaceCategoryCard';
import './places-page.css';

export default function Places() {
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    axios.get('/api/place-categories').then((res) => setCategories(res.data));
  }, []);

  return (
    <div className="places-page">
      <div className="places-heading-bg">
        <h2 className="places-heading">Kur keliausite su šunimi?</h2>
      </div>
      <div className="places-categories">
        {categories.map((cat) => (
          <PlaceCategoryCard key={cat._id} {...cat} />
        ))}
      </div>
    </div>
  );
}
