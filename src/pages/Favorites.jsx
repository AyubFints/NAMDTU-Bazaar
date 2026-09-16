import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useFavorites } from '../context/FavoritesContext';
import { useCart } from '../context/CartContext';
import { Heart, ShoppingBag, Star, Minus, Plus } from 'lucide-react';
import './Favorites.css';

const Favorites = () => {
  const { favorites, toggleFavorite } = useFavorites();
  const { addToCart, updateQuantity, getCartItem, removeFromCart } = useCart();
  const navigate = useNavigate();

  const formatMoney = (val) => Number(val).toLocaleString('uz-UZ') + " so'm";

  return (
    <div className="favorites-page">
      <div className="favorites-header">
        <h1>Istaklarim</h1>
        <span className="favorites-count">{favorites.length} ta mahsulot</span>
      </div>

      {favorites.length === 0 ? (
        <div className="favorites-empty">
          <Heart size={64} color="#cbd5e1" />
          <h3>Saralanganlar bo'sh</h3>
          <p>Mahsulotlardagi yurakchani bosib, sevimli mahsulotlaringizni shu yerga qo'shing!</p>
        </div>
      ) : (
        <div className="products-grid">
          {favorites.map(product => {
            const productImg = (product.images && product.images.length > 0)
              ? product.images[0]
              : (product.image || "https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=500&auto=format&fit=crop&q=60");

            const numericPrice = parseFloat(String(product.price).replace(/\D/g, '')) || 0;
            const numericOldPrice = product.oldPrice ? parseFloat(String(product.oldPrice).replace(/\D/g, '')) : 0;

            return (
              <div key={product.id} className="card product-card">
                <div className="product-image" onClick={() => navigate(`/product/${product.id}`)} style={{cursor: 'pointer'}}>
                  <img src={productImg} alt={product.name} />
                  <button
                    className="favorite-btn active"
                    onClick={(e) => { e.stopPropagation(); toggleFavorite(product); }}
                  >
                    <Heart size={20} fill="#ef4444" color="#ef4444" />
                  </button>
                  {(product.badge || product.category) && (
                    <span
                      className="category-badge"
                      style={product.badge ? {background: '#ec4899', color: '#fff'} : {background: 'rgba(255,255,255,0.9)', color: '#0a1052'}}
                    >
                      {product.badge || product.category}
                    </span>
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
      )}
    </div>
  );
};

export default Favorites;
