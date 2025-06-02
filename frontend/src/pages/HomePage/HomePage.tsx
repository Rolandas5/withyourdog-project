import ContactSection from '../../components/ContactSection/ContactSection';
import Footer from '../../components/Footer/Footer';
import WeatherMiniWidget from '../../components/WeatherMiniWidget/WeatherMiniWidget';
import './home-page.css';
import '../../components/WeatherMiniWidget/mini-weather-widget.css';

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
        <WeatherMiniWidget />
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
