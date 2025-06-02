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

const ICONS: Record<string, React.ReactNode> = {
  clear: (
    <svg className="icon-big" viewBox="0 0 64 64">
      <circle cx="32" cy="32" r="18" fill="#FFD600" />
    </svg>
  ),
  'partly-cloudy': (
    <svg className="icon-big" viewBox="0 0 64 64">
      <circle cx="32" cy="32" r="14" fill="#FFD600" />
      <ellipse cx="40" cy="40" rx="16" ry="10" fill="#B0BEC5" />
    </svg>
  ),
  cloudy: (
    <svg className="icon-big" viewBox="0 0 64 64">
      <ellipse cx="36" cy="40" rx="18" ry="12" fill="#B0BEC5" />
      <ellipse cx="28" cy="36" rx="14" ry="10" fill="#CFD8DC" />
    </svg>
  ),
  rain: (
    <svg className="icon-big" viewBox="0 0 64 64">
      <ellipse cx="36" cy="40" rx="18" ry="12" fill="#B0BEC5" />
      <ellipse cx="28" cy="36" rx="14" ry="10" fill="#CFD8DC" />
      <line x1="24" y1="54" x2="24" y2="62" stroke="#2196F3" strokeWidth="3" />
      <line x1="40" y1="54" x2="40" y2="62" stroke="#2196F3" strokeWidth="3" />
    </svg>
  ),
  'light-rain': (
    <svg className="icon-big" viewBox="0 0 64 64">
      <ellipse cx="36" cy="40" rx="18" ry="12" fill="#B0BEC5" />
      <ellipse cx="28" cy="36" rx="14" ry="10" fill="#CFD8DC" />
      <line x1="32" y1="54" x2="32" y2="60" stroke="#2196F3" strokeWidth="2" />
    </svg>
  ),
  'heavy-rain': (
    <svg className="icon-big" viewBox="0 0 64 64">
      <ellipse cx="36" cy="40" rx="18" ry="12" fill="#B0BEC5" />
      <ellipse cx="28" cy="36" rx="14" ry="10" fill="#CFD8DC" />
      <line x1="20" y1="54" x2="20" y2="62" stroke="#2196F3" strokeWidth="3" />
      <line x1="32" y1="54" x2="32" y2="62" stroke="#2196F3" strokeWidth="3" />
      <line x1="44" y1="54" x2="44" y2="62" stroke="#2196F3" strokeWidth="3" />
    </svg>
  ),
  snow: (
    <svg className="icon-big" viewBox="0 0 64 64">
      <ellipse cx="36" cy="40" rx="18" ry="12" fill="#B0BEC5" />
      <ellipse cx="28" cy="36" rx="14" ry="10" fill="#CFD8DC" />
      <circle cx="32" cy="56" r="4" fill="#90CAF9" />
    </svg>
  ),
  fog: (
    <svg className="icon-big" viewBox="0 0 64 64">
      <ellipse cx="36" cy="40" rx="18" ry="12" fill="#B0BEC5" />
      <ellipse cx="28" cy="36" rx="14" ry="10" fill="#CFD8DC" />
      <rect x="16" y="54" width="32" height="4" fill="#B0BEC5" />
    </svg>
  ),
  thunder: (
    <svg className="icon-big" viewBox="0 0 64 64">
      <ellipse cx="36" cy="40" rx="18" ry="12" fill="#B0BEC5" />
      <ellipse cx="28" cy="36" rx="14" ry="10" fill="#CFD8DC" />
      <polygon points="32,48 40,62 28,62 36,76" fill="#FFD600" />
    </svg>
  ),
};

export default function WeatherBlock() {
  const [selectedCity, setSelectedCity] = useState(CITIES[0].code);
  const [weather, setWeather] = useState<any>(null);

  useEffect(() => {
    fetch(`/api/weather/${selectedCity}`)
      .then((res) => res.json())
      .then((data) => setWeather(data));
  }, [selectedCity]);

  if (!weather) {
    return <div className="weather-block">Kraunama...</div>;
  }

  // Grupavimas pagal dienas
  const days: { [date: string]: any[] } = {};
  weather.forecastTimestamps.forEach((t: any) => {
    const day = t.forecastTimeUtc.split(' ')[0];
    if (!days[day]) days[day] = [];
    days[day].push(t);
  });
  const dayKeys = Object.keys(days).slice(0, 5);

  // Dabartinė diena
  const now = new Date();
  const todayKey = now.toISOString().slice(0, 10);
  const current =
    weather.forecastTimestamps.find((t: any) =>
      t.forecastTimeUtc.startsWith(todayKey)
    ) || weather.forecastTimestamps[0];

  return (
    <div className="weather-block">
      {/* ====================
            HEADERAS: "Mano vieta" + MIESTO SELECT
            ==================== */}
      <div className="weather-block-header">
        <button className="btn-location">
          Mano vieta <span className="icon-location" />
        </button>
        <select
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
          className="city-select"
        >
          {CITIES.map((city) => (
            <option key={city.code} value={city.code}>
              {city.name}
            </option>
          ))}
        </select>
      </div>

      {/* ==========================================
            VIRŠUTINIS BLOKAS: KAIRĖ (MIESTAS + DATA) + 
            DEŠINĖ (IKONA + TEMP + JUTIMINĖ)
            ========================================== */}
      <div className="weather-block-top">
        {/* KAIRĖ DALIS */}
        <div className="weather-block-top-left">
          <h1 className="weather-block-city">{weather.place.name}</h1>
          <div className="weather-block-date">
            {new Date(current.forecastTimeUtc).toLocaleDateString('lt-LT', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
            })}
          </div>
        </div>

        {/* DEŠINĖ DALIS */}
        <div className="weather-block-top-right">
          <div className="weather-block-icon-big">
            {ICONS[current.conditionCode] || ICONS['cloudy']}
          </div>
          <div className="weather-block-temp-feels">
            <div className="weather-block-temp">
              {Math.round(current.airTemperature)}°
            </div>
            <div className="weather-block-feels">
              Jutiminė {Math.round(current.feelsLikeTemperature)}°
            </div>
          </div>
        </div>
      </div>

      {/* ==========================================
            PAGRINDINIS BLOKAS: TIESIOGINĖ HORIZONTALIOJI LENTELĖ
            ========================================== */}
      <div className="weather-block-main">
        <div className="weather-block-right">
          <table className="weather-table">
            <colgroup>
              <col style={{ width: '40%' }} />
              <col style={{ width: '20%' }} />
              <col style={{ width: '20%' }} />
              <col style={{ width: '20%' }} />
            </colgroup>
            <thead>
              <tr>
                <th className="day-name-header"></th>
                <th className="time-header">09:00</th>
                <th className="time-header">15:00</th>
                <th className="time-header">21:00</th>
              </tr>
            </thead>
            <tbody>
              {dayKeys.slice(1, 4).map((day) => {
                const dayData = days[day];
                const renderHour = (hhmm) => {
                  const t = dayData.find((d) =>
                    d.forecastTimeUtc.endsWith(hhmm + ':00')
                  );
                  const icon = t
                    ? ICONS[t.conditionCode] || ICONS['cloudy']
                    : ICONS['cloudy'];
                  const temp = t ? Math.round(t.airTemperature) + '°' : '–';
                  return (
                    <div className="hour-cell-content">
                      {icon}
                      <span className="hour-temp-text">{temp}</span>
                    </div>
                  );
                };
                return (
                  <tr key={day} className="day-row">
                    <td className="day-name-cell">
                      {new Date(day).toLocaleDateString('lt-LT', {
                        weekday: 'long',
                      })}
                    </td>
                    <td className="time-cell">{renderHour('09:00')}</td>
                    <td className="time-cell">{renderHour('15:00')}</td>
                    <td className="time-cell">{renderHour('21:00')}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ==========================================
            APAČIA: mygtukas "Žr. išsamesnę prognozę"
            ========================================== */}
      <div className="weather-block-footer">
        <button className="btn-full-forecast">Žr. išsamesnę prognozę</button>
      </div>
    </div>
  );
}
