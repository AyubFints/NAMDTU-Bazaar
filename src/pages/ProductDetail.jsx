import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Heart, Star, ChevronLeft, ChevronRight, Minus, Plus, CheckCircle, ShoppingBag } from 'lucide-react';
import { useFavorites } from '../context/FavoritesContext';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import api from '../api/axios';
import './ProductDetail.css';
import './Home.css'; // For .product-card styles

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toggleFavorite, isFavorite } = useFavorites();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [allProducts, setAllProducts] = useState([]);
  const [selectedSize, setSelectedSize] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [activeTab, setActiveTab] = useState('description');
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [showStickyBar, setShowStickyBar] = useState(false);

  const { addToCart, updateQuantity, getCartItem, removeFromCart } = useCart();

  // Load product
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const { data } = await api.get('/products');
        setAllProducts(data);
        const numId = Number(id);
        const found = data.find(p => p.id === numId);
        setProduct(found || null);
      } catch (error) {
        console.error("Failed to load products", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();

    const numId = Number(id);
    const savedReviews = localStorage.getItem(`reviews_${numId}`);
    if (savedReviews) {
      setReviews(JSON.parse(savedReviews));
    } else {
      // Add dummy reviews if empty for display purposes
      setReviews([
        { id: 1, author: "shaxzoda", date: "8 Aprel", rating: 5, size: "110" },
        { id: 2, author: "shaxzoda", date: "8 Aprel", rating: 5, size: "116" }
      ]);
    }

    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    const handleScroll = () => {
      // Show sticky bar when scrolled past 500px
      if (window.scrollY > 500) {
        setShowStickyBar(true);
      } else {
        setShowStickyBar(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(0)
    : '5';

  const renderStars = (rating, size = 16) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star 
          key={i} 
          size={size} 
          fill={i <= rating ? "#f59e0b" : "#e2e8f0"} 
          color={i <= rating ? "#f59e0b" : "#e2e8f0"} 
        />
      );
    }
    return stars;
  };

  if (loading) {
    return (
      <div className="pd-wrapper">
        <div className="pd-main">
          {/* Image skeleton */}
          <div className="pd-gallery">
            <div className="skeleton" style={{width:'100%', aspectRatio:'1/1', borderRadius:'16px', marginBottom:'12px'}}></div>
            <div style={{display:'flex', gap:'8px'}}>
              {[1,2,3].map(i => <div key={i} className="skeleton" style={{width:'64px', height:'64px', borderRadius:'10px'}}></div>)}
            </div>
          </div>
          {/* Info skeleton */}
          <div className="pd-info">
            <div className="skeleton" style={{height:'16px', width:'40%', marginBottom:'12px'}}></div>
            <div className="skeleton" style={{height:'28px', width:'85%', marginBottom:'8px'}}></div>
            <div className="skeleton" style={{height:'28px', width:'60%', marginBottom:'20px'}}></div>
            <div className="skeleton" style={{height:'36px', width:'50%', marginBottom:'16px'}}></div>
            <div className="skeleton" style={{height:'20px', width:'35%', marginBottom:'24px'}}></div>
            <div className="skeleton" style={{height:'52px', width:'100%', borderRadius:'12px', marginBottom:'12px'}}></div>
            <div className="skeleton" style={{height:'52px', width:'100%', borderRadius:'12px'}}></div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="pd-not-found">
        <h2>Mahsulot topilmadi</h2>
        <button className="btn full-width-btn" onClick={() => navigate('/')} style={{maxWidth: 300}}>
          <ChevronLeft size={18} />
          <span>Bosh sahifaga qaytish</span>
        </button>
      </div>
    );
  }

  const productImages = (product.images && product.images.length > 0)
    ? product.images
    : (product.image ? [product.image] : ["https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=500&auto=format&fit=crop&q=60"]);

  const numericPrice = parseFloat(String(product.price).replace(/\D/g, '')) || 0;
  const numericOldPrice = product.oldPrice ? parseFloat(String(product.oldPrice).replace(/\D/g, '')) : 0;
  const formatMoney = (val) => Number(val).toLocaleString('uz-UZ') + " so'm";

  const cartItemId = selectedSize ? `${product.id}_${selectedSize}` : product.id;
  const cartItem = getCartItem(cartItemId);
  let maxStock = product.stock ? parseInt(product.stock, 10) : 999;
  if (product.sizes && product.sizes.length > 0 && selectedSize) {
    const szObj = product.sizes.find(s => s.size === selectedSize);
    maxStock = szObj ? parseInt(szObj.stock, 10) : 0;
  }

  const handleAddToCart = () => {
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      alert('Iltimos, avval razmerni tanlang!');
      return;
    }
    addToCart({ ...product, id: cartItemId, originalId: product.id, size: selectedSize });
  };

  return (
    <div className="pd-page">
      {/* Sticky Top Bar (Only visible when scrolled down) */}
      <div className={`pd-sticky-bar ${showStickyBar ? 'visible' : ''}`}>
        <div className="container pd-sticky-container">
          <div className="pd-sticky-left">
            <img src={productImages[0]} alt={product.name} />
            <div className="pd-sticky-info">
              <h4 title={product.name}>{product.name}</h4>
              <div className="pd-sticky-rating">
                <div className="pd-stars">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={12} fill="#f59e0b" color="#f59e0b" />
                  ))}
                </div>
                <span>{avgRating} ({reviews.length} sharh) • {product.orders || 9} buyurtma</span>
              </div>
            </div>
          </div>
          
          <div className="pd-sticky-price">
            <div className="pd-sticky-current">{numericPrice ? formatMoney(numericPrice) : product.price}</div>
            {numericOldPrice > 0 && <div className="pd-sticky-old">{formatMoney(numericOldPrice)}</div>}
          </div>

          <div className="pd-sticky-action">
            {cartItem ? (
              <div className="pd-cart-qty-controls sticky-qty">
                <button 
                  className="pd-qty-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (cartItem.quantity > 1) updateQuantity(cartItemId, -1);
                    else removeFromCart(cartItemId);
                  }}
                >
                  <Minus size={16} />
                </button>
                <span className="pd-qty-display">{cartItem.quantity}</span>
                <button 
                  className="pd-qty-btn"
                  onClick={(e) => { e.stopPropagation(); updateQuantity(cartItemId, 1); }}
                  disabled={cartItem.quantity >= maxStock}
                >
                  <Plus size={16} />
                </button>
              </div>
            ) : (
              <button 
                className="pd-buy-btn pd-sticky-buy-btn"
                onClick={handleAddToCart}
              >
                <div className="pd-buy-btn-main">Savatga qo'shish</div>
                <div className="pd-buy-btn-sub">Ertaga yetkazib beramiz</div>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Back button */}
      <button className="pd-back" onClick={() => navigate(-1)}>
        <ChevronLeft size={18} />
        <span>Orqaga</span>
      </button>

      {/* Main layout: 4 columns */}
      <div className="pd-top">
        {/* Col 1: Vertical thumbnails */}
        <div className="pd-thumbs-col">
          {productImages.map((img, idx) => (
            <div
              key={idx}
              className={`pd-thumb ${idx === activeImage ? 'active' : ''}`}
              onClick={() => setActiveImage(idx)}
            >
              <img src={img} alt="" />
            </div>
          ))}
        </div>

        {/* Col 2: Main image with arrows */}
        <div className="pd-image-col">
          <div className="pd-main-image">
            <img src={productImages[activeImage]} alt={product.name} />
            {productImages.length > 1 && (
              <>
                <button
                  className="pd-img-arrow left"
                  onClick={() => setActiveImage(i => (i - 1 + productImages.length) % productImages.length)}
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  className="pd-img-arrow right"
                  onClick={() => setActiveImage(i => (i + 1) % productImages.length)}
                >
                  <ChevronRight size={20} />
                </button>
              </>
            )}
            {product.badge && <span className="pd-badge">{product.badge}</span>}
          </div>
        </div>

        {/* Col 3: Title + rating + sizes */}
        <div className="pd-info-col">
          <h1 className="pd-title">
            {product.name}
          </h1>

          <div className="pd-rating-summary">
            <div className="pd-stars">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={14} fill="#f59e0b" color="#f59e0b" />
              ))}
            </div>
            <span className="pd-rating-count">{reviews.length} sharh</span>
            {reviews.length > 0 && <span className="pd-dot">·</span>}
            <span className="pd-rating-count">{reviews.length * 3 + 2} buyurtma</span>
          </div>

          {product.sizes && product.sizes.length > 0 && (
            <div className="pd-sizes-section">
              <div className="pd-sizes-title">
                razmer: <strong>{selectedSize || '—'}</strong>
              </div>
              <div className="pd-sizes-list">
                {product.sizes.map((sz, idx) => (
                  <button
                    key={idx}
                    className={`pd-size-btn ${selectedSize === sz.size ? 'active' : ''} ${sz.stock <= 0 ? 'disabled' : ''}`}
                    disabled={sz.stock <= 0}
                    onClick={() => setSelectedSize(sz.size)}
                  >
                    {sz.size}
                  </button>
                ))}
              </div>
              <button className="pd-sizes-link" onClick={() => setActiveTab('sizes')}>O'lchamlar haqida batafsil</button>
            </div>
          )}
        </div>

        {/* Col 4: Price & Purchase card */}
        <div className="pd-order-card">
          <div className="pd-price-row">
            <span className="pd-current-price">{numericPrice ? formatMoney(numericPrice) : product.price}</span>
          </div>
          {numericOldPrice > 0 && (
            <span className="pd-old-price">{formatMoney(numericOldPrice)}</span>
          )}

          <div className="pd-action-row">
            <button className="pd-one-click-btn">1 klikda xarid qilish</button>
            <button
              className={`pd-fav-btn ${isFavorite(product.id) ? 'active' : ''}`}
              onClick={() => toggleFavorite(product)}
            >
              <Heart size={20} fill={isFavorite(product.id) ? '#ef4444' : 'none'} color={isFavorite(product.id) ? '#ef4444' : '#94a3b8'} />
            </button>
          </div>

          {cartItem ? (
            <div className="pd-cart-qty-controls">
              <button className="pd-qty-btn" onClick={() => { if (cartItem.quantity > 1) { updateQuantity(cartItemId, -1); } else { removeFromCart(cartItemId); } }}>
                <Minus size={16} />
              </button>
              <span className="pd-qty-display">{cartItem.quantity}</span>
              <button className="pd-qty-btn" disabled={cartItem.quantity >= maxStock} onClick={() => updateQuantity(cartItemId, 1)}>
                <Plus size={16} />
              </button>
            </div>
          ) : (
            <button className="pd-buy-btn" onClick={handleAddToCart}>
              <div className="pd-buy-btn-main">Savatga qo'shish</div>
              <div className="pd-buy-btn-sub">Ertaga yetkazib beramiz</div>
            </button>
          )}

          {product.sizes && product.sizes.length > 0 ? (
            selectedSize && (() => {
              const sz = product.sizes.find(s => s.size === selectedSize);
              return sz && sz.stock > 0 ? (
                <div className="pd-stock-row">
                  <CheckCircle size={16} color="#16a34a" />
                  <span>Oxirigisi qoldi</span>
                </div>
              ) : null;
            })()
          ) : product.stock ? (
            <div className="pd-stock-row">
              <CheckCircle size={16} color="#16a34a" />
              <span>Oxirigisi qoldi</span>
            </div>
          ) : null}

          <div className="pd-in-carts-row">
            <ShoppingBag size={16} color="#8b5cf6" />
            <span>{(numericPrice % 200) + 50} kishining savatida</span>
          </div>
        </div>
      </div>

      {/* Uzum Style Bottom Layout */}
      <div className="pd-bottom-content">
        
        {/* Reviews Horizontal Section */}
        <div className="uzum-reviews-section">
          <div className="uzum-reviews-header">
            <span className="uzum-rating-big">{avgRating}</span>
            <div className="uzum-stars-row">
              {renderStars(Number(avgRating), 18)}
            </div>
            <span className="uzum-review-count">{reviews.length} sharh</span>
          </div>
          
          <div className="uzum-reviews-grid">
            <button className="uzum-review-arrow left"><ChevronLeft size={20} /></button>
            
            <div className="uzum-review-cards">
              {reviews.slice(0, 2).map((rev, idx) => (
                <div key={idx} className="uzum-review-card">
                  <div className="uzum-rev-top">
                    <div className="uzum-rev-author">{rev.author}</div>
                    <div className="uzum-rev-stars">{renderStars(rev.rating, 14)}</div>
                  </div>
                  <div className="uzum-rev-date">{rev.date}</div>
                  {rev.size && <div className="uzum-rev-size">размер: {rev.size}</div>}
                  {rev.comment && <div className="uzum-rev-comment">{rev.comment}</div>}
                </div>
              ))}
            </div>

            <button className="uzum-review-arrow right"><ChevronRight size={20} /></button>
          </div>

          <div className={`uzum-all-reviews-container ${showAllReviews ? 'open' : ''}`}>
            <div className="uzum-reviews-grid-vertical">
              {reviews.slice(2).map((rev, idx) => (
                <div key={idx} className="uzum-review-card">
                  <div className="uzum-rev-top">
                    <div className="uzum-rev-author">{rev.author}</div>
                    <div className="uzum-rev-stars">{renderStars(rev.rating, 14)}</div>
                  </div>
                  <div className="uzum-rev-date">{rev.date}</div>
                  {rev.size && <div className="uzum-rev-size">размер: {rev.size}</div>}
                  {rev.comment && <div className="uzum-rev-comment">{rev.comment}</div>}
                </div>
              ))}
            </div>
          </div>

          {reviews.length > 2 && (
            <button 
              className="uzum-all-reviews-btn" 
              onClick={() => setShowAllReviews(!showAllReviews)}
            >
              {showAllReviews ? 'Yopish' : "Hamma sharhlarni ko'rish"}
            </button>
          )}
        </div>

        {/* Info Tabs Section */}
        <div className="uzum-tabs-section">
          <div className="uzum-tabs-header">
            <button 
              className={`uzum-tab-btn ${activeTab === 'description' ? 'active' : ''}`}
              onClick={() => setActiveTab('description')}
            >
              Mahsulot tavsifi
            </button>
            <button 
              className={`uzum-tab-btn ${activeTab === 'sizes' ? 'active' : ''}`}
              onClick={() => setActiveTab('sizes')}
            >
              O'lchamlar
            </button>
            <button 
              className={`uzum-tab-btn ${activeTab === 'content' ? 'active' : ''}`}
              onClick={() => setActiveTab('content')}
            >
              Tarkib
            </button>
          </div>
          
          <div className="uzum-tab-content">
            {activeTab === 'description' && (
              <div className="uzum-desc-text">
                {product.description || "Ushbu mahsulot uchun batafsil tavsif hozircha mavjud emas. Mahsulot haqida to'liq ma'lumot olish uchun sotuvchiga murojaat qilishingiz mumkin."}
              </div>
            )}
            {activeTab === 'sizes' && (
              <div className="uzum-sizes-text">
                O'lchamlar standart qoliplarga mos keladi. O'zingiz kiyib yurgan odatiy razmerni tanlashingizni tavsiya qilamiz.
              </div>
            )}
            {activeTab === 'content' && (
              <div className="uzum-content-text">
                100% paxta
              </div>
            )}
          </div>
        </div>

        {/* Similar Products */}
        <div className="uzum-similar-section">
          <h2 className="uzum-similar-title">Shunga o'xshash tovarlar</h2>
          <div className="uzum-similar-grid">
            {allProducts
              .filter(p => p.id !== product.id)
              .slice(0, 6)
              .map((prod) => {
                const productImg = (prod.images && prod.images.length > 0) 
                  ? prod.images[0] 
                  : (prod.image || "https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=500&auto=format&fit=crop&q=60");

                const numPrice = parseFloat(String(prod.price).replace(/\D/g, '')) || 0;
                const numOldPrice = prod.oldPrice ? parseFloat(String(prod.oldPrice).replace(/\D/g, '')) : 0;
                const fmtMoney = (val) => Number(val).toLocaleString('uz-UZ') + " so'm";

                return (
                  <div key={prod.id} className="card product-card">
                    <div className="product-image" onClick={() => navigate(`/product/${prod.id}`)} style={{cursor: 'pointer'}}>
                      <img src={productImg} alt={prod.name} />
                      <button
                        className={`favorite-btn ${isFavorite(prod.id) ? 'active' : ''}`}
                        onClick={(e) => { e.stopPropagation(); toggleFavorite(prod); }}
                      >
                        <Heart
                          size={20}
                          fill={isFavorite(prod.id) ? '#ef4444' : 'none'}
                          color={isFavorite(prod.id) ? '#ef4444' : '#6b7280'}
                        />
                      </button>
                      {(prod.badge || prod.category) && (
                        <span className="category-badge" style={prod.badge ? {background: '#ec4899', color: '#fff'} : {background: 'rgba(255,255,255,0.9)', color: '#0a1052'}}>{prod.badge || prod.category}</span>
                      )}
                    </div>
                    <div className="product-info" onClick={() => navigate(`/product/${prod.id}`)} style={{cursor: 'pointer'}}>
                      <div className="price-block">
                        <span className="current-price">{numPrice ? fmtMoney(numPrice) : prod.price}</span>
                        {numOldPrice > 0 && <span className="old-price">{fmtMoney(numOldPrice)}</span>}
                      </div>
                      <h3 className="product-name" title={prod.name}>
                        {prod.brand && <strong style={{fontWeight: 700}}>{prod.brand} / </strong>}
                        {prod.name}
                      </h3>
                      <div className="rating-row">
                        <Star size={14} fill="#f59e0b" color="#f59e0b" />
                        <span>4.8 (574 sharhlar)</span>
                      </div>
                      
                      {(() => {
                        const cartItem = getCartItem(prod.id);
                        if (cartItem) {
                          return (
                            <div className="cart-qty-controls" onClick={(e) => e.stopPropagation()}>
                              <button 
                                className="qty-btn"
                                onClick={() => {
                                  if (cartItem.quantity > 1) {
                                    updateQuantity(prod.id, -1);
                                  } else {
                                    removeFromCart(prod.id);
                                  }
                                }}
                              >
                                <Minus size={16} />
                              </button>
                              <span className="qty-display">{cartItem.quantity}</span>
                              <button 
                                className="qty-btn"
                                onClick={() => updateQuantity(prod.id, 1)}
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
                              addToCart(prod); 
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
        </div>

      </div>

      {/* Mobile Bottom Fixed Bar */}
      <div className="pd-mobile-bottom-bar" onClick={() => navigate('/cart')} style={{cursor: 'pointer'}}>
        <div className="pd-mobile-price">
          <span className="pd-mobile-current">{numericPrice ? formatMoney(numericPrice) : product.price}</span>
          {numericOldPrice > 0 && <span className="pd-mobile-old">{formatMoney(numericOldPrice)}</span>}
        </div>
        <button className="pd-buy-btn" style={{color: '#fff', fontWeight: 'bold'}}>Savatga</button>
      </div>
    </div>
  );
};

export default ProductDetail;
