import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Search } from 'lucide-react';
import logo from '../../assets/logo.png';
import './nav-bar.css';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [showSearch, setShowSearch] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [searchTerm, setSearchTerm] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => {
    setMobileOpen(!mobileOpen);
    setOpenDropdown(null);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowSearch(false);
        setSearchTerm('');
        setActiveIndex(-1);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSearch(false);
        setSearchTerm('');
        setActiveIndex(-1);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showSearch]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (showSearch && inputRef.current) {
        inputRef.current.focus();
      }
    }, 50);
    return () => clearTimeout(timeout);
  }, [showSearch]);

  const exampleResults = [
    'Šunų kirpyklos Vilniuje',
    'Dresuotojai Kaune',
    'Parkai su leidimu šunims',
    'Kelionės su augintiniu',
    'Šunų viešbučiai',
  ];

  const filteredResults = exampleResults.filter((item) =>
    item.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <header>
      <div className="container">
        <Link to="/" className="logo-wrapper">
          <img src={logo} alt="Logo" className="logo" />
          <span className="logo-text">WithYourDog</span>
        </Link>

        {showSearch && !mobileOpen && (
          <div className="search-box" onClick={() => inputRef.current?.focus()}>
            <input
              ref={inputRef}
              type="text"
              className="search-input"
              placeholder="Ieškoti vietos, paslaugos, patirties..."
              value={searchTerm}
              onClick={() => inputRef.current?.focus()}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setActiveIndex(-1);
              }}
              onKeyDown={(e) => {
                if (e.key === 'ArrowDown') {
                  setActiveIndex((prev) =>
                    Math.min(prev + 1, filteredResults.length - 1)
                  );
                } else if (e.key === 'ArrowUp') {
                  setActiveIndex((prev) => Math.max(prev - 1, 0));
                } else if (e.key === 'Enter' && filteredResults[activeIndex]) {
                  alert(`Pasirinkta: ${filteredResults[activeIndex]}`);
                  setShowSearch(false);
                  setSearchTerm('');
                  setActiveIndex(-1);
                }
              }}
              autoFocus
            />
            {searchTerm && (
              <div className="search-results">
                {filteredResults.length > 0 ? (
                  filteredResults.map((result, i) => (
                    <div
                      key={i}
                      className={`search-result-item ${
                        i === activeIndex ? 'active' : ''
                      }`}
                    >
                      {result}
                    </div>
                  ))
                ) : (
                  <div className="search-result-item no-result">
                    Nieko nerasta...
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        <nav className="nav-desktop">
          <div className="search-container" ref={searchRef}>
            <Search
              className="search-icon"
              onClick={() => setShowSearch(!showSearch)}
            />
          </div>
          <Link to="/" className="nav-link">
            Pradžia
          </Link>
          <div
            className="nav-dropdown"
            onMouseEnter={() => setOpenDropdown('places')}
            onMouseLeave={() => setOpenDropdown(null)}
          >
            <span className="nav-link">Vietos</span>
            {openDropdown === 'places' && (
              <div className="dropdown-menu">
                <Link to="/places" className="dropdown-item">
                  Visos vietos
                </Link>
                <Link to="/places/hotels" className="dropdown-item">
                  Viešbučiai, sodybos, kempingai
                </Link>
                <Link to="/places/beaches" className="dropdown-item">
                  Paplūdimiai
                </Link>
                <Link to="/places/parks" className="dropdown-item">
                  Parkai ir kitos lauko vietos
                </Link>
              </div>
            )}
          </div>
          <div
            className="nav-dropdown"
            onMouseEnter={() => setOpenDropdown('services')}
            onMouseLeave={() => setOpenDropdown(null)}
          >
            <span className="nav-link">Paslaugos</span>
            {openDropdown === 'services' && (
              <div className="dropdown-menu">
                <Link to="/services" className="dropdown-item">
                  Visos paslaugos
                </Link>
                <Link to="/services/grooming" className="dropdown-item">
                  Šunų kirpyklos
                </Link>
                <Link to="/services/hotels" className="dropdown-item">
                  Šunų viešbučiai
                </Link>
                <Link to="/services/insurance" className="dropdown-item">
                  Draudimas
                </Link>
                <Link to="/services/training" className="dropdown-item">
                  Dresuotojai
                </Link>
              </div>
            )}
          </div>
          <div
            className="nav-dropdown"
            onMouseEnter={() => setOpenDropdown('experiences')}
            onMouseLeave={() => setOpenDropdown(null)}
          >
            <span className="nav-link">Kelionių patirtys</span>
            {openDropdown === 'experiences' && (
              <div className="dropdown-menu">
                <Link to="/experiences" className="dropdown-item">
                  Visi kelionių įrašai
                </Link>
                <Link to="/experiences/1" className="dropdown-item">
                  Vienos kelionės puslapis
                </Link>
              </div>
            )}
          </div>
          <Link to="/login" className="nav-link">
            Prisijungti
          </Link>
        </nav>

        {mobileOpen && (
          <div className="nav-mobile">
            <div className="search-container center" ref={searchRef}>
              <Search
                className="search-icon"
                onClick={() => setShowSearch(!showSearch)}
              />
              {showSearch && (
                <div
                  className="search-box"
                  onClick={() => inputRef.current?.focus()}
                >
                  <input
                    ref={inputRef}
                    type="text"
                    className="search-input"
                    placeholder="Ieškoti vietos, paslaugos, patirties..."
                    value={searchTerm}
                    onClick={() => inputRef.current?.focus()}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setActiveIndex(-1);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'ArrowDown') {
                        setActiveIndex((prev) =>
                          Math.min(prev + 1, filteredResults.length - 1)
                        );
                      } else if (e.key === 'ArrowUp') {
                        setActiveIndex((prev) => Math.max(prev - 1, 0));
                      } else if (
                        e.key === 'Enter' &&
                        filteredResults[activeIndex]
                      ) {
                        alert(`Pasirinkta: ${filteredResults[activeIndex]}`);
                        setShowSearch(false);
                        setSearchTerm('');
                        setActiveIndex(-1);
                      }
                    }}
                    autoFocus
                  />
                  {searchTerm && (
                    <div className="search-results">
                      {filteredResults.length > 0 ? (
                        filteredResults.map((result, i) => (
                          <div
                            key={i}
                            className={`search-result-item ${
                              i === activeIndex ? 'active' : ''
                            }`}
                          >
                            {result}
                          </div>
                        ))
                      ) : (
                        <div className="search-result-item no-result">
                          Nieko nerasta...
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
            <Link
              to="/"
              className="nav-link"
              onClick={() => setMobileOpen(false)}
            >
              Pradžia
            </Link>
            <div className="nav-mobile-dropdown">
              <span
                className="nav-link"
                onClick={() => setOpenDropdown('places')}
              >
                Vietos
              </span>
              {openDropdown === 'places' && (
                <div className="dropdown-menu">
                  <Link
                    to="/places"
                    className="dropdown-item"
                    onClick={() => setMobileOpen(false)}
                  >
                    Visos vietos
                  </Link>
                  <Link
                    to="/places/hotels"
                    className="dropdown-item"
                    onClick={() => setMobileOpen(false)}
                  >
                    Viešbučiai, sodybos, kempingai
                  </Link>
                  <Link
                    to="/places/beaches"
                    className="dropdown-item"
                    onClick={() => setMobileOpen(false)}
                  >
                    Paplūdimiai
                  </Link>
                  <Link
                    to="/places/parks"
                    className="dropdown-item"
                    onClick={() => setMobileOpen(false)}
                  >
                    Parkai ir kitos lauko vietos
                  </Link>
                </div>
              )}
            </div>
            <div className="nav-mobile-dropdown">
              <span
                className="nav-link"
                onClick={() => setOpenDropdown('services')}
              >
                Paslaugos
              </span>
              {openDropdown === 'services' && (
                <div className="dropdown-menu">
                  <Link
                    to="/services"
                    className="dropdown-item"
                    onClick={() => setMobileOpen(false)}
                  >
                    Visos paslaugos
                  </Link>
                  <Link
                    to="/services/grooming"
                    className="dropdown-item"
                    onClick={() => setMobileOpen(false)}
                  >
                    Šunų kirpyklos
                  </Link>
                  <Link
                    to="/services/training"
                    className="dropdown-item"
                    onClick={() => setMobileOpen(false)}
                  >
                    Dresuotojai
                  </Link>
                  <Link
                    to="/services/insurance"
                    className="dropdown-item"
                    onClick={() => setMobileOpen(false)}
                  >
                    Draudimas
                  </Link>
                  <Link
                    to="/services/hotels"
                    className="dropdown-item"
                    onClick={() => setMobileOpen(false)}
                  >
                    Šunų viešbučiai
                  </Link>
                </div>
              )}
            </div>
            <div className="nav-mobile-dropdown">
              <span
                className="nav-link"
                onClick={() => setOpenDropdown('experiences')}
              >
                Kelionių patirtys
              </span>
              {openDropdown === 'experiences' && (
                <div className="dropdown-menu">
                  <Link
                    to="/experiences"
                    className="dropdown-item"
                    onClick={() => setMobileOpen(false)}
                  >
                    Visi kelionių įrašai
                  </Link>
                  <Link
                    to="/experiences/1"
                    className="dropdown-item"
                    onClick={() => setMobileOpen(false)}
                  >
                    Vienos kelionės puslapis
                  </Link>
                </div>
              )}
            </div>
            <Link
              to="/login"
              className="nav-link"
              onClick={() => setMobileOpen(false)}
            >
              Prisijungti
            </Link>
          </div>
        )}

        <button className="menu-toggle" onClick={toggleMenu}>
          {mobileOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>
    </header>
  );
}
