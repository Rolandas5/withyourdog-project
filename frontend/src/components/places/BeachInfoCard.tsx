import { FaMapMarkerAlt } from 'react-icons/fa';
import { MdBeachAccess } from 'react-icons/md';
import './place-category-card.css';

interface BeachInfoCardProps {
  country: string;
  city: string;
  title: string;
  location?: string;
  infrastructure?: string;
  note?: string;
  sources?: string[];
  img?: string;
}

export default function BeachInfoCard({
  country,
  city,
  title,
  location,
  infrastructure,
  note,
  sources,
  img,
}: BeachInfoCardProps) {
  return (
    <div
      className="place-category-card"
      style={{
        maxWidth: 340,
        minHeight: 380,
        borderRadius: 22,
        boxShadow: '0 8px 32px rgba(44, 62, 80, 0.18)',
        background: 'linear-gradient(135deg, #e0f7fa 0%, #f5f8fa 100%)',
        margin: '0 auto',
        transition: 'box-shadow 0.2s',
        overflow: 'hidden',
        border: '1.5px solid #e3eaf2',
        position: 'relative',
      }}
    >
      <div
        className="place-category-img-wrapper"
        style={{
          height: 120,
          background: img
            ? undefined
            : 'linear-gradient(120deg, #b2ebf2 0%, #e0f7fa 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {img ? (
          <img
            src={img}
            alt={title}
            className="place-category-img"
            style={{
              height: 120,
              width: '100%',
              objectFit: 'cover',
              borderTopLeftRadius: 22,
              borderTopRightRadius: 22,
            }}
          />
        ) : (
          <MdBeachAccess
            style={{ fontSize: 48, color: '#4fc3f7', opacity: 0.7 }}
          />
        )}
      </div>
      <div
        className="place-category-overlay"
        style={{
          background: 'none',
          position: 'static',
          color: '#1a237e',
          padding: '18px 18px 14px 18px',
          minHeight: 260,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
        }}
      >
        <h3
          className="place-category-title"
          style={{
            marginBottom: 10,
            color: '#1976d2',
            background: 'none',
            textShadow: '0 2px 8px rgba(33, 150, 243, 0.08)',
            padding: 0,
            fontSize: '1.25rem',
            fontWeight: 800,
            letterSpacing: '0.01em',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <FaMapMarkerAlt
            style={{ color: '#ffb300', fontSize: 20, marginRight: 4 }}
          />
          <span style={{ textTransform: 'uppercase', letterSpacing: '0.03em' }}>
            {title}
          </span>
        </h3>
        <div
          className="place-category-desc"
          style={{
            color: '#263238',
            fontSize: '1.05rem',
            fontWeight: 400,
            lineHeight: 1.55,
            padding: 0,
            marginTop: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: 7,
          }}
        >
          <div>
            <span style={{ fontWeight: 700, color: '#1976d2' }}>Šalis:</span>{' '}
            {country}
          </div>
          <div>
            <span style={{ fontWeight: 700, color: '#1976d2' }}>
              Miestas/regionas:
            </span>{' '}
            {city}
          </div>
          {location && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <FaMapMarkerAlt style={{ color: '#ff7043', fontSize: 16 }} />
              <span style={{ fontWeight: 500 }}>{location}</span>
            </div>
          )}
          {infrastructure && (
            <div>
              <span style={{ fontWeight: 700, color: '#1976d2' }}>
                Infrastruktūra:
              </span>{' '}
              {infrastructure}
            </div>
          )}
          {note && (
            <div style={{ color: '#388e3c', fontWeight: 600 }}>
              <span>Pastaba:</span> {note}
            </div>
          )}
          {sources && sources.length > 0 && (
            <div style={{ fontSize: '0.98rem', color: '#607d8b' }}>
              <span style={{ fontWeight: 700 }}>Šaltiniai:</span>{' '}
              {sources.join(', ')}
            </div>
          )}
        </div>
      </div>
      <div
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          background: 'linear-gradient(135deg, #1976d2 60%, #4fc3f7 100%)',
          color: '#fff',
          fontWeight: 700,
          fontSize: 13,
          padding: '4px 14px 4px 12px',
          borderBottomLeftRadius: 18,
          letterSpacing: '0.04em',
          boxShadow: '0 2px 8px rgba(33, 150, 243, 0.10)',
        }}
      >
        PAPŪDIMYS
      </div>
    </div>
  );
}
