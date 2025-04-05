import { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/logo.png';
import { Menu, X } from 'lucide-react';
import './nav-bar.css';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleMenu = () => {
    setMobileOpen(!mobileOpen);
  };

  const navLinks = [
    { label: 'Pradžia', path: '/' },
    { label: 'Vietos', path: '/places' },
    { label: 'Paslaugos', path: '/services' },
    { label: 'Prisijungti', path: '/login' },
  ];

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container">
        <Link to="/" className="logo-wrapper">
          <img src={logo} alt="Logo" className="logo" />
          <span className="logo-text">WithYourDog</span>
        </Link>

        {/* Desktop navigation */}
        <nav className="nav-desktop">
          {navLinks.map((link) => (
            <Link key={link.path} to={link.path} className="nav-link">
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Mobile menu button */}
        <button className="menu-toggle" onClick={toggleMenu}>
          {mobileOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile menu panel */}
      {mobileOpen && (
        <div className="nav-mobile">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className="nav-link"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
