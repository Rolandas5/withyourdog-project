import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  FiSun,
  FiHome,
  FiMap,
  FiScissors,
  FiFileText,
  FiPlusCircle,
} from 'react-icons/fi';
import { GiSyringe, GiJumpingDog } from 'react-icons/gi';
import { FaComments, FaBookOpen } from 'react-icons/fa';
import './place-category-card.css';

interface PlaceCategoryCardProps {
  title: string;
  description: string;
  img: string;
  link: string;
}

const getIcon = (title: string) => {
  const t = title.toLowerCase();
  if (t.includes('patirtis') && t.includes('įspūdžiai'))
    return (
      <span
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: 0,
        }}
      >
        <FaComments style={{ fontSize: 32, marginBottom: 2 }} />
        <FaBookOpen style={{ fontSize: 32, marginTop: 2 }} />
      </span>
    );
  if (t.includes('kirpykl')) return <FiScissors />;
  if (title === 'Viešbučiai, sodybos, kempingai')
    return (
      <FiHome
        style={{
          fontSize: '2rem',
          color: '#fff',
          filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.18))',
        }}
      />
    );
  if (t.includes('viešbuč'))
    return (
      <FiHome
        style={{
          color: '#fff',
          filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.18))',
        }}
      />
    );
  if (t.includes('veterinar')) return <GiSyringe />;
  if (t.includes('draudim')) return <FiFileText />;
  if (t.includes('dresuot')) return <GiJumpingDog />;
  if (t.includes('sveikata')) return <FiPlusCircle />;
  if (t.includes('paplūdim')) return <FiSun />;
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
