import { useEffect, useState } from 'react';
import BeachInfoCard from '../../../../components/places/BeachInfoCard';
import axios from 'axios';
import '../Places/places-page.css';

const Beaches = () => {
  const [beaches, setBeaches] = useState<any[]>([]);

  useEffect(() => {
    axios.get('/api/beaches').then((res) => setBeaches(res.data));
  }, []);

  return (
    <div className="places-page">
      <h2
        className="places-heading"
        style={{ color: '#1976d2', marginTop: 88 }}
      >
        Paplūdimiai
      </h2>
      <div
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: 1200,
            background: 'linear-gradient(180deg, #f7f9fb 60%, #e3f0fa 100%)',
            borderRadius: 36,
            boxShadow: '0 8px 32px rgba(44, 62, 80, 0.10)',
            padding: '44px 32px 64px 32px',
            marginTop: 0,
            marginBottom: 32,
            minHeight: 500,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
              gap: 36,
              width: '100%',
              justifyContent: 'center',
              alignItems: 'stretch',
            }}
          >
            {beaches.length === 0 ? (
              <div
                style={{
                  gridColumn: '1/-1',
                  textAlign: 'center',
                  fontSize: 22,
                  color: '#1976d2',
                }}
              >
                Kraunama...
              </div>
            ) : (
              beaches.map((beach) => (
                <BeachInfoCard key={beach._id} {...beach} />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Beaches;
