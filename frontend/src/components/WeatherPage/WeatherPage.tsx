import WeatherBlock from '../WeatherBlock/WeatherBlock';
import './weather-page.css';

export default function WeatherPage() {
  return (
    <div className="weather-page">
      <div className="weather-page-wrapper">
        <h1 className="weather-page-title">Išsami orų prognozė</h1>
        <WeatherBlock />
      </div>
    </div>
  );
}
