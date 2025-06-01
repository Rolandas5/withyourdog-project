import ContactSection from '../../components/ContactSection/ContactSection';
import Footer from '../../components/Footer/Footer';
import WeatherMiniWidget from '../../components/WeatherMiniWidget/WeatherMiniWidget';
import './home-page.css';

export default function Home() {
  return (
    <>
      <section
        className="hero"
        style={{
          backgroundImage: "url('/assets/aikutis.png')",
          position: 'relative',
        }}
      >
        <div className="weather-widget-hero">
          <WeatherMiniWidget />
        </div>
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
