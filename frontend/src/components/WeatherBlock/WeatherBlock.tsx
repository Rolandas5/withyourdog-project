import React, { useEffect, useState } from 'react';
import './weather-block.css';

const CITIES = [
  { code: 'vilnius', name: 'Vilnius' },
  { code: 'kaunas', name: 'Kaunas' },
  { code: 'klaipeda', name: 'Klaipėda' },
  { code: 'siauliai', name: 'Šiauliai' },
  { code: 'panevezys', name: 'Panevėžys' },
  { code: 'marijampole', name: 'Marijampolė' },
  { code: 'alytus', name: 'Alytus' },
  { code: 'utena', name: 'Utena' },
  { code: 'taurage', name: 'Tauragė' },
  { code: 'telsiai', name: 'Telšiai' },
  { code: 'mazeikiai', name: 'Mažeikiai' },
  { code: 'jonava', name: 'Jonava' },
  { code: 'visaginas', name: 'Visaginas' },
  { code: 'ukmerge', name: 'Ukmergė' },
  { code: 'plunge', name: 'Plungė' },
  { code: 'kretinga', name: 'Kretinga' },
  { code: 'radviliskis', name: 'Radviliškis' },
  { code: 'druskininkai', name: 'Druskininkai' },
  { code: 'palanga', name: 'Palanga' },
  { code: 'gargzdai', name: 'Gargždai' },
  { code: 'elektrenai', name: 'Elektrėnai' },
  { code: 'kedainiai', name: 'Kėdainiai' },
  { code: 'silute', name: 'Šilutė' },
  { code: 'jurbarkas', name: 'Jurbarkas' },
  { code: 'anyksciai', name: 'Anykščiai' },
  { code: 'birstonas', name: 'Birštonas' },
  { code: 'zarasai', name: 'Zarasai' },
];

// SVG ikonų žemėlapis (OpenWeather/WeatherIcons stiliaus)
const ICONS: Record<string, React.ReactNode> = {
  clear: (
    <svg width="64" height="64" viewBox="0 0 64 64">
      <circle cx="32" cy="32" r="18" fill="#FFD600" />
    </svg>
  ),
  'partly-cloudy': (
    <svg width="64" height="64" viewBox="0 0 64 64">
      <circle cx="32" cy="32" r="14" fill="#FFD600" />
      <ellipse cx="40" cy="40" rx="16" ry="10" fill="#B0BEC5" />
    </svg>
  ),
  cloudy: (
    <svg width="64" height="64" viewBox="0 0 64 64">
      <ellipse cx="36" cy="40" rx="18" ry="12" fill="#B0BEC5" />
      <ellipse cx="28" cy="36" rx="14" ry="10" fill="#CFD8DC" />
    </svg>
  ),
  rain: (
    <svg width="64" height="64" viewBox="0 0 64 64">
      <ellipse cx="36" cy="40" rx="18" ry="12" fill="#B0BEC5" />
      <ellipse cx="28" cy="36" rx="14" ry="10" fill="#CFD8DC" />
      <line x1="24" y1="54" x2="24" y2="62" stroke="#2196F3" strokeWidth="3" />
      <line x1="40" y1="54" x2="40" y2="62" stroke="#2196F3" strokeWidth="3" />
    </svg>
  ),
  'light-rain': (
    <svg width="64" height="64" viewBox="0 0 64 64">
      <ellipse cx="36" cy="40" rx="18" ry="12" fill="#B0BEC5" />
      <ellipse cx="28" cy="36" rx="14" ry="10" fill="#CFD8DC" />
      <line x1="32" y1="54" x2="32" y2="60" stroke="#2196F3" strokeWidth="2" />
    </svg>
  ),
  'heavy-rain': (
    <svg width="64" height="64" viewBox="0 0 64 64">
      <ellipse cx="36" cy="40" rx="18" ry="12" fill="#B0BEC5" />
      <ellipse cx="28" cy="36" rx="14" ry="10" fill="#CFD8DC" />
      <line x1="20" y1="54" x2="20" y2="62" stroke="#2196F3" strokeWidth="3" />
      <line x1="32" y1="54" x2="32" y2="62" stroke="#2196F3" strokeWidth="3" />
      <line x1="44" y1="54" x2="44" y2="62" stroke="#2196F3" strokeWidth="3" />
    </svg>
  ),
  snow: (
    <svg width="64" height="64" viewBox="0 0 64 64">
      <ellipse cx="36" cy="40" rx="18" ry="12" fill="#B0BEC5" />
      <ellipse cx="28" cy="36" rx="14" ry="10" fill="#CFD8DC" />
      <circle cx="32" cy="56" r="4" fill="#90CAF9" />
    </svg>
  ),
  fog: (
    <svg width="64" height="64" viewBox="0 0 64 64">
      <ellipse cx="36" cy="40" rx="18" ry="12" fill="#B0BEC5" />
      <ellipse cx="28" cy="36" rx="14" ry="10" fill="#CFD8DC" />
      <rect x="16" y="54" width="32" height="4" fill="#B0BEC5" />
    </svg>
  ),
  thunder: (
    <svg width="64" height="64" viewBox="0 0 64 64">
      <ellipse cx="36" cy="40" rx="18" ry="12" fill="#B0BEC5" />
      <ellipse cx="28" cy="36" rx="14" ry="10" fill="#CFD8DC" />
      <polygon points="32,48 40,62 28,62 36,76" fill="#FFD600" />
    </svg>
  ),
};

const DESCRIPTIONS: Record<string, string> = {
  clear: 'Giedra',
  'partly-cloudy': 'Mažai debesuota',
  cloudy: 'Debesuota',
  'cloudy-with-sunny-intervals': 'Debesuota su pragiedruliais',
  rain: 'Lietus',
  'light-rain': 'Nedidelis lietus',
  'heavy-rain': 'Smarkus lietus',
  snow: 'Sniegas',
  fog: 'Rūkas',
  thunder: 'Perkūnija',
};

export default function WeatherBlock() {
  const [selectedCity, setSelectedCity] = useState(CITIES[0].code);
  const [weather, setWeather] = useState<any>(null);

  useEffect(() => {
    fetch(`/api/weather/${selectedCity}`)
      .then((res) => res.json())
      .then((data) => setWeather(data));
  }, [selectedCity]);

  if (!weather) return <div className="weather-block">Kraunama...</div>;

  // Grupavimas pagal dienas
  const days: { [date: string]: any[] } = {};
  weather.forecastTimestamps.forEach((t: any) => {
    const day = t.forecastTimeUtc.split(' ')[0];
    if (!days[day]) days[day] = [];
    days[day].push(t);
  });
  const dayKeys = Object.keys(days).slice(0, 5);

  // Dabartinė valanda
  const now = new Date();
  const current =
    weather.forecastTimestamps.find((t: any) =>
      t.forecastTimeUtc.startsWith(now.toISOString().slice(0, 10))
    ) || weather.forecastTimestamps[0];

  return (
    <div className="weather-block">
      <div className="weather-block-header">
        <select
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
          className="weather-block-select"
        >
          {CITIES.map((city) => (
            <option key={city.code} value={city.code}>
              {city.name}
            </option>
          ))}
        </select>
      </div>
      <div className="weather-block-main">
        <div className="weather-block-left">
          <h1 className="weather-block-city">{weather.place.name}</h1>
          <div className="weather-block-date">
            {new Date(current.forecastTimeUtc).toLocaleDateString('lt-LT', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
            })}
          </div>
          <div className="weather-block-icon-big">
            {ICONS[current.conditionCode] || ICONS['cloudy']}
          </div>
          <div className="weather-block-temp">
            {Math.round(current.airTemperature)}°
          </div>
          <div className="weather-block-feels">
            Jutiminė {Math.round(current.feelsLikeTemperature)}°
          </div>
        </div>
        <div className="weather-block-right">
          <div className="weather-block-hours">
            {days[dayKeys[0]]
              .filter((t: any) =>
                ['09:00:00', '15:00:00', '21:00:00'].some((h) =>
                  t.forecastTimeUtc.endsWith(h)
                )
              )
              .map((t: any) => (
                <div key={t.forecastTimeUtc} className="weather-block-hour">
                  <div>{t.forecastTimeUtc.slice(11, 16)}</div>
                  <div className="weather-block-hour-icon">
                    {ICONS[t.conditionCode] || ICONS['cloudy']}
                  </div>
                  <div>{Math.round(t.airTemperature)}°</div>
                </div>
              ))}
          </div>
        </div>
      </div>
      <div className="weather-block-days">
        {dayKeys.map((day) => {
          const dayData = days[day];
          const temps = dayData.map((t: any) => t.airTemperature);
          const min = Math.min(...temps);
          const max = Math.max(...temps);
          const icon = dayData[Math.floor(dayData.length / 2)].conditionCode;
          return (
            <div key={day} className="weather-block-day">
              <div className="weather-block-day-label">
                {new Date(day).toLocaleDateString('lt-LT', {
                  weekday: 'short',
                })}
              </div>
              <div className="weather-block-day-icon">
                {ICONS[icon] || ICONS['cloudy']}
              </div>
              <div className="weather-block-day-temp">
                {Math.round(max)}° / {Math.round(min)}°
              </div>
              <div className="weather-block-day-desc">
                {DESCRIPTIONS[icon] || '–'}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
