import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, ChevronDown, ChevronLeft, ChevronRight, Heart, ShoppingBag, Star, Minus, Plus } from 'lucide-react';
import { useFavorites } from '../context/FavoritesContext';
import { useCart } from '../context/CartContext';
import './Home.css';

const MOCK_PRODUCTS = [
  {
    id: 1,
    name: "Qo'lda to'qilgan qishki sharf",
    price: "45,000 UZS",
    image: "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=500&auto=format&fit=crop&q=60",
    author: "Malika (Dizayn fakulteti)",
    category: "Kiyim"
  },
  {
    id: 2,
    name: "Yog'ochdan ishlangan qalamdon",
    price: "25,000 UZS",
    image: "https://images.unsplash.com/photo-1590725140246-2003eaeb705e?w=500&auto=format&fit=crop&q=60",
    author: "Sardor (Texnologiya fakulteti)",
    category: "Hunar"
  },
  {
    id: 3,
    name: "Eko-sumka (Shopper)",
    price: "30,000 UZS",
    image: "https://images.unsplash.com/photo-1597484661643-2f5fef640eb1?w=500&auto=format&fit=crop&q=60",
    author: "Zuhra (Ekologiya fakulteti)",
    category: "Aksessuar"
  },
  {
    id: 4,
    name: "Milliylashtirilgan zamonaviy ko'ylak",
    price: "120,000 UZS",
    image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=500&auto=format&fit=crop&q=60",
    author: "Kamola (Dizayn fakulteti)",
    category: "Kiyim"
  }
];

const CATEGORIES_LIST = [
  { id: 'arzon', label: 'Arzon narxlar kafolati', icon: <ShieldCheck size={18} className="tag-icon" /> },
  { id: 'trend', label: 'Trendli kiyimlar', icon: null },
  { id: 'onalar', label: 'Onalar va bolalar', icon: null },
  { id: 'qol-ishlari', label: "Qo'l ishlari", icon: null }
];

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
  const [activeCategory, setActiveCategory] = useState('arzon');
  const [showMoreCats, setShowMoreCats] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [allProducts, setAllProducts] = useState(MOCK_PRODUCTS);
  const [banners, setBanners] = useState(HERO_SLIDES);
  
  const { toggleFavorite, isFavorite } = useFavorites();
  const { addToCart, updateQuantity, getCartItem, removeFromCart } = useCart();
  const navigate = useNavigate();

  // Load admin products and banners from localStorage
  useEffect(() => {
    const savedProducts = localStorage.getItem('products');
    if (savedProducts) {
      const adminProducts = JSON.parse(savedProducts);
      const approvedProducts = adminProducts.filter(p => p.status !== 'pending');
      setAllProducts([...approvedProducts, ...MOCK_PRODUCTS]);
    }
    
    const savedBanners = localStorage.getItem('hero_banners');
    if (savedBanners) {
      const parsedBanners = JSON.parse(savedBanners);
      if (parsedBanners.length > 0) {
        setBanners(parsedBanners);
      }
    }
  }, []);

  // Auto-advance slider
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [banners.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % banners.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const activeCatObj = CATEGORIES_LIST.find(c => c.id === activeCategory) || CATEGORIES_LIST[0];
  const dropdownCats = CATEGORIES_LIST.filter(c => c.id !== activeCategory);

  return (
    <div className="home-page">
      <div className="categories-bar">
        {/* Mobile: Shows only the currently selected category */}
        <button className="category-tag highlight mobile-active-tag">
          {activeCatObj.icon}
          <span>{activeCatObj.label}</span>
        </button>
        
        {/* Mobile: Dropdown for the rest */}
        <div className="more-dropdown-wrapper">
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

      <section className="hero-slider-section">
        <div className="slider-container">
          <button className="slider-arrow left" onClick={prevSlide}>
            <ChevronLeft size={28} />
          </button>
          
          <div className="slider-track" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
            {banners.map(slide => (
              <div className="slide" key={slide.id}>
                <img src={slide.image} alt={slide.title} />
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
                onClick={() => setCurrentSlide(idx)}
              ></span>
            ))}
          </div>
        </div>
      </section>

      <section className="products-section">
        <div className="section-header">
          <h2>Yangi Mahsulotlar</h2>
          <div className="filters">
            <button className="filter-btn active">Barchasi</button>
            <button className="filter-btn">Kiyimlar</button>
            <button className="filter-btn">Hunarmandchilik</button>
            <button className="filter-btn">San'at</button>
          </div>
        </div>

        <div className="products-grid">
          {allProducts.map(product => {
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
      </section>
    </div>
  );
};

export default Home;
