import { useEffect, useState } from 'react';
import './weather-details.css';

interface City {
  code: string;
  name: string;
}

interface WeatherDetailsProps {
  place: string;
  cities: City[];
  onCityChange: (city: string) => void;
  onBack: () => void;
}

export default function WeatherDetails({
  place,
  cities,
  onCityChange,
  onBack,
}: WeatherDetailsProps) {
  const [weather, setWeather] = useState<any>(null);

  useEffect(() => {
    fetch(`http://localhost:3000/api/weather/${place}`)
      .then((res) => res.json())
      .then((data) => setWeather(data));
  }, [place]);

  // Funkcija piktogramoms
  function getIcon(conditionCode: string) {
    if (!conditionCode) return '🌡️';
    if (conditionCode.includes('clear')) return '☀️';
    if (conditionCode.includes('cloud')) return '⛅';
    if (conditionCode.includes('rain')) return '🌧️';
    if (conditionCode.includes('snow')) return '❄️';
    if (conditionCode.includes('thunder')) return '⛈️';
    if (conditionCode.includes('fog')) return '🌫️';
    return '🌡️';
  }

  if (!weather)
    return (
      <div className="weather-details-modal">
        <div className="details-inner">
          <span>Kraunama...</span>
        </div>
      </div>
    );

  const city = weather.place && weather.place.name ? weather.place.name : place;
  const threeDays = Array.isArray(weather.forecastTimestamps)
    ? weather.forecastTimestamps.slice(0, 24 * 3)
    : [];

  return (
    <div className="weather-details-modal">
      <div className="details-inner">
        <div className="city-picker-modal">
          <select
            value={place}
            onChange={(e) => onCityChange(e.target.value)}
            className="city-select"
          >
            {cities.map((city) => (
              <option key={city.code} value={city.code}>
                {city.name}
              </option>
            ))}
          </select>
        </div>

        <h2>{city}: artimiausios dienos</h2>
        <div className="weather-table">
          {threeDays.map((t: any, i: number) => (
            <div className="weather-row" key={i}>
              <div className="weather-date">
                {new Date(t.forecastTimeUtc).toLocaleString('lt-LT', {
                  weekday: 'short',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </div>
              <div className="weather-temp">
                {Math.round(t.airTemperature)}°C
              </div>
              <div className="weather-cond">
                <span className="weather-icon">{getIcon(t.conditionCode)}</span>
                {t.conditionCode.replace(/-/g, ' ')}
              </div>
            </div>
          ))}
        </div>
        <button className="details-back-btn" onClick={onBack}>
          Grįžti į pradžią
        </button>
      </div>
    </div>
  );
}
