import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Heart, ShoppingBag, Star, ChevronLeft, Image, Send, Camera, X, Minus, Plus } from 'lucide-react';
import { useFavorites } from '../context/FavoritesContext';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './ProductDetail.css';

const MOCK_PRODUCTS = [
  { id: 1, name: "Qo'lda to'qilgan qishki sharf", price: "45000", image: "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=500&auto=format&fit=crop&q=60", author: "Malika", category: "Kiyim" },
  { id: 2, name: "Yog'ochdan ishlangan qalamdon", price: "25000", image: "https://images.unsplash.com/photo-1590725140246-2003eaeb705e?w=500&auto=format&fit=crop&q=60", author: "Sardor", category: "Hunar" },
  { id: 3, name: "Eko-sumka (Shopper)", price: "30000", image: "https://images.unsplash.com/photo-1597484661643-2f5fef640eb1?w=500&auto=format&fit=crop&q=60", author: "Zuhra", category: "Aksessuar" },
  { id: 4, name: "Milliylashtirilgan zamonaviy ko'ylak", price: "120000", image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=500&auto=format&fit=crop&q=60", author: "Kamola", category: "Kiyim" },
];

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toggleFavorite, isFavorite } = useFavorites();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [reviews, setReviews] = useState([]);
  const reviewsRef = useRef(null);
  const { addToCart, updateQuantity, getCartItem, removeFromCart } = useCart();
  
  const scrollToReviews = () => {
    reviewsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const [reviewPros, setReviewPros] = useState('');
  const [reviewCons, setReviewCons] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewImages, setReviewImages] = useState([]);
  const [reviewImagePreviews, setReviewImagePreviews] = useState([]);
  const [hoverRating, setHoverRating] = useState(0);
  const [userPhotos, setUserPhotos] = useState([]);

  // Load product
  useEffect(() => {
    const numId = Number(id);
    // Check admin products first
    const savedProducts = localStorage.getItem('products');
    let found = null;
    if (savedProducts) {
      const adminProducts = JSON.parse(savedProducts);
      found = adminProducts.find(p => p.id === numId);
    }
    if (!found) {
      found = MOCK_PRODUCTS.find(p => p.id === numId);
    }
    setProduct(found || null);

    // Load reviews
    const savedReviews = localStorage.getItem(`reviews_${numId}`);
    if (savedReviews) {
      setReviews(JSON.parse(savedReviews));
    }

    // Load user photos
    const savedPhotos = localStorage.getItem(`user_photos_${numId}`);
    if (savedPhotos) {
      setUserPhotos(JSON.parse(savedPhotos));
    }

    window.scrollTo(0, 0);
  }, [id]);

  // Save reviews
  useEffect(() => {
    if (reviews.length > 0) {
      localStorage.setItem(`reviews_${id}`, JSON.stringify(reviews));
    }
  }, [reviews, id]);

  // Save user photos
  useEffect(() => {
    if (userPhotos.length > 0) {
      localStorage.setItem(`user_photos_${id}`, JSON.stringify(userPhotos));
    }
  }, [userPhotos, id]);

  const handleReviewImageUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setReviewImagePreviews(prev => [...prev, reader.result]);
        setReviewImages(prev => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeReviewImage = (index) => {
    setReviewImagePreviews(prev => prev.filter((_, i) => i !== index));
    setReviewImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmitReview = (e) => {
    e.preventDefault();

    const newReview = {
      id: Date.now(),
      author: user ? user.name : 'Mehmon',
      date: new Date().toLocaleDateString('uz-UZ'),
      rating: reviewRating,
      pros: reviewPros,
      cons: reviewCons,
      comment: reviewComment,
      images: reviewImages,
    };

    setReviews(prev => [newReview, ...prev]);

    // Add review images to user photos gallery
    if (reviewImages.length > 0) {
      setUserPhotos(prev => [...reviewImages, ...prev]);
    }

    setReviewPros('');
    setReviewCons('');
    setReviewComment('');
    setReviewRating(5);
    setReviewImages([]);
    setReviewImagePreviews([]);
  };

  // Calculate average rating
  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : '0';

  const renderStars = (rating, size = 16) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= Math.floor(rating)) {
        stars.push(<Star key={i} size={size} fill="#f59e0b" color="#f59e0b" />);
      } else if (i === Math.ceil(rating) && rating % 1 !== 0) {
        // Half star
        stars.push(
          <div key={i} style={{ position: 'relative', display: 'inline-flex', width: size, height: size }}>
            <Star size={size} color="#e2e8f0" fill="#e2e8f0" />
            <div style={{ position: 'absolute', top: 0, left: 0, width: `${(rating % 1) * 100}%`, overflow: 'hidden' }}>
              <Star size={size} fill="#f59e0b" color="#f59e0b" />
            </div>
          </div>
        );
      } else {
        stars.push(<Star key={i} size={size} color="#e2e8f0" fill="#e2e8f0" />);
      }
    }
    return stars;
  };

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

  return (
    <div className="pd-page">
      {/* Back button */}
      <button className="pd-back" onClick={() => navigate(-1)}>
        <ChevronLeft size={20} />
        <span>Orqaga</span>
      </button>

      {/* Top section: Image + Info */}
      <div className="pd-top">
        {/* Images */}
        <div className="pd-images">
          <div className="pd-main-image">
            <img src={productImages[activeImage]} alt={product.name} />
            <button
              className={`favorite-btn ${isFavorite(product.id) ? 'active' : ''}`}
              onClick={() => toggleFavorite(product)}
            >
              <Heart
                size={24}
                fill={isFavorite(product.id) ? '#ef4444' : 'none'}
                color={isFavorite(product.id) ? '#ef4444' : '#6b7280'}
              />
            </button>
            {product.badge && (
              <span className="pd-badge">{product.badge}</span>
            )}
          </div>
          {productImages.length > 1 && (
            <div className="pd-thumbs">
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
          )}
        </div>

        {/* Info */}
        <div className="pd-info">
          <h1 className="pd-title">
            {product.brand && <span className="pd-brand-inline">{product.brand} </span>}
            {product.name}
          </h1>

          <div className="pd-rating-summary" onClick={scrollToReviews} style={{cursor: 'pointer'}}>
            <div className="pd-stars">{renderStars(Number(avgRating))}</div>
            <span className="pd-rating-num">{avgRating}</span>
            <span className="pd-rating-count">({reviews.length} sharh)</span>
            {userPhotos.length > 0 && (
              <span className="pd-photo-count">· {userPhotos.length} fotosurat</span>
            )}
          </div>

          {/* Order card - styled like Uzum */}
          <div className="pd-order-card">
            <div className="pd-price-row">
              <span className="pd-current-price">{numericPrice ? formatMoney(numericPrice) : product.price}</span>
              {numericOldPrice > 0 && <span className="pd-old-price">{formatMoney(numericOldPrice)}</span>}
            </div>

            {product.sizes && product.sizes.length > 0 && (
              <div className="pd-sizes-section">
                <div className="pd-sizes-title">Razmer tanlang:</div>
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
              </div>
            )}

            <div className="pd-buy-actions">
              {(() => {
                // Determine cart ID based on product ID and selected size (if any)
                // For simplicity here, we assume product.id represents the base product.
                // We will create a unique cart item ID if a size is selected: `product.id_size`
                const cartItemId = selectedSize ? `${product.id}_${selectedSize}` : product.id;
                const cartItem = getCartItem(cartItemId);
                
                // Find stock limit
                let maxStock = product.stock ? parseInt(product.stock, 10) : 999;
                if (product.sizes && product.sizes.length > 0 && selectedSize) {
                  const szObj = product.sizes.find(s => s.size === selectedSize);
                  maxStock = szObj ? parseInt(szObj.stock, 10) : 0;
                }

                if (cartItem) {
                  return (
                    <div className="pd-cart-qty-controls">
                      <button 
                        className="pd-qty-btn"
                        onClick={() => {
                          if (cartItem.quantity > 1) {
                            updateQuantity(cartItemId, -1);
                          } else {
                            removeFromCart(cartItemId);
                          }
                        }}
                      >
                        <Minus size={16} />
                      </button>
                      <span className="pd-qty-display">{cartItem.quantity}</span>
                      <button 
                        className="pd-qty-btn"
                        disabled={cartItem.quantity >= maxStock}
                        onClick={() => updateQuantity(cartItemId, 1)}
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  );
                }

                const handleAddToCart = () => {
                  if (product.sizes && product.sizes.length > 0 && !selectedSize) {
                    alert('Iltimos, avval razmerni tanlang!');
                    return;
                  }
                  
                  const cartProduct = {
                    ...product,
                    id: cartItemId, // unique id for cart
                    originalId: product.id,
                    size: selectedSize
                  };
                  addToCart(cartProduct);
                };

                return (
                  <button className="pd-buy-btn" onClick={handleAddToCart}>
                    <div className="pd-buy-btn-main">Savatga qo'shish</div>
                    <div className="pd-buy-btn-sub">Ertaga yetkazib beramiz</div>
                  </button>
                );
              })()}
              <button
                className={`pd-fav-btn ${isFavorite(product.id) ? 'active' : ''}`}
                onClick={() => toggleFavorite(product)}
              >
                <Heart
                  size={22}
                  fill={isFavorite(product.id) ? '#ef4444' : 'none'}
                  color={isFavorite(product.id) ? '#ef4444' : '#94a3b8'}
                />
              </button>
            </div>

            {product.sizes && product.sizes.length > 0 ? (
              selectedSize && (() => {
                const sz = product.sizes.find(s => s.size === selectedSize);
                return (
                  <div className="pd-stock-row">
                    <span className="pd-stock-icon">✅</span>
                    <span>{sz ? sz.stock : 0} dona xarid qilish mumkin (Omborda bor)</span>
                  </div>
                );
              })()
            ) : product.stock ? (
              <div className="pd-stock-row">
                <span className="pd-stock-icon">✅</span>
                <span>{product.stock} dona xarid qilish mumkin</span>
              </div>
            ) : null}

            <div className="pd-delivery-row">
              <span className="pd-delivery-icon">📦</span>
              <span>Bu haftada ko'p sotib olingan</span>
            </div>
          </div>

          {/* Description */}
          {product.description && (
            <div className="pd-description">
              <h3>Tavsif</h3>
              <p>{product.description}</p>
            </div>
          )}

          {product.category && (
            <div className="pd-category-line">
              Bo'lim: <strong>{product.category}</strong>
            </div>
          )}

          {/* Specifications */}
          <div className="pd-specs">
            <h3>Xususiyatlari</h3>
            <ul className="pd-specs-list">
              <li>
                <span className="spec-label">Og'irligi:</span>
                <span className="spec-value">Qadoq bilan 500g</span>
              </li>
              <li>
                <span className="spec-label">Ishlab chiqarilgan:</span>
                <span className="spec-value">O'zbekiston, Namangan</span>
              </li>
              <li>
                <span className="spec-label">Kafolat:</span>
                <span className="spec-value">Sifat kafolatlangan</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* User photos section */}
      {userPhotos.length > 0 && (
        <section className="pd-section">
          <h2>Xaridorlar fotosuratlar ({userPhotos.length})</h2>
          <div className="pd-user-photos">
            {userPhotos.map((photo, idx) => (
              <div key={idx} className="pd-user-photo">
                <img src={photo} alt={`Foto ${idx + 1}`} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Reviews section */}
      <section className="pd-section" ref={reviewsRef}>
        <div className="pd-reviews-header">
          <h2>Sharhlar ({reviews.length})</h2>
          {reviews.length > 0 && (
            <div className="pd-avg-block">
              <span className="pd-avg-num">{avgRating}</span>
              <div className="pd-avg-stars">{renderStars(Number(avgRating), 20)}</div>
              <span className="pd-avg-count">{reviews.length} sharh</span>
            </div>
          )}
        </div>

        {/* Write review */}
        <form className="pd-review-form" onSubmit={handleSubmitReview}>
          <h3>Sharh qoldiring</h3>
          <div className="pd-star-select">
            <span>Bahoyingiz:</span>
            <div className="pd-star-row">
              {[1, 2, 3, 4, 5].map(star => (
                <Star
                  key={star}
                  size={28}
                  className="pd-star-input"
                  fill={(hoverRating || reviewRating) >= star ? '#f59e0b' : '#e2e8f0'}
                  color={(hoverRating || reviewRating) >= star ? '#f59e0b' : '#e2e8f0'}
                  onClick={() => setReviewRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  style={{ cursor: 'pointer', transition: 'transform 0.15s' }}
                />
              ))}
            </div>
          </div>

          <div className="pd-review-inputs">
            <input
              type="text"
              placeholder="Afzalliklari"
              value={reviewPros}
              onChange={(e) => setReviewPros(e.target.value)}
            />
            <input
              type="text"
              placeholder="Kamchiliklari"
              value={reviewCons}
              onChange={(e) => setReviewCons(e.target.value)}
            />
            <textarea
              placeholder="Izoh"
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              rows={3}
            />
          </div>

          {/* Review image upload */}
          <div className="pd-review-images-row">
            {reviewImagePreviews.map((src, idx) => (
              <div key={idx} className="pd-review-img-preview">
                <img src={src} alt="" />
                <button type="button" className="pd-review-img-remove" onClick={() => removeReviewImage(idx)}>
                  <X size={12} />
                </button>
              </div>
            ))}
            <label className="pd-review-add-img">
              <Camera size={20} />
              <span>Rasm</span>
              <input type="file" accept="image/*" multiple onChange={handleReviewImageUpload} hidden />
            </label>
          </div>

          <button type="submit" className="btn full-width-btn" style={{maxWidth: 280}}>
            <Send size={18} />
            <span>Yuborish</span>
          </button>
        </form>

        {/* Reviews list */}
        <div className="pd-reviews-list">
          {reviews.map(review => (
            <div key={review.id} className="pd-review-card">
              <div className="pd-review-top">
                <div className="pd-review-author">
                  <div className="pd-review-avatar">{review.author.charAt(0).toUpperCase()}</div>
                  <div>
                    <strong>{review.author}</strong>
                    <span className="pd-review-date">{review.date}</span>
                  </div>
                </div>
                <div className="pd-review-stars">{renderStars(review.rating, 14)}</div>
              </div>
              <div className="pd-review-content">
                {review.pros && (
                  <p className="pd-review-text"><strong>Afzalliklari:</strong> {review.pros}</p>
                )}
                {review.cons && (
                  <p className="pd-review-text"><strong>Kamchiliklari:</strong> {review.cons}</p>
                )}
                {review.comment && (
                  <p className="pd-review-text"><strong>Izoh:</strong> {review.comment}</p>
                )}
              </div>
              {review.images && review.images.length > 0 && (
                <div className="pd-review-images">
                  {review.images.map((img, idx) => (
                    <div key={idx} className="pd-review-photo">
                      <img src={img} alt="" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Mobile Bottom Fixed Bar */}
      <div 
        className="pd-mobile-bottom-bar" 
        onClick={() => navigate('/cart')} 
        style={{cursor: 'pointer'}}
      >
        <div className="pd-mobile-price">
          <span className="pd-mobile-current">{numericPrice ? formatMoney(numericPrice) : product.price}</span>
          {numericOldPrice > 0 && <span className="pd-mobile-old">{formatMoney(numericOldPrice)}</span>}
        </div>
        <button className="pd-buy-btn" style={{color: '#fff', fontWeight: 'bold'}}>
          Savatga
        </button>
      </div>
    </div>
  );
};

export default ProductDetail;
