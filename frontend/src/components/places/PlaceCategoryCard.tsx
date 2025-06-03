import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiSun, FiHome, FiMap } from 'react-icons/fi';
import './place-category-card.css';

interface PlaceCategoryCardProps {
  title: string;
  description: string;
  img: string;
  link: string;
}

const getIcon = (title: string) => {
  if (title.toLowerCase().includes('viešbuč')) return <FiHome />;
  if (title.toLowerCase().includes('paplūdim')) return <FiSun />;
  return <FiMap />; // numatytoji
};

export default function PlaceCategoryCard({
  title,
  description,
  img,
  link,
}: PlaceCategoryCardProps) {
  const isMobile = window.innerWidth <= 768;

  return (
    <motion.div
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.97 }}
      initial={isMobile ? { opacity: 0, x: -40 } : { opacity: 0, y: 30 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="place-category-card"
    >
      <Link to={link} className="place-category-link">
        <div className="place-category-img-wrapper">
          <img src={img} alt={title} className="place-category-img" />
          <div className="place-category-overlay">
            <h3 className="place-category-title">
              {getIcon(title)}
              <span>{title}</span>
            </h3>
            <p className="place-category-desc">{description}</p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
