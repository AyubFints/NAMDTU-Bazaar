import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useFavorites } from '../context/FavoritesContext';
import { useCart } from '../context/CartContext';
import { Search, User, Heart, ShoppingCart, Menu, X, ChevronDown, ShoppingBag, LogOut, ShieldCheck } from 'lucide-react';
import './Navbar.css';
import api from '../api/axios';

const Navbar = () => {
  const [langOpen, setLangOpen] = useState(false);
  const [mobileLangOpen, setMobileLangOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [categories, setCategories] = useState([]);
  const { lang, setLang, t } = useLanguage();
  const { user, openLoginModal } = useAuth();
  const { favorites } = useFavorites();
  const { getCartCount } = useCart();
  const menuRef = useRef(null);
  const langRef = useRef(null);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  const getFirstName = () => {
    if (!user || !user.name || user.name === 'Foydalanuvchi') return 'Profil';
    const parts = user.name.split(' ');
    return parts.length > 1 ? parts.slice(1).join(' ') : parts[0];
  };

  const languages = {
    uz: { code: 'uz', name: "O'zbek", flagUrl: 'https://flagcdn.com/w40/uz.png' },
    ru: { code: 'ru', name: "Rus", flagUrl: 'https://flagcdn.com/w40/ru.png' },
    en: { code: 'en', name: "English", flagUrl: 'https://flagcdn.com/w40/gb.png' }
  };

  const activeLangConfig = languages[lang];

  // Close dropdowns when clicking outside or scrolling
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (langRef.current && !langRef.current.contains(e.target)) {
        setLangOpen(false);
      }
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
        setMobileLangOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchFocused(false);
      }
    };
    
    const handleScroll = () => {
      setLangOpen(false);
      setMenuOpen(false);
      setMobileLangOpen(false);
      setSearchFocused(false);
    };

    const fetchCategories = async (retries = 3) => {
      for (let i = 0; i < retries; i++) {
        try {
          const { data } = await api.get('/categories');
          setCategories(data || []);
          return;
        } catch (error) {
          if (i < retries - 1) {
            await new Promise(r => setTimeout(r, 2000));
          } else {
            console.error('Failed to load categories', error);
          }
        }
      }
    };

    fetchCategories();

    // Listen for custom event if categories are updated from Admin Panel
    const handleCategoriesUpdate = () => {
      fetchCategories(1);
    };
    window.addEventListener('categoriesUpdated', handleCategoriesUpdate);

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    window.addEventListener('scroll', handleScroll, { passive: true });
    document.addEventListener('touchmove', handleScroll, { passive: true });
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('touchmove', handleScroll);
      window.removeEventListener('categoriesUpdated', handleCategoriesUpdate);
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
        <div className="navbar-search-wrapper" ref={searchRef}>
          <div className="navbar-search">
            <input 
              type="text" 
              placeholder={t('searchPlaceholder')} 
              className="search-input" 
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
            />
            <button className="search-btn">
              <Search size={20} />
            </button>
          </div>
          
          {/* Categories Dropdown */}
          <div className={`search-categories-dropdown ${searchFocused ? 'show' : ''}`}>
            <div className="search-categories-scroll">
              <button 
                className="category-btn active" 
                onClick={() => {
                  setSearchFocused(false);
                  navigate('/?category=all');
                }}
              >
                <ShieldCheck size={16} style={{marginRight: '6px'}} />
                Barchasi
              </button>
              {categories.map((cat, idx) => (
                <button 
                  key={idx} 
                  className="category-btn" 
                  onClick={() => {
                    setSearchFocused(false);
                    navigate(`/?category=${encodeURIComponent(cat.name || cat)}`);
                  }}
                >
                  {cat.name || cat}
                </button>
              ))}
            </div>
          </div>
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
                <span>{getFirstName()}</span>
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
                <span>{getFirstName()}</span>
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
