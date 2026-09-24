import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useFavorites } from '../context/FavoritesContext';
import { useCart } from '../context/CartContext';
import { Search, User, Heart, ShoppingCart, Menu, X, ChevronDown, ShoppingBag, LogOut } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const [langOpen, setLangOpen] = useState(false);
  const [mobileLangOpen, setMobileLangOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { lang, setLang, t } = useLanguage();
  const { user, openLoginModal } = useAuth();
  const { favorites } = useFavorites();
  const { getCartCount } = useCart();
  const menuRef = useRef(null);
  const langRef = useRef(null);

  const languages = {
    uz: { code: 'uz', name: "O'zbek", flagUrl: 'https://flagcdn.com/w40/uz.png' },
    ru: { code: 'ru', name: "Rus", flagUrl: 'https://flagcdn.com/w40/ru.png' },
    en: { code: 'en', name: "English", flagUrl: 'https://flagcdn.com/w40/gb.png' }
  };

  const activeLangConfig = languages[lang];

  // Close desktop lang dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (langRef.current && !langRef.current.contains(e.target)) {
        setLangOpen(false);
      }
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
        setMobileLangOpen(false);
      }
    };
    
    const handleScroll = () => {
      setLangOpen(false);
      setMenuOpen(false);
      setMobileLangOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleLangChange = (code) => {
    setLang(code);
    setLangOpen(false);
    setMobileLangOpen(false);
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
    if (menuOpen) {
      setMobileLangOpen(false);
    }
  };

  return (
    <header className="navbar">
      <div className="container navbar-container">
        {/* Logo */}
        <Link to="/" className="navbar-brand">
          <span>NAMDTU Bazaar</span>
        </Link>
        
        {/* Catalog button */}
        <button className="catalog-btn">
          <Menu size={18} />
          <span>{t('catalog')}</span>
        </button>
        
        {/* Search */}
        <div className="navbar-search">
          <input type="text" placeholder={t('searchPlaceholder')} className="search-input" />
          <button className="search-btn">
            <Search size={20} />
          </button>
        </div>

        {/* Desktop nav links */}
        <nav className="navbar-nav desktop-nav">
          {user ? (
            <div className="user-profile-wrapper">
              <Link to={user.role === 'admin' ? "/admin" : "/profile"} className="nav-link user-profile-link">
                {user.role === 'admin' ? (
                  <div className="avatar-circle">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                ) : (
                  <User size={22} />
                )}
                <span>{user.role === 'admin' ? user.name : 'Profil'}</span>
              </Link>
            </div>
          ) : (
            <button className="nav-link login-btn-nav" onClick={openLoginModal} style={{background:"transparent", border:"none", cursor:"pointer", color:"#fff"}}>
              <User size={22} />
              <span>{t('login')}</span>
            </button>
          )}
          <Link to="/favorites" className="nav-link">
            <div style={{position: 'relative', display: 'inline-flex'}}>
              <Heart size={22} />
              {favorites.length > 0 && (
                <span className="nav-badge">{favorites.length}</span>
              )}
            </div>
            <span>{t('favorites')}</span>
          </Link>
          <Link to="/cart" className="nav-link">
            <div style={{position: 'relative', display: 'inline-flex'}}>
              <ShoppingCart size={22} />
              {getCartCount() > 0 && (
                <span className="nav-badge">{getCartCount()}</span>
              )}
            </div>
            <span>{t('cart')}</span>
          </Link>
          <Link to="/orders" className="nav-link">
            <ShoppingBag size={22} />
            <span>{t('orders')}</span>
          </Link>
          
          {/* Language switcher desktop */}
          <div className="language-switcher" ref={langRef}>
            <button className="lang-active" onClick={() => setLangOpen(!langOpen)}>
              <span>{activeLangConfig.name}</span>
              <img src={activeLangConfig.flagUrl} alt={activeLangConfig.name} className="flag-img" />
              <ChevronDown size={14} style={{ transform: langOpen ? 'rotate(180deg)' : 'none', transition: '0.2s' }} />
            </button>
            
            {langOpen && (
              <div className="lang-dropdown">
                {Object.values(languages).map((l) => (
                  <div 
                    key={l.code}
                    className={`lang-option ${lang === l.code ? 'selected' : ''}`}
                    onClick={() => handleLangChange(l.code)}
                  >
                    <img src={l.flagUrl} alt={l.name} className="flag-img" />
                    <span>{l.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </nav>

        {/* Mobile menu button */}
        <div className="mobile-menu-wrapper" ref={menuRef}>
          <button className="mobile-menu-btn" onClick={toggleMenu} style={{ position: 'relative' }}>
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
            {!menuOpen && getCartCount() > 0 && (
              <span className="nav-badge" style={{ position: 'absolute', top: -5, right: -5, width: 16, height: 16, fontSize: 10 }}>
                {getCartCount()}
              </span>
            )}
          </button>

          {/* Mobile dropdown */}
          <div className={`mobile-dropdown ${menuOpen ? 'open' : ''}`}>
            <Link to="/catalog" className="mobile-link" onClick={() => setMenuOpen(false)}>
              <Menu size={20} />
              <span>{t('catalog')}</span>
            </Link>
            
            {user ? (
              <Link to={user.role === 'admin' ? "/admin" : "/profile"} className="mobile-link" onClick={() => setMenuOpen(false)}>
                <User size={22} />
                <span>{user.role === 'admin' ? user.name : 'Profil'}</span>
              </Link>
            ) : (
              <button className="mobile-link login-btn-nav" onClick={() => {setMenuOpen(false); openLoginModal();}} style={{background:"transparent", border:"none", width:"100%", textAlign:"left", cursor:"pointer", color:"#fff"}}>
                <User size={20} />
                <span>{t('login')}</span>
              </button>
            )}
            <Link to="/favorites" className="mobile-link" onClick={() => setMenuOpen(false)}>
              <Heart size={20} />
              <span>{t('favorites')}</span>
            </Link>
            <Link to="/cart" className="mobile-link" onClick={() => setMenuOpen(false)}>
              <div style={{ position: 'relative', display: 'inline-flex' }}>
                <ShoppingCart size={20} />
                {getCartCount() > 0 && (
                  <span className="nav-badge" style={{ position: 'absolute', top: -8, right: -10, width: 16, height: 16, fontSize: 10 }}>
                    {getCartCount()}
                  </span>
                )}
              </div>
              <span style={{ marginLeft: '12px' }}>{t('cart')}</span>
            </Link>
            <Link to="/orders" className="mobile-link" onClick={() => setMenuOpen(false)}>
              <ShoppingBag size={20} />
              <span>{t('orders')}</span>
            </Link>

            <div className="mobile-divider"></div>

            {/* Language switcher mobile */}
            <div className="mobile-lang">
              <button className="mobile-lang-btn" onClick={(e) => { e.stopPropagation(); setMobileLangOpen(!mobileLangOpen); }}>
                <img src={activeLangConfig.flagUrl} alt={activeLangConfig.name} className="flag-img" />
                <span>{activeLangConfig.name}</span>
                <ChevronDown size={14} style={{ transform: mobileLangOpen ? 'rotate(180deg)' : 'none', transition: '0.2s' }} />
              </button>
              
              <div className={`mobile-lang-options ${mobileLangOpen ? 'open' : ''}`}>
                {Object.values(languages).map((l) => (
                  <div 
                    key={l.code}
                    className={`mobile-lang-option ${lang === l.code ? 'selected' : ''}`}
                    onClick={(e) => { e.stopPropagation(); handleLangChange(l.code); }}
                  >
                    <img src={l.flagUrl} alt={l.name} className="flag-img-sm" />
                    <span>{l.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
