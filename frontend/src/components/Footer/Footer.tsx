import './footer.css';
import { FaFacebookF, FaInstagram, FaLinkedinIn } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="light-footer">
      <div className="footer-grid equal-columns">
        <div className="footer-column">
          <h3>Draugai ir partneriai</h3>
          <ul className="footer-list">
            <li>
              <a href="#">Draugas1.lt</a>
            </li>
            <li>
              <a href="#">Partneris1</a>
            </li>
            <li>
              <a href="#">Partneris2</a>
            </li>
            <li>
              <a href="#">Sponsorius</a>
            </li>
            <li>
              <a
                href="https://www.bitynelis.lt/index.html"
                target="_blank"
                rel="noopener noreferrer"
                className="bitynelis-link"
              >
                <img
                  src="/assets/Logas.png"
                  alt="Bitynėlis"
                  className="bitynelis-logo"
                />
                <span
                  style={{
                    fontFamily: 'Comic Sans MS, cursive',
                    color: '#1a1a1a',
                  }}
                >
                  Bitynėlis
                </span>
              </a>
            </li>
          </ul>
        </div>

        <div className="footer-column">
          <h3>Sekite mus</h3>
          <div className="social-icons">
            <a
              href="https://www.facebook.com/withyourdog"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
            >
              <FaFacebookF style={{ color: '#3b5998' }} />
            </a>
            <a
              href="https://x.com/withyourdog"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="X (Twitter)"
            >
              <svg
                style={{ width: '18px', height: '18px', fill: '#000' }}
                viewBox="0 0 24 24"
              >
                <path d="M20.45 3H17.3L12.9 9.45 8.6 3H3L10.2 13.1 3.3 21H6.5L11.3 15.1 16 21H21L13.5 11.2 20.45 3Z" />
              </svg>
            </a>
            <a
              href="https://www.instagram.com/withyourdog"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <FaInstagram style={{ color: '#e1306c' }} />
            </a>
            <a
              href="https://www.linkedin.com/company/withyourdog"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
            >
              <FaLinkedinIn style={{ color: '#0077b5' }} />
            </a>
          </div>
        </div>

        <div className="footer-column">
          <h3>Nuorodos</h3>
          <ul className="footer-list">
            <li>
              <a href="#contact">Kontaktai</a>
            </li>
            <li>
              <a href="#">Reklama</a>
            </li>
            <li>
              <a href="#">Prenumerata</a>
            </li>
            <li>
              <a href="#">Privatumo politika</a>
            </li>
            <li>
              <a href="#">Naudojimosi taisyklės</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom-light">
        <p>&copy; 2025 WithYourDog</p>
        <a href="mailto:info@withyourdog.lt">info@withyourdog.lt</a>
      </div>
    </footer>
  );
}
