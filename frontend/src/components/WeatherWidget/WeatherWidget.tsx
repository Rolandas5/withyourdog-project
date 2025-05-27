import { useEffect, useState } from 'react';
import './weather-widget.css';

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

export default function WeatherWidget({
  place,
  onExpand,
}: {
  place: string;
  onExpand?: () => void;
}) {
  const [weather, setWeather] = useState<any>(null);

  useEffect(() => {
    fetch(`http://localhost:3000/api/weather/${place}`)
      .then((res) => res.json())
      .then((data) => {
        // Imame artimiausią valandą iš forecasts masyvo
        const forecast = data.forecastTimestamps?.[0];
        setWeather({ ...forecast, placeName: data.place?.name });
      });
  }, [place]);

  if (!weather) return null;

  return (
    <div className="weather-widget-hero" onClick={onExpand}>
      <span className="weather-icon">
        {Math.round(weather.airTemperature)}°
      </span>
      <span className="weather-icon">{getIcon(weather.conditionCode)}</span>
      <span className="weather-city">{weather.placeName || place}</span>
    </div>
  );
}
