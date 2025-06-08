import React, { useEffect, useState } from 'react';
import { FaPaw, FaTree, FaCoffee } from 'react-icons/fa';

const fallbackParksData = [
  {
    city: 'Vilnius',
    parks: [
      {
        name: 'Vingio parkas',
        desc: 'Vienas didžiausių sostinės parkų, kuriame šunys gali laisvai vaikščioti su pavadėliu. Parke yra specialiai pažymėtos vietos šunų vedžiojimui.',
        sources: ['vilniusoutlet.lt', 'klaipedaassutavim.lt'],
      },
      {
        name: 'Belmonto parkas',
        desc: 'Populiari vieta pasivaikščiojimams su šunimis, ypač dėl gražių gamtos vaizdų ir takų.',
        sources: ['makaliauslietuva.lt', 'lrt.lt'],
      },
    ],
  },
  // ... (likę fallback parkai)
];

const fallbackCafesData = [
  {
    city: 'Vilnius',
    cafes: [
      {
        name: 'Žaliuomenė',
        desc: 'Ekologiška kavinė, kurioje leidžiama lankytis su augintiniais.',
        sources: ['meniu.lt'],
      },
      {
        name: 'Pachamama Dinner Club',
        desc: 'Restoranas, siūlantis Nikkei virtuvės patiekalus. Draugiškas augintiniams, leidžiantis lankytis su šunimis.',
        sources: ['tablein.lt'],
      },
      // ... (likusios fallback kavinės)
    ],
  },
];

const sectionStyle: React.CSSProperties = {
  width: '100%',
  maxWidth: 1200,
  background: 'linear-gradient(180deg, #e8f5e9 60%, #c8e6c9 100%)',
  borderRadius: 36,
  boxShadow: '0 8px 32px rgba(44, 62, 80, 0.10)',
  padding: '44px 16px 44px 16px',
  margin: '0 auto 36px auto',
  display: 'flex',
  flexDirection: 'column',
  gap: 32,
};

const mobileSectionStyle: React.CSSProperties = {
  ...sectionStyle,
  padding: '12px 2vw 12px 2vw',
  borderRadius: 10,
  fontSize: '0.95rem',
};

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 600);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);
  return isMobile;
}

const ParksSection = ({ parksData }: { parksData: any[] }) => {
  const isMobile = useIsMobile();
  return (
    <div style={isMobile ? mobileSectionStyle : sectionStyle}>
      {parksData.map((city, cityIdx) => (
        <div key={city.city || cityIdx} style={{ marginBottom: 0 }}>
          <h3
            style={{
              color: '#388e3c',
              fontWeight: 800,
              fontSize: isMobile ? '1.08rem' : '1.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              marginBottom: 10,
            }}
          >
            <FaTree
              style={{ color: '#43a047', fontSize: isMobile ? 16 : 20 }}
            />{' '}
            {city.city}
          </h3>
          <div style={{ height: 28 }} />
          <ul
            style={{
              margin: 0,
              paddingLeft: isMobile ? 12 : 18,
              listStyle: 'disc',
              color: '#2e7d32',
              fontSize: isMobile ? '0.98rem' : '1.08rem',
              fontWeight: 500,
            }}
          >
            {city.parks &&
              city.parks.map((park: any, parkIdx: number) => (
                <li
                  key={(city.city || cityIdx) + '-' + (park.name || parkIdx)}
                  style={{ marginBottom: isMobile ? 4 : 7 }}
                >
                  <span style={{ color: '#222', fontWeight: 700 }}>
                    {park.name}
                  </span>{' '}
                  – {park.desc}
                  {park.sources && park.sources.length > 0 && (
                    <span
                      style={{
                        color: '#607d8b',
                        fontWeight: 400,
                        fontSize: isMobile ? '0.92rem' : '0.98rem',
                        marginLeft: 6,
                      }}
                    >
                      (šaltiniai: {park.sources.join(', ')})
                    </span>
                  )}
                </li>
              ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

const CafesSection = ({ cafesData }: { cafesData: any[] }) => {
  const isMobile = useIsMobile();
  return (
    <div
      style={{
        ...sectionStyle,
        background: 'linear-gradient(180deg, #e3f0fa 60%, #d0e7f7 100%)',
        ...(isMobile ? mobileSectionStyle : {}),
      }}
    >
      {cafesData.map((city, cityIdx) => (
        <div key={city.city || cityIdx} style={{ marginBottom: 0 }}>
          <h3
            style={{
              color: '#1976d2',
              fontWeight: 800,
              fontSize: isMobile ? '1.08rem' : '1.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              marginBottom: 10,
            }}
          >
            <FaCoffee
              style={{ color: '#42a5f5', fontSize: isMobile ? 16 : 20 }}
            />{' '}
            {city.city}
          </h3>
          <div style={{ height: 28 }} />
          <ul
            style={{
              margin: 0,
              paddingLeft: isMobile ? 12 : 18,
              listStyle: 'disc',
              color: '#1976d2',
              fontSize: isMobile ? '0.98rem' : '1.08rem',
              fontWeight: 500,
            }}
          >
            {city.cafes &&
              city.cafes.map((cafe: any, cafeIdx: number) => (
                <li
                  key={(city.city || cityIdx) + '-' + (cafe.name || cafeIdx)}
                  style={{ marginBottom: isMobile ? 4 : 7 }}
                >
                  <span style={{ color: '#222', fontWeight: 700 }}>
                    {cafe.name}
                  </span>{' '}
                  – {cafe.desc}
                  {cafe.sources && cafe.sources.length > 0 && (
                    <span
                      style={{
                        color: '#607d8b',
                        fontWeight: 400,
                        fontSize: isMobile ? '0.92rem' : '0.98rem',
                        marginLeft: 6,
                      }}
                    >
                      (šaltiniai: {cafe.sources.join(', ')})
                    </span>
                  )}
                </li>
              ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

const Parks = () => {
  const [parksData, setParksData] = useState<any[]>([]);
  const [cafesData, setCafesData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch('/api/parks').then((res) => res.json()),
      fetch('/api/cafes').then((res) => res.json()),
    ])
      .then(([parks, cafes]) => {
        const parksMapped =
          Array.isArray(parks) &&
          parks.length > 0 &&
          Array.isArray(parks[0].parks)
            ? parks[0].parks
            : [];
        const cafesMapped =
          Array.isArray(cafes) &&
          cafes.length > 0 &&
          Array.isArray(cafes[0].cafes)
            ? cafes[0].cafes
            : [];
        setParksData(parksMapped.length > 0 ? parksMapped : fallbackParksData);
        setCafesData(cafesMapped.length > 0 ? cafesMapped : fallbackCafesData);
        setLoading(false);
      })
      .catch((err) => {
        setParksData(fallbackParksData);
        setCafesData(fallbackCafesData);
        setError(
          'Nepavyko užkrauti duomenų iš serverio, rodomi atsarginiai duomenys'
        );
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Kraunama...</div>;

  return (
    <div className="places-page">
      <h2
        className="places-heading"
        style={{ color: '#1976d2', marginTop: 90 }}
      >
        Parkai ir kitos vietos
      </h2>
      <div style={{ height: 48 }} />
      {error && (
        <div style={{ color: 'orange', marginBottom: 10 }}>{error}</div>
      )}
      {(!parksData || parksData.length === 0) && (
        <div style={{ color: 'red' }}>Nėra parkų duomenų!</div>
      )}
      {(!cafesData || cafesData.length === 0) && (
        <div style={{ color: 'red' }}>Nėra kavinių duomenų!</div>
      )}
      <ParksSection parksData={parksData} />
      <CafesSection cafesData={cafesData} />
    </div>
  );
};

export default Parks;
