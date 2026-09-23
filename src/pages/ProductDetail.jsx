import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Heart, Star, ChevronLeft, ChevronRight, Minus, Plus, CheckCircle, ShoppingBag, ChevronDown, ChevronUp } from 'lucide-react';
import { useFavorites } from '../context/FavoritesContext';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import api from '../api/axios';
import './ProductDetail.css';
import './Home.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toggleFavorite, isFavorite } = useFavorites();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [allProducts, setAllProducts] = useState([]);
  const [selectedSize, setSelectedSize] = useState(null);
  const [showAllSizes, setShowAllSizes] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [activeTab, setActiveTab] = useState('description');
  const [showStickyBar, setShowStickyBar] = useState(false);
  const [showMoreThumbs, setShowMoreThumbs] = useState(false);

  const { addToCart, updateQuantity, getCartItem, removeFromCart } = useCart();

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
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 500) {
        setShowStickyBar(true);
      } else {
        setShowStickyBar(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const avgRating = '5.0';

  if (loading) {
    return (
      <div className="pd-wrapper">
        <div className="pd-main">
          <div className="pd-gallery">
            <div className="skeleton" style={{width:'100%', aspectRatio:'1/1', borderRadius:'16px', marginBottom:'12px'}}></div>
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

  const handleNoInfoClick = () => {
    alert("Hozircha ma'lumot yo'q");
  };

  const visibleThumbs = showMoreThumbs ? productImages : productImages.slice(0, 9);
  const hiddenThumbsCount = productImages.length - 9;

  return (
    <div className="pd-page">
      {/* Sticky Top Bar */}
      <div className={`pd-sticky-bar ${showStickyBar ? 'visible' : ''}`}>
        <div className="container pd-sticky-container">
          <div className="pd-sticky-left">
            <img src={productImages[0]} alt={product.name} />
            <div className="pd-sticky-info">
              <h4 title={product.name}>{product.name}</h4>
              <div className="pd-sticky-rating">
                <Star size={12} fill="#f59e0b" color="#f59e0b" />
                <span>{avgRating} (3 sharh) • {product.orders || 9} buyurtma</span>
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
                <button className="pd-qty-btn" onClick={(e) => { e.stopPropagation(); if (cartItem.quantity > 1) updateQuantity(cartItemId, -1); else removeFromCart(cartItemId); }}>
                  <Minus size={16} />
                </button>
                <span className="pd-qty-display">{cartItem.quantity}</span>
                <button className="pd-qty-btn" onClick={(e) => { e.stopPropagation(); updateQuantity(cartItemId, 1); }} disabled={cartItem.quantity >= maxStock}>
                  <Plus size={16} />
                </button>
              </div>
            ) : (
              <button className="pd-buy-btn pd-sticky-buy-btn" onClick={handleAddToCart}>
                <div className="pd-buy-btn-main">Savatga qo'shish</div>
                <div className="pd-buy-btn-sub">Ertaga yetkazib beramiz</div>
              </button>
            )}
          </div>
        </div>
      </div>

      <button className="pd-back" onClick={() => navigate(-1)}>
        <ChevronLeft size={18} />
        <span>Orqaga</span>
      </button>

      {/* Main layout */}
            {/* Main layout */}
      <div className="pd-top">
        
        {/* Col 1: Vertical thumbs (Desktop) */}
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

        {/* Col 2: Main image */}
        <div className="pd-image-col">
          <div className="pd-mobile-sticky-wrapper">
             <div className="pd-main-image-container">
                <div className="pd-main-image" onTouchStart={(e) => {
                     const startX = e.touches[0].clientX;
                     const handleTouchEnd = (te) => {
                         const endX = te.changedTouches[0].clientX;
                         if (startX - endX > 50) {
                             setActiveImage(i => (i + 1) % productImages.length);
                         } else if (startX - endX < -50) {
                             setActiveImage(i => (i - 1 + productImages.length) % productImages.length);
                         }
                         document.removeEventListener('touchend', handleTouchEnd);
                     };
                     document.addEventListener('touchend', handleTouchEnd);
                }}>
                  <img src={productImages[activeImage]} alt={product.name} />
                  
                  {/* Desktop arrows */}
                  {productImages.length > 1 && (
                    <div className="pd-desktop-arrows">
                      <button className="pd-img-arrow left" onClick={(e) => {e.stopPropagation(); setActiveImage(i => (i - 1 + productImages.length) % productImages.length);}}>
                        <ChevronLeft size={20} />
                      </button>
                      <button className="pd-img-arrow right" onClick={(e) => {e.stopPropagation(); setActiveImage(i => (i + 1) % productImages.length);}}>
                        <ChevronRight size={20} />
                      </button>
                    </div>
                  )}

                  {/* Mobile slider indicators */}
                  {productImages.length > 1 && (
                    <div className="pd-mobile-indicators">
                      {productImages.map((_, idx) => (
                        <div key={idx} className={`pd-dot ${idx === activeImage ? 'active' : ''}`} />
                      ))}
                    </div>
                  )}

                  {product.badge && <span className="pd-badge">{product.badge}</span>}
                </div>
             </div>
          </div>
        </div>

        {/* Mobile Slide-up Overlay Container */}
        <div className="pd-details-overlay">\n          <div className="pd-info-col">
            <h1 className="pd-title">{product.name}</h1>
            <div className="pd-rating-summary">
              <div className="pd-stars">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} fill="#f59e0b" color="#f59e0b" />
                ))}
              </div>
              <span className="pd-rating-count">5.0 (3 sharh)</span>
              <span className="pd-dot">·</span>
              <span className="pd-rating-count">10+ buyurtma</span>
            </div>

            {product.sizes && product.sizes.length > 0 && (
              <div className="pd-sizes-section">
                <div className="pd-sizes-title">
                  razmer: <strong>{selectedSize || '—'}</strong>
                </div>
                <div className="pd-sizes-list">
                  {product.sizes.slice(0, showAllSizes ? product.sizes.length : 5).map((sz, idx) => (
                    <button
                      key={idx}
                      className={`pd-size-btn ${selectedSize === sz.size ? 'active' : ''} ${sz.stock <= 0 ? 'disabled' : ''}`}
                      disabled={sz.stock <= 0}
                      onClick={() => setSelectedSize(sz.size)}
                    >
                      {sz.size}
                    </button>
                  ))}
                  {product.sizes.length > 5 && (
                    <button 
                      className="pd-size-btn pd-size-toggle" 
                      onClick={() => setShowAllSizes(!showAllSizes)}
                      style={{ padding: '0 8px', background: 'transparent', border: '1px dashed #cbd5e1' }}
                    >
                      {showAllSizes ? <ChevronUp size={18} color="#64748b" /> : <ChevronDown size={18} color="#64748b" />}
                    </button>
                  )}
                </div>
                <button className="pd-sizes-link" onClick={() => setActiveTab('sizes')}>O'lchamlar haqida batafsil</button>
              </div>
            )}

            {/* Uzum-style Info Cards */}
            <div className="uzum-info-cards">
               {/* Price Card */}
               <div className="uzum-info-card pd-price-card">
                  <div className="pd-price-row-large">
                     <span className="pd-current-price-large">{numericPrice ? formatMoney(numericPrice) : product.price}</span>
                     {numericOldPrice > 0 && <span className="pd-old-price-large">{formatMoney(numericOldPrice)}</span>}
                  </div>
               </div>

               {/* Delivery Card */}
               <div className="uzum-info-card">
                  <div className="uzum-delivery-header">Ertaga yetkazib beramiz</div>
                  <div className="uzum-delivery-sub">Topshirish punktiga yoki kuryer orqali</div>
               </div>

               {/* Payment Logos Card */}
               <div className="uzum-info-card">
                  <div className="uzum-payment-header">Qulay usulda xavfsiz to'lov</div>
                  <div className="uzum-payment-sub">Karta orqali, naqd pulda yoki bo'lib to'lang</div>
                  <div className="uzum-payment-logos" onClick={handleNoInfoClick}>
                     <img src="https://uzum.uz/images/uzum-bank-logo.png" alt="Uzum" className="p-logo" onError={(e)=>e.target.style.display='none'} />
                     <div className="p-logo-placeholder p-uzum">uzum</div>
                     <div className="p-logo-placeholder p-humo">HUMO</div>
                     <div className="p-logo-placeholder p-uzcard">Uzcard</div>
                     <div className="p-logo-placeholder p-visa">VISA</div>
                     <div className="p-logo-placeholder p-master">MC</div>
                  </div>
               </div>

               {/* Return Policy Card */}
               <div className="uzum-info-card">
                  <div className="uzum-return-header">Qaytarish oson va tez</div>
                  <div className="uzum-return-sub">
                    Qaytarish shartlari mahsulot toifasiga bog'liq. <span className="uzum-link" onClick={handleNoInfoClick}>Batafsil</span>
                  </div>
               </div>
            </div>
          </div>

          <div className="pd-order-card">
            {/* Desktop Action block (Mobile uses fixed bottom bar) */}
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

            <div className="pd-in-carts-row">
              <ShoppingBag size={16} color="#8b5cf6" />
              <span>{(numericPrice % 200) + 50} kishining savatida</span>
            </div>
          </div>

          {/* Info Tabs Section */}
          <div className="uzum-tabs-section">
            <div className="uzum-tabs-header">
              <button className={`uzum-tab-btn ${activeTab === 'description' ? 'active' : ''}`} onClick={() => setActiveTab('description')}>Mahsulot tavsifi</button>
              <button className={`uzum-tab-btn ${activeTab === 'sizes' ? 'active' : ''}`} onClick={() => setActiveTab('sizes')}>O'lchamlar</button>
              <button className={`uzum-tab-btn ${activeTab === 'content' ? 'active' : ''}`} onClick={() => setActiveTab('content')}>Tarkib</button>
            </div>
            
            <div className="uzum-tab-content">
              {activeTab === 'description' && (
                <div className="uzum-desc-text">
                  {product.description || "Ushbu mahsulot uchun batafsil tavsif hozircha mavjud emas."}
                </div>
              )}
              {activeTab === 'sizes' && (
                <div className="uzum-sizes-text">O'lchamlar standart qoliplarga mos keladi.</div>
              )}
              {activeTab === 'content' && (
                <div className="uzum-content-text">100% paxta</div>
              )}
            </div>
          </div>

          {/* Similar Products */}
          <div className="uzum-similar-section">
            <h2 className="uzum-similar-title">Shunga o'xshash tovarlar</h2>
            <div className="uzum-similar-grid">
              {allProducts.filter(p => p.id !== product.id).slice(0, 6).map((prod) => {
                  const productImg = (prod.images && prod.images.length > 0) ? prod.images[0] : (prod.image || "https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=500&auto=format&fit=crop&q=60");
                  const numPrice = parseFloat(String(prod.price).replace(/\D/g, '')) || 0;
                  const numOldPrice = prod.oldPrice ? parseFloat(String(prod.oldPrice).replace(/\D/g, '')) : 0;
                  return (
                    <div key={prod.id} className="card product-card">
                      <div className="product-image" onClick={() => navigate(`/product/${prod.id}`)} style={{cursor: 'pointer'}}>
                        <img src={productImg} alt={prod.name} />
                        <button className={`favorite-btn ${isFavorite(prod.id) ? 'active' : ''}`} onClick={(e) => { e.stopPropagation(); toggleFavorite(prod); }}>
                          <Heart size={20} fill={isFavorite(prod.id) ? '#ef4444' : 'none'} color={isFavorite(prod.id) ? '#ef4444' : '#6b7280'} />
                        </button>
                      </div>
                      <div className="product-info" onClick={() => navigate(`/product/${prod.id}`)} style={{cursor: 'pointer'}}>
                        <div className="price-block">
                          <span className="current-price">{numPrice ? formatMoney(numPrice) : prod.price}</span>
                          {numOldPrice > 0 && <span className="old-price">{formatMoney(numOldPrice)}</span>}
                        </div>
                        <h3 className="product-name" title={prod.name}>{prod.name}</h3>
                        <div className="rating-row"><Star size={14} fill="#f59e0b" color="#f59e0b" /><span>4.8 (574 sharhlar)</span></div>
                        {(() => {
                          const cItem = getCartItem(prod.id);
                          if (cItem) {
                            return (
                              <div className="cart-qty-controls" onClick={(e) => e.stopPropagation()}>
                                <button className="qty-btn" onClick={() => { if (cItem.quantity > 1) updateQuantity(prod.id, -1); else removeFromCart(prod.id); }}><Minus size={16} /></button>
                                <span className="qty-display">{cItem.quantity}</span>
                                <button className="qty-btn" onClick={() => updateQuantity(prod.id, 1)}><Plus size={16} /></button>
                              </div>
                            );
                          }
                          return (
                            <button className="btn full-width-btn" onClick={(e) => { e.stopPropagation(); addToCart(prod); }}><ShoppingBag size={18} /><span>Savatga</span></button>
                          );
                        })()}
                      </div>
                    </div>
                  );
              })}
            </div>
          </div>

        </div> {/* End Details Overlay */}
      </div>

      {/* Mobile Bottom Fixed Bar */}
      <div className="pd-mobile-bottom-bar">
        <div className="pd-mobile-price">
          <span className="pd-mobile-current">{numericPrice ? formatMoney(numericPrice) : product.price}</span>
          {numericOldPrice > 0 && <span className="pd-mobile-old">{formatMoney(numericOldPrice)}</span>}
        </div>
        {cartItem ? (
          <div className="pd-cart-qty-controls" onClick={e => e.stopPropagation()}>
            <button className="pd-qty-btn" onClick={() => { if (cartItem.quantity > 1) { updateQuantity(cartItemId, -1); } else { removeFromCart(cartItemId); } }}>
              <Minus size={16} />
            </button>
            <span className="pd-qty-display">{cartItem.quantity}</span>
            <button className="pd-qty-btn" onClick={() => updateQuantity(cartItemId, 1)}>
              <Plus size={16} />
            </button>
          </div>
        ) : (
          <button className="pd-mobile-buy-btn" onClick={handleAddToCart} style={{color: '#fff', fontWeight: 'bold'}}>
            Savatga qo'shish
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
