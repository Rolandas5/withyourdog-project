import './home-page.css';
import ContactSection from '../../components/ContactSection/ContactSection';
import Footer from '../../components/Footer/Footer';

export default function HeroSection() {
  return (
    <>
      <section
        className="hero"
        style={{ backgroundImage: "url('/assets/aikutis.png')" }}
      >
        <div className="hero-overlay">
          <div className="hero-content">
            <h1>Kurk nuotykius su savo šunimi</h1>
            <p>
              Rask vietas, paslaugas ir patirtis, kurios tinka JUMS ir JŪSŲ
              šuniui
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
