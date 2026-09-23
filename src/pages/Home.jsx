import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, ChevronDown, ChevronLeft, ChevronRight, Heart, ShoppingBag, Star, Minus, Plus } from 'lucide-react';
import { useFavorites } from '../context/FavoritesContext';
import { useCart } from '../context/CartContext';
import api from '../api/axios';
import './Home.css';


const CATEGORIES_LIST = [
  { id: 'all', label: 'Barchasi', icon: <ShieldCheck size={18} className="tag-icon" /> },
  { id: 'Trendli kiyimlar', label: 'Trendli kiyimlar', icon: null },
  { id: 'Onalar va bolalar', label: 'Onalar va bolalar', icon: null },
  { id: "Qo'l ishlari", label: "Qo'l ishlari", icon: null }
];

const SUBCATEGORIES_MAP = {
  'Trendli kiyimlar': [
    { id: 'k-1', label: 'Ayollar', image: 'https://images.unsplash.com/photo-1555529733-0e670560f4e1?w=150&h=150&fit=crop' },
    { id: 'k-2', label: 'Erkaklar', image: 'https://images.unsplash.com/photo-1434389678232-0690916053cb?w=150&h=150&fit=crop' },
    { id: 'k-3', label: 'Qishki', image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=150&h=150&fit=crop' }
  ],
  'Onalar va bolalar': [
    { id: 'o-1', label: 'Chaqaloqlar', image: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=150&h=150&fit=crop' },
    { id: 'o-2', label: "O'yinchoqlar", image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=150&h=150&fit=crop' }
  ],
  "Qo'l ishlari": [
    { id: 'q-1', label: "Sovg'alar", image: 'https://images.unsplash.com/photo-1493106819501-66d381c466f1?w=150&h=150&fit=crop' },
    { id: 'q-2', label: "San'at", image: 'https://images.unsplash.com/photo-1521742461971-ceb970621fb7?w=150&h=150&fit=crop' }
  ]
};

const HERO_SLIDES = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&auto=format&fit=crop&q=80",
    title: "Aziz Talabalar, Xush Kelibsiz!",
    subtitle: "O'z qo'l mehnatingiz bilan yaratgan mahsulotlarni soting va tengdoshlaringizning ajoyib ishlarini xarid qiling."
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1511130558090-00af810c2111?w=1200&auto=format&fit=crop&q=80",
    title: "Kuzgi kiyimlar to'plami",
    subtitle: "Kuz fasli uchun issiq va zamonaviy kiyimlar"
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=1200&auto=format&fit=crop&q=80",
    title: "Onalar va bolalar uchun",
    subtitle: "Eng sifatli va qulay mahsulotlar"
  }
];

const Home = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [showMoreCats, setShowMoreCats] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [allProducts, setAllProducts] = useState([]);
  const [banners, setBanners] = useState(HERO_SLIDES);
  const [loading, setLoading] = useState(true);
  const dropdownRef = useRef(null);
  const sliderRef = useRef(null);
  
  const { toggleFavorite, isFavorite } = useFavorites();
  const { addToCart, updateQuantity, getCartItem, removeFromCart } = useCart();
  const navigate = useNavigate();

  // Load admin products and banners from backend
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowMoreCats(false);
      }
    };
    const handleScroll = () => setShowMoreCats(false);
    
    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    const fetchHomeData = async () => {
      setLoading(true);
      try {
        const { data: productsData } = await api.get('/products');
        setAllProducts(productsData);
      } catch (error) {
        console.error("Failed to load products", error);
        setAllProducts([]);
      } finally {
        setLoading(false);
      }
      
      try {
        const { data: bannersData } = await api.get('/banners');
        if (bannersData && bannersData.length > 0) {
          setBanners(bannersData);
        }
      } catch (error) {
        console.error("Failed to load banners", error);
      }
    };
    fetchHomeData();
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const getSlideWidth = () => {
    if (!sliderRef.current) return 0;
    const slide = sliderRef.current.querySelector('.slide');
    if (!slide) return sliderRef.current.offsetWidth;
    const style = window.getComputedStyle(sliderRef.current);
    const gap = parseFloat(style.gap) || 0;
    return slide.offsetWidth + gap;
  };

  // Auto-advance slider
  useEffect(() => {
    const timer = setInterval(() => {
      if (sliderRef.current) {
        const slideWidth = getSlideWidth();
        if (sliderRef.current.scrollLeft + sliderRef.current.offsetWidth >= sliderRef.current.scrollWidth - 10) {
          sliderRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          sliderRef.current.scrollBy({ left: slideWidth, behavior: 'smooth' });
        }
      }
    }, 5000);
    return () => clearInterval(timer);
  }, [banners.length]);

  const handleSliderScroll = () => {
    if (!sliderRef.current) return;
    const slideWidth = getSlideWidth();
    const index = Math.round(sliderRef.current.scrollLeft / slideWidth);
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    if (sliderRef.current) {
      const slideWidth = getSlideWidth();
      sliderRef.current.scrollBy({ left: slideWidth, behavior: 'smooth' });
    }
  };

  const prevSlide = () => {
    if (sliderRef.current) {
      const slideWidth = getSlideWidth();
      sliderRef.current.scrollBy({ left: -slideWidth, behavior: 'smooth' });
    }
  };

  const activeCatObj = CATEGORIES_LIST.find(c => c.id === activeCategory) || CATEGORIES_LIST[0];
  const dropdownCats = CATEGORIES_LIST.filter(c => c.id !== activeCategory);

  return (
    <div className="home-page">
      {activeCategory === 'all' && (
        <section className="hero-slider-section">
          <div className="slider-container">
            <button className="slider-arrow left" onClick={prevSlide}>
              <ChevronLeft size={28} />
            </button>
            
            <div className="slider-track" ref={sliderRef} onScroll={handleSliderScroll}>
              {banners.map(slide => (
                <div className="slide" key={slide.id}>
                  {(slide.title || slide.subtitle) && (
                    <div className="slide-overlay">
                      {slide.title && <h2 className="slide-title">{slide.title}</h2>}
                      {slide.subtitle && <p className="slide-subtitle">{slide.subtitle}</p>}
                      <button className="slide-cta">Batafsil ko'rish</button>
                    </div>
                  )}
                  <img src={slide.image} alt={slide.title || "Banner"} />
                </div>
              ))}
            </div>

            <button className="slider-arrow right" onClick={nextSlide}>
              <ChevronRight size={28} />
            </button>

            <div className="slider-dots">
              {banners.map((_, idx) => (
                <span 
                  key={idx} 
                  className={`dot ${idx === currentSlide ? 'active' : ''}`} 
                  onClick={() => {
                    if (sliderRef.current) {
                      const slideWidth = getSlideWidth();
                      sliderRef.current.scrollTo({ left: slideWidth * idx, behavior: 'smooth' });
                    }
                  }}
                ></span>
              ))}
            </div>
          </div>
        </section>
      )}

      <div className="categories-bar">
        {/* Mobile: Shows only the currently selected category */}
        <button className="category-tag highlight mobile-active-tag">
          {activeCatObj.icon}
          <span>{activeCatObj.label}</span>
        </button>
        
        {/* Mobile: Dropdown for the rest */}
        <div className="more-dropdown-wrapper" ref={dropdownRef}>
          <button 
            className="category-tag more-btn"
            onClick={() => setShowMoreCats(!showMoreCats)}
          >
            <span>Yana</span>
            <ChevronDown size={16} className={`more-icon ${showMoreCats ? 'open' : ''}`} />
          </button>
          
          <div className={`more-dropdown-menu ${showMoreCats ? 'open' : ''}`}>
            {dropdownCats.map(cat => (
              <button 
                key={cat.id}
                className="dropdown-item"
                onClick={() => { setActiveCategory(cat.id); setShowMoreCats(false); }}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Desktop: Shows all categories */}
        {CATEGORIES_LIST.map(cat => (
          <button 
            key={cat.id}
            className={`category-tag desktop-tag ${activeCategory === cat.id ? 'highlight' : ''}`}
            onClick={() => setActiveCategory(cat.id)}
          >
            {cat.icon}
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      {activeCategory !== 'all' && SUBCATEGORIES_MAP[activeCategory] && (
        <div className="visual-categories-bar">
          {SUBCATEGORIES_MAP[activeCategory].map(sub => (
            <div 
              key={sub.id} 
              className="visual-category-item"
            >
              <div className="visual-category-img-wrap">
                <img src={sub.image} alt={sub.label} />
              </div>
              <span>{sub.label}</span>
            </div>
          ))}
        </div>
      )}

      <section className="products-section">
        {activeCategory !== 'all' && (
          <div className="section-header" style={{marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <h2>{activeCategory}</h2>
            <button 
              onClick={() => setActiveCategory('all')} 
              style={{background: 'none', border: 'none', color: '#7c3aed', fontWeight: 600, cursor: 'pointer'}}
            >
              Asosiy sahifaga qaytish
            </button>
          </div>
        )}

        <div className="products-grid">
          {loading ? (
            // Skeleton loading cards
            Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="card product-card skeleton-card">
                <div className="skeleton skeleton-img"></div>
                <div className="product-info">
                  <div className="skeleton skeleton-price"></div>
                  <div className="skeleton skeleton-title"></div>
                  <div className="skeleton skeleton-title" style={{width:'60%'}}></div>
                  <div className="skeleton skeleton-btn"></div>
                </div>
              </div>
            ))
          ) : allProducts.filter(p => activeCategory === 'all' || p.category === activeCategory).map(product => {
            // Determine the image to show (handle new multiple images array or old single image)
            const productImg = (product.images && product.images.length > 0) 
              ? product.images[0] 
              : (product.image || "https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=500&auto=format&fit=crop&q=60");

            const numericPrice = parseFloat(String(product.price).replace(/\D/g, '')) || 0;
            const numericOldPrice = product.oldPrice ? parseFloat(String(product.oldPrice).replace(/\D/g, '')) : 0;
            const monthlyPrice = numericPrice ? Math.round(numericPrice / 12) : 0;

            const formatMoney = (val) => Number(val).toLocaleString('uz-UZ') + " so'm";

            return (
              <div key={product.id} className="card product-card">
                <div className="product-image" onClick={() => navigate(`/product/${product.id}`)} style={{cursor: 'pointer'}}>
                  <img src={productImg} alt={product.name} />
                  <button
                    className={`favorite-btn ${isFavorite(product.id) ? 'active' : ''}`}
                    onClick={(e) => { e.stopPropagation(); toggleFavorite(product); }}
                  >
                    <Heart
                      size={20}
                      fill={isFavorite(product.id) ? '#ef4444' : 'none'}
                      color={isFavorite(product.id) ? '#ef4444' : '#6b7280'}
                    />
                  </button>
                  {(product.badge || product.category) && (
                    <span className="category-badge" style={product.badge ? {background: '#ec4899', color: '#fff'} : {background: 'rgba(255,255,255,0.9)', color: '#0a1052'}}>{product.badge || product.category}</span>
                  )}
                </div>
                <div className="product-info" onClick={() => navigate(`/product/${product.id}`)} style={{cursor: 'pointer'}}>
                  <div className="price-block">
                    <span className="current-price">{numericPrice ? formatMoney(numericPrice) : product.price}</span>
                    {numericOldPrice > 0 && <span className="old-price">{formatMoney(numericOldPrice)}</span>}
                  </div>
                  <h3 className="product-name" title={product.name}>
                    {product.brand && <strong style={{fontWeight: 700}}>{product.brand} / </strong>}
                    {product.name}
                  </h3>
                  <div className="rating-row">
                    <Star size={14} fill="#f59e0b" color="#f59e0b" />
                    <span>4.8 (574 sharhlar)</span>
                  </div>
                  
                  {(() => {
                    const cartItem = getCartItem(product.id);
                    if (cartItem) {
                      return (
                        <div className="cart-qty-controls" onClick={(e) => e.stopPropagation()}>
                          <button 
                            className="qty-btn"
                            onClick={() => {
                              if (cartItem.quantity > 1) {
                                updateQuantity(product.id, -1);
                              } else {
                                removeFromCart(product.id);
                              }
                            }}
                          >
                            <Minus size={16} />
                          </button>
                          <span className="qty-display">{cartItem.quantity}</span>
                          <button 
                            className="qty-btn"
                            onClick={() => updateQuantity(product.id, 1)}
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                      );
                    }
                    return (
                      <button 
                        className="btn full-width-btn" 
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          addToCart(product); 
                        }}
                      >
                        <ShoppingBag size={18} />
                        <span>Savatga</span>
                      </button>
                    );
                  })()}
                </div>
              </div>
            );
          })}
        </div>

        {activeCategory !== 'all' && (
          <div style={{display: 'flex', justifyContent: 'center', marginTop: '40px'}}>
            <button 
              className="profile-save-btn" 
              onClick={() => setActiveCategory('all')}
              style={{padding: '12px 24px', fontSize: '16px', maxWidth: '300px'}}
            >
              Boshqa tovarlarni ko'rish
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
