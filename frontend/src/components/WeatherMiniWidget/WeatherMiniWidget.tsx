import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './mini-weather-widget.css';

const ICONS: Record<string, React.ReactNode> = {
  clear: (
    <svg width="32" height="32" viewBox="0 0 64 64" fill="none">
      {/* Saulės centras */}
      <circle cx="32" cy="32" r="10" fill="#FFD600" />

      {/* Spinduliai */}
      <g stroke="#FFD600" strokeWidth="4">
        <line x1="32" y1="2" x2="32" y2="14" />
        <line x1="32" y1="50" x2="32" y2="62" />
        <line x1="2" y1="32" x2="14" y2="32" />
        <line x1="50" y1="32" x2="62" y2="32" />

        <line x1="10" y1="10" x2="18" y2="18" />
        <line x1="46" y1="46" x2="54" y2="54" />
        <line x1="10" y1="54" x2="18" y2="46" />
        <line x1="46" y1="18" x2="54" y2="10" />
      </g>
    </svg>
  ),
  'partly-cloudy': (
    <svg width="32" height="32" viewBox="0 0 64 64">
      <circle cx="32" cy="32" r="10" fill="#FFD600" />
      <ellipse cx="40" cy="40" rx="12" ry="7" fill="#B0BEC5" />
    </svg>
  ),
  cloudy: (
    <svg width="32" height="32" viewBox="0 0 64 64">
      <ellipse cx="36" cy="40" rx="14" ry="9" fill="#B0BEC5" />
      <ellipse cx="28" cy="36" rx="10" ry="7" fill="#CFD8DC" />
    </svg>
  ),
  rain: (
    <svg width="32" height="32" viewBox="0 0 64 64">
      <ellipse cx="36" cy="40" rx="14" ry="9" fill="#B0BEC5" />
      <ellipse cx="28" cy="36" rx="10" ry="7" fill="#CFD8DC" />
      <line x1="24" y1="54" x2="24" y2="60" stroke="#2196F3" strokeWidth="2" />
      <line x1="40" y1="54" x2="40" y2="60" stroke="#2196F3" strokeWidth="2" />
    </svg>
  ),
  'light-rain': (
    <svg width="32" height="32" viewBox="0 0 64 64">
      <ellipse cx="36" cy="40" rx="14" ry="9" fill="#B0BEC5" />
      <ellipse cx="28" cy="36" rx="10" ry="7" fill="#CFD8DC" />
      <line
        x1="32"
        y1="54"
        x2="32"
        y2="58"
        stroke="#2196F3"
        strokeWidth="1.5"
      />
    </svg>
  ),
  'heavy-rain': (
    <svg width="32" height="32" viewBox="0 0 64 64">
      <ellipse cx="36" cy="40" rx="14" ry="9" fill="#B0BEC5" />
      <ellipse cx="28" cy="36" rx="10" ry="7" fill="#CFD8DC" />
      <line x1="20" y1="54" x2="20" y2="60" stroke="#2196F3" strokeWidth="2" />
      <line x1="32" y1="54" x2="32" y2="60" stroke="#2196F3" strokeWidth="2" />
      <line x1="44" y1="54" x2="44" y2="60" stroke="#2196F3" strokeWidth="2" />
    </svg>
  ),
  snow: (
    <svg width="32" height="32" viewBox="0 0 64 64">
      <ellipse cx="36" cy="40" rx="14" ry="9" fill="#B0BEC5" />
      <ellipse cx="28" cy="36" rx="10" ry="7" fill="#CFD8DC" />
      <circle cx="32" cy="56" r="3" fill="#90CAF9" />
    </svg>
  ),
  fog: (
    <svg width="32" height="32" viewBox="0 0 64 64">
      <ellipse cx="36" cy="40" rx="14" ry="9" fill="#B0BEC5" />
      <ellipse cx="28" cy="36" rx="10" ry="7" fill="#CFD8DC" />
      <rect x="16" y="54" width="32" height="3" fill="#B0BEC5" />
    </svg>
  ),
  thunder: (
    <svg width="32" height="32" viewBox="0 0 64 64">
      <ellipse cx="36" cy="40" rx="14" ry="9" fill="#B0BEC5" />
      <ellipse cx="28" cy="36" rx="10" ry="7" fill="#CFD8DC" />
      <polygon points="32,48 40,60 28,60 36,72" fill="#FFD600" />
    </svg>
  ),
};

export default function WeatherMiniWidget() {
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    setError('');
    fetch(`/api/weather/marijampole`)
      .then((res) => {
        if (!res.ok) throw new Error('Nepavyko gauti orų duomenų');
        return res.json();
      })
      .then((data) => {
        setWeather(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Nepavyko gauti orų duomenų');
        setLoading(false);
      });
  }, []);

  if (loading || error || !weather) return null;

  const current = weather.forecastTimestamps[0];
  const icon = ICONS[current.conditionCode] || ICONS['cloudy'];

  return (
    <div
      className="navbar-weather-widget"
      onClick={() => navigate('/weather')}
      title="Žiūrėti detalią orų prognozę"
      tabIndex={0}
      role="button"
      style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
    >
      <span className="navbar-weather-temp">
        {Math.round(current.airTemperature)}°
      </span>
      <span className="navbar-weather-icon">{icon}</span>
    </div>
  );
}
