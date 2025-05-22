import { useState, useEffect, useRef, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Search as SearchIcon } from 'lucide-react';
import logo from '../../assets/logo.png';
import './nav-bar.css';
import { AuthContext } from '../../context/AuthContext';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [showSearch, setShowSearch] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [searchTerm, setSearchTerm] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const hoverTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { isAuthenticated, logout } = useContext(AuthContext);

  // Universalus uždarymas
  const closeMobileMenuAndSearch = () => {
    setShowSearch(false);
    setMobileOpen(false);
    setSearchTerm('');
    setActiveIndex(-1);
  };

  const toggleMenu = () => {
    setMobileOpen((open) => !open);
    setOpenDropdown(null);
    setShowSearch(false);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowSearch(false);
        setSearchTerm('');
        setActiveIndex(-1);
        setMobileOpen(false);
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
    if (showSearch) {
      document.addEventListener('mousedown', handleClickOutside);
      return () =>
        document.removeEventListener('mousedown', handleClickOutside);
    }
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

  const renderDropdown = (section: string) => {
    let items: { to: string; label: string }[] = [];

    if (section === 'places') {
      items = [
        { to: '/places', label: 'Visos vietos' },
        { to: '/places/hotels', label: 'Viešbučiai, sodybos, kempingai' },
        { to: '/places/beaches', label: 'Paplūdimiai' },
        { to: '/places/parks', label: 'Parkai ir kitos lauko vietos' },
      ];
    } else if (section === 'services') {
      items = [
        { to: '/services', label: 'Visos paslaugos' },
        { to: '/services/grooming', label: 'Šunų kirpyklos' },
        { to: '/services/hotels', label: 'Šunų viešbučiai' },
        { to: '/services/insurance', label: 'Draudimas' },
        { to: '/services/training', label: 'Dresuotojai' },
      ];
    } else if (section === 'experiences') {
      items = [
        { to: '/experiences', label: 'Visi kelionių įrašai' },
        { to: '/experiences/1', label: 'Vienos kelionės puslapis' },
      ];
    }

    return (
      <div className="dropdown-menu">
        {items.map((item, i) => (
          <Link
            key={i}
            to={item.to}
            className="dropdown-item"
            onClick={closeMobileMenuAndSearch}
          >
            {item.label}
          </Link>
        ))}
      </div>
    );
  };

  const handleDropdownEnter = (section: string) => {
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
    setOpenDropdown(section);
  };

  const handleDropdownLeave = () => {
    hoverTimeout.current = setTimeout(() => {
      setOpenDropdown(null);
    }, 200);
  };

  const sections = [
    { key: 'places', label: 'Vietos' },
    { key: 'services', label: 'Paslaugos' },
    { key: 'experiences', label: 'Kelionių patirtys' },
  ];

  // Paieškos inputas su ikonėle
  const renderSearchBox = () => (
    <div className="search-box">
      <div className="search-input-wrapper">
        <SearchIcon className="search-input-icon" />
        <input
          ref={inputRef}
          type="text"
          className="search-input"
          placeholder="Ieškoti vietos, paslaugos, patirties..."
          value={searchTerm}
          onClick={(e) => e.stopPropagation()}
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
              closeMobileMenuAndSearch();
            }
          }}
          autoFocus
        />
        {/* Išvalymo X mygtukas */}
        {searchTerm && (
          <button
            className="search-clear-btn"
            onClick={(e) => {
              e.stopPropagation();
              setSearchTerm('');
              setActiveIndex(-1);
              inputRef.current?.focus();
            }}
            aria-label="Išvalyti paiešką"
            type="button"
            tabIndex={0}
          >
            &#10005;
          </button>
        )}
      </div>
      {/* Rezultatų sąrašas žemiau */}
      {searchTerm && (
        <div className="search-results">
          {filteredResults.length > 0 ? (
            filteredResults.map((result, i) => (
              <div
                key={i}
                className={`search-result-item ${
                  i === activeIndex ? 'active' : ''
                }`}
                onClick={() => {
                  alert(`Pasirinkta: ${result}`);
                  closeMobileMenuAndSearch();
                }}
              >
                {result}
              </div>
            ))
          ) : (
            <div className="search-result-item no-result">Nieko nerasta...</div>
          )}
        </div>
      )}
    </div>
  );

  return (
    <header>
      <div className="container">
        <Link to="/" className="logo-wrapper">
          <img src={logo} alt="Logo" className="logo" />
          <span className="logo-text">WithYourDog</span>
        </Link>

        {/* --- DESKTOP NAV --- */}
        <nav className="nav-desktop">
          <div className="search-container" ref={searchRef}>
            {showSearch ? (
              renderSearchBox()
            ) : (
              <SearchIcon
                className="search-icon"
                onClick={() => {
                  setShowSearch(true);
                  setTimeout(() => inputRef.current?.focus(), 0);
                }}
              />
            )}
          </div>

          <Link to="/" className="nav-link">
            Pradžia
          </Link>

          {isAuthenticated ? (
            <button onClick={logout} className="nav-link logout-button">
              Atsijungti
            </button>
          ) : (
            <Link to="/login" className="nav-link">
              Prisijungti
            </Link>
          )}

          {sections.map((section) => (
            <div
              key={section.key}
              className={`nav-dropdown ${
                openDropdown === section.key ? 'hover-open' : ''
              }`}
              onMouseEnter={() => handleDropdownEnter(section.key)}
              onMouseLeave={handleDropdownLeave}
            >
              <span className="nav-link">{section.label}</span>
              {openDropdown === section.key && renderDropdown(section.key)}
            </div>
          ))}
        </nav>

        {/* --- MOBILE NAV --- */}
        {mobileOpen && (
          <>
            <div
              className="mobile-nav-overlay"
              onClick={closeMobileMenuAndSearch}
              aria-label="Uždaryti meniu"
              tabIndex={-1}
            />
            <nav className="nav-mobile">
              <div
                className="drawer-inner"
                role="navigation"
                aria-label="Mobilus meniu"
              >
                {/* Paieškos blokas */}
                <div className="search-container center" ref={searchRef}>
                  {showSearch ? (
                    renderSearchBox()
                  ) : (
                    <SearchIcon
                      className="search-icon"
                      onClick={() => setShowSearch(true)}
                    />
                  )}
                </div>

                {/* Navigacijos sekcijos */}
                {sections.map((section) => (
                  <div
                    key={section.key}
                    className="nav-dropdown"
                    onMouseEnter={() => handleDropdownEnter(section.key)}
                    onMouseLeave={handleDropdownLeave}
                  >
                    <span className="nav-link">{section.label}</span>
                    {openDropdown === section.key &&
                      renderDropdown(section.key)}
                  </div>
                ))}

                {/* Autentifikacijos mygtukai */}
                {isAuthenticated ? (
                  <button onClick={logout} className="nav-link logout-button">
                    Atsijungti
                  </button>
                ) : (
                  <Link
                    to="/login"
                    className="nav-link"
                    onClick={closeMobileMenuAndSearch}
                  >
                    Prisijungti
                  </Link>
                )}
              </div>
            </nav>
          </>
        )}

        <button className="menu-toggle" onClick={toggleMenu}>
          {mobileOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>
    </header>
  );
}
