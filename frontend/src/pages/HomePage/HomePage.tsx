import { Messages } from '../../components/Messages/Messages';
import Footer from '../../components/Footer/Footer';
import './home-page.css';
import '../../components/WeatherMiniWidget/mini-weather-widget.css';
import { Link, useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();

  return (
    <>
      <section
        className="hero"
        style={{
          backgroundImage: "url('/assets/aikutis.png')",
          position: 'relative',
        }}
      >
        <div className="hero-overlay">
          <div className="hero-content">
            <h1 className="hero-title">Kurk nuotykius!</h1>
            <p className="hero-subtitle">
              Keliauk ir patirk gyvenimą kartu su savo šunimi
            </p>
            <button className="hero-button" onClick={() => navigate('/places')}>
              Pradėk čia
            </button>
          </div>
        </div>
      </section>
      <Messages />
      <Footer />
    </>
  );
}
