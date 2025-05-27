import { useState } from 'react';
import './home-page.css';
import ContactSection from '../../components/ContactSection/ContactSection';
import Footer from '../../components/Footer/Footer';
import WeatherWidget from '../../components/WeatherWidget/WeatherWidget';
import WeatherDetails from '../../components/WeatherDetails/WeatherDetails';

const CITIES = [
  { code: 'vilnius', name: 'Vilnius' },
  { code: 'kaunas', name: 'Kaunas' },
  { code: 'klaipeda', name: 'Klaipėda' },
  { code: 'siauliai', name: 'Šiauliai' },
  { code: 'panevezys', name: 'Panevėžys' },
  { code: 'alytus', name: 'Alytus' },
  { code: 'marijampole', name: 'Marijampolė' },
  { code: 'mazeikiai', name: 'Mažeikiai' },
  { code: 'utena', name: 'Utena' },
  { code: 'taurage', name: 'Tauragė' },
];

export default function HeroSection() {
  const [selectedCity, setSelectedCity] = useState('marijampole');
  const [showWeatherDetails, setShowWeatherDetails] = useState(false);

  return (
    <>
      <section
        className="hero"
        style={{ backgroundImage: "url('/assets/aikutis.png')" }}
      >
        {/* Mini widgetas */}
        {!showWeatherDetails && (
          <WeatherWidget
            place={selectedCity}
            onExpand={() => setShowWeatherDetails(true)}
          />
        )}

        {/* Platesnis modalo langas */}
        {showWeatherDetails && (
          <WeatherDetails
            place={selectedCity}
            cities={CITIES}
            onCityChange={setSelectedCity}
            onBack={() => setShowWeatherDetails(false)}
          />
        )}

        <div className="hero-overlay">
          <div className="hero-content">
            <h1 className="hero-title">Kurk nuotykius!</h1>
            <p className="hero-subtitle">
              Keliauk ir patirk gyvenimą kartu su savo šunimi
            </p>
            <button className="hero-button">Pradėk čia</button>
          </div>
        </div>
      </section>
      <ContactSection />
      <Footer />
    </>
  );
}
