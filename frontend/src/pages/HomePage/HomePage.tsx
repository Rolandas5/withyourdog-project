import heroPg from '../../assets/home_page.jpg';
import './home-page.css';

export default function HeroSection() {
  return (
    <section className="hero" style={{ backgroundImage: `url(${heroPg})` }}>
      <div className="hero-overlay">
        <div className="hero-content">
          <h1>Kurk nuotykius su savo šunimi</h1>
          <p>
            Rask vietas, paslaugas ir patirtis, kurios tinka JUMS ir JŪSŲ šuniui
          </p>
          <button className="hero-button">Pradėk čia</button>
        </div>
      </div>
    </section>
  );
}
