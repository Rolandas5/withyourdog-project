import { useState, useEffect, useRef, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Search as SearchIcon } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';

interface NavbarProps {
  onLoginClick: () => void;
  onRegisterClick: () => void;
}

export default function Navbar({ onLoginClick, onRegisterClick }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [showSearch, setShowSearch] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [searchTerm, setSearchTerm] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const hoverTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastLinkRef = useRef<HTMLSpanElement | null>(null);
  const lastDropdownRef = useRef<HTMLDivElement | null>(null);
  const { isAuthenticated, user, logout } = useContext(AuthContext);

  const sections = [
    { key: 'places', label: 'Vietos' },
    { key: 'services', label: 'Paslaugos' },
    { key: 'experiences', label: 'Kelionių patirtys' },
  ];

  console.log('Navbar user:', user);
  console.log('isAuthenticated:', isAuthenticated);

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

  useEffect(() => {
    if (window.innerWidth > 768 && openDropdown === 'experiences') {
      const link = lastLinkRef.current;
      const dropdown = lastDropdownRef.current;
      if (link && dropdown) {
        const linkRect = link.getBoundingClientRect();
        const dropdownRect = dropdown.getBoundingClientRect();
        const overflowRight =
          linkRect.left + dropdownRect.width > window.innerWidth;

        if (overflowRight) {
          dropdown.style.left = 'auto';
          dropdown.style.right = '0';
          dropdown.style.transform = 'none';
          dropdown.style.marginLeft = '0';
        } else {
          dropdown.style.left = '';
          dropdown.style.right = '';
          dropdown.style.transform = '';
          dropdown.style.marginLeft = '';
        }
      }
    }
  }, [openDropdown]);

  const handleDropdownEnter = (section: string) => {
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
    setOpenDropdown(section);
  };

  const handleDropdownLeave = () => {
    hoverTimeout.current = setTimeout(() => {
      setOpenDropdown(null);
    }, 200);
  };

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

  const renderDropdown = (
    section: string,
    ref?: React.RefObject<HTMLDivElement>
  ) => {
    let items: { to: string; label: string }[] = [];

    if (section === 'places') {
      items = [
        { to: '/places', label: 'Visos vietos' },
        { to: '/places/hotels', label: 'Viešbučiai, sodybos, kempingai' },
        { to: '/places/beaches', label: 'Paplūdimiai' },
        { to: '/places/parks', label: 'Parkai ir kitos vietos' },
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
      <div className="dropdown-menu" ref={ref}>
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

  return (
    <header>
      <div className="container">
        <Link to="/" className="logo-wrapper">
          <img src="/assets/logo.png" alt="Logo" className="logo" />
        </Link>
        <span className="logo-text">WithYourDog</span>

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

          {isAuthenticated && (
            <Link to="/dashboard" className="nav-link">
              Profilis
            </Link>
          )}

          {!isAuthenticated && (
            <button onClick={onLoginClick} className="nav-link">
              Prisijungti
            </button>
          )}
          {isAuthenticated && (
            <button onClick={logout} className="nav-link logout-button">
              Atsijungti
            </button>
          )}

          {sections.map((section, idx) => {
            const isLast = idx === sections.length - 1;
            return (
              <div
                key={section.key}
                className={`nav-dropdown ${isLast ? 'last-dropdown' : ''} ${
                  openDropdown === section.key ? 'hover-open' : ''
                }`}
                onMouseEnter={() => handleDropdownEnter(section.key)}
                onMouseLeave={handleDropdownLeave}
              >
                <span className="nav-link" ref={isLast ? lastLinkRef : null}>
                  {section.label}
                </span>
                {openDropdown === section.key &&
                  renderDropdown(
                    section.key,
                    isLast
                      ? (lastDropdownRef as React.RefObject<HTMLDivElement>)
                      : undefined
                  )}
              </div>
            );
          })}
        </nav>

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
                <div className="mobile-search-wrapper">
                  <div className="search-container" ref={searchRef}>
                    {showSearch ? (
                      renderSearchBox()
                    ) : (
                      <SearchIcon
                        className="search-icon"
                        onClick={() => setShowSearch(true)}
                      />
                    )}
                  </div>
                </div>

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

                {isAuthenticated ? (
                  <button onClick={logout} className="nav-link logout-button">
                    Atsijungti
                  </button>
                ) : (
                  <button
                    className="nav-link login-btn"
                    onClick={() => {
                      closeMobileMenuAndSearch();
                      onLoginClick();
                    }}
                  >
                    Prisijungti
                  </button>
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
