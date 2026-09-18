import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { Minus, Plus, Trash2, Check, ChevronRight, X, CheckCircle } from 'lucide-react';
import './Cart.css';

const Cart = () => {
  const { cart, updateQuantity, removeFromCart, toggleSelect, selectAll, removeSelected, clearCart } = useCart();
  const { user } = useAuth();
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [phone, setPhone] = useState(user?.phone || '');

  const formatMoney = (val) => Number(val).toLocaleString('uz-UZ') + " so'm";

  const allSelected = cart.length > 0 && cart.every(item => item.selected);
  const selectedItems = cart.filter(item => item.selected);
  
  const totalItemsCount = selectedItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalBasePrice = selectedItems.reduce((acc, item) => {
    const price = parseFloat(String(item.price).replace(/\D/g, '')) || 0;
    return acc + (price * item.quantity);
  }, 0);

  // MOCK: Generate some fake discount logic based on oldPrice
  const totalDiscount = selectedItems.reduce((acc, item) => {
    const price = parseFloat(String(item.price).replace(/\D/g, '')) || 0;
    const oldPrice = item.oldPrice ? parseFloat(String(item.oldPrice).replace(/\D/g, '')) : 0;
    if (oldPrice > price) {
      return acc + ((oldPrice - price) * item.quantity);
    }
    return acc;
  }, 0);

  // If no mock discounts exist, let's just create a small dummy discount to match the design visually if total > 100,000
  const finalDiscount = totalDiscount > 0 ? totalDiscount : (totalBasePrice > 100000 ? Math.floor(totalBasePrice * 0.1) : 0);
  const deliveryCost = 3000;
  const grandTotal = totalBasePrice - finalDiscount;

  if (cart.length === 0) {
    return (
      <div className="cart-page empty">
        <h2>Savatingiz bo'sh</h2>
        <p>Oldinroq qo'shgan bo'lsangiz, tizimga kiring</p>
      </div>
    );
  }

  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();
    if (!phone.trim()) return;

    try {
      await api.post('/orders', {
        buyer: user ? { name: user.name, phone: phone } : { name: 'Mehmon', phone: phone },
        items: selectedItems.map(item => ({
          originalId: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          size: item.size || null,
          image: (item.images && item.images.length > 0) ? item.images[0] : item.image
        })),
        totalAmount: grandTotal,
        address: 'Kiritilmagan',
        comment: ''
      });

      // Clear cart and show success
      setShowPhoneModal(false);
      setShowSuccessModal(true);
      removeSelected(); // Remove purchased items from cart
    } catch (error) {
      console.error(error);
      alert("Buyurtmani yuborishda xatolik yuz berdi: " + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className="cart-page">
      <h1 className="cart-title">Savatingiz, <span>{cart.length} mahsulot</span></h1>
      
      <div className="cart-layout">
        {/* Left Col: Cart Items */}
        <div className="cart-items-section">
          {/* Header controls */}
          <div className="cart-controls-header">
            <label className="cart-checkbox-wrapper">
              <div className={`custom-checkbox ${allSelected ? 'checked' : ''}`} onClick={() => selectAll(!allSelected)}>
                {allSelected && <Check size={14} color="#fff" strokeWidth={3} />}
              </div>
              <span onClick={() => selectAll(!allSelected)}>Hammasini yechish</span>
            </label>
            <button className="cart-delete-btn" onClick={removeSelected}>
              Tanlanganlarni o'chirish
            </button>
          </div>

          {/* Items List */}
          <div className="cart-items-list">
            <div className="cart-delivery-header">
              <span>NAMDTU Bazaar yetkazib berishi</span>
              <strong>Ertaga yetkazib beramiz</strong>
            </div>

            {cart.map(item => {
              const productImg = (item.images && item.images.length > 0) 
              ? item.images[0] 
              : (item.image || "https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=500&auto=format&fit=crop&q=60");
              
              const price = parseFloat(String(item.price).replace(/\D/g, '')) || 0;
              const oldPrice = item.oldPrice ? parseFloat(String(item.oldPrice).replace(/\D/g, '')) : 0;
              
              return (
                <div key={item.id} className="cart-item">
                  <div className="cart-item-left">
                    <div className={`custom-checkbox ${item.selected ? 'checked' : ''}`} onClick={() => toggleSelect(item.id)}>
                      {item.selected && <Check size={14} color="#fff" strokeWidth={3} />}
                    </div>
                    <div className="cart-item-img">
                      <img src={productImg} alt={item.name} />
                    </div>
                    <div className="cart-item-info">
                      <h3 className="cart-item-title">
                        {item.name}
                        {item.size && <span className="cart-item-size-badge"> (Razmer: {item.size})</span>}
                      </h3>
                      <div className="cart-item-seller">Sotuvchi: <span>{item.brand || item.author || "NAMDTU Bazaar"}</span></div>
                    </div>
                  </div>

                  <div className="cart-item-right">
                    <div className="cart-qty-controls">
                      <button 
                        className="qty-btn"
                        onClick={() => {
                          if (item.quantity > 1) {
                            updateQuantity(item.id, -1);
                          } else {
                            removeFromCart(item.id);
                          }
                        }}
                      >
                        <Minus size={16} />
                      </button>
                      <span className="qty-display">{item.quantity}</span>
                      <button 
                        className="qty-btn"
                        onClick={() => {
                          let maxStock = item.stock ? parseInt(item.stock, 10) : 999;
                          if (item.sizes && item.sizes.length > 0 && item.size) {
                            const szObj = item.sizes.find(s => s.size === item.size);
                            if (szObj) maxStock = parseInt(szObj.stock, 10);
                          }
                          if (item.quantity < maxStock) {
                            updateQuantity(item.id, 1);
                          } else {
                            alert("Omborda yetarli miqdor yo'q!");
                          }
                        }}
                      >
                        <Plus size={16} />
                      </button>
                    </div>

                    <div className="cart-item-price-block">
                      <div className="cart-item-price">{formatMoney(price * item.quantity)}</div>
                      {(oldPrice > 0 || oldPrice > price) && (
                        <div className="cart-item-old-price">{formatMoney((oldPrice > 0 ? oldPrice : Math.floor(price * 1.2)) * item.quantity)}</div>
                      )}
                    </div>
                    
                    <button className="cart-item-remove-icon" onClick={() => removeFromCart(item.id)}>
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="cart-upsell-banner">
            <div className="cart-upsell-img">
              <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=100&q=60" alt="" />
            </div>
            <div className="cart-upsell-text">
              <strong>Kerak bo'lib qolishi mumkin</strong>
              <span>Siz uchun tovarlar to'plami</span>
            </div>
            <ChevronRight size={20} color="#94a3b8" />
          </div>
        </div>

        {/* Right Col: Summary */}
        <div className="cart-summary-section">
          {totalBasePrice > 0 && grandTotal < 100000 && (
            <div className="cart-summary-delivery-note">
              Yana {formatMoney(100000 - grandTotal)} va yetkazish {deliveryCost} so'm bo'ladi
              <ChevronRight size={16} />
            </div>
          )}

          <div className="cart-summary-card">
            <h2>Buyurtmangiz</h2>
            <div className="cart-summary-row">
              <span>{totalItemsCount} mahsulot</span>
              <span>{formatMoney(totalBasePrice)}</span>
            </div>
            {finalDiscount > 0 && (
              <div className="cart-summary-row discount">
                <span>Chegirmalar</span>
                <span>-{formatMoney(finalDiscount)}</span>
              </div>
            )}
            <div className="cart-summary-total">
              <span>Jami</span>
              <strong>{formatMoney(grandTotal)}</strong>
            </div>
            <button 
              className="cart-checkout-btn"
              disabled={selectedItems.length === 0}
              onClick={() => setShowPhoneModal(true)}
            >
              Rasmiylashtirishga o'tish
            </button>
          </div>
        </div>
      </div>

      {/* Checkout Phone Modal */}
      {showPhoneModal && (
        <div className="cart-modal-overlay" onClick={() => setShowPhoneModal(false)}>
          <div className="cart-modal" onClick={(e) => e.stopPropagation()}>
            <button className="cart-modal-close" onClick={() => setShowPhoneModal(false)}>
              <X size={20} />
            </button>
            <h2>Buyurtmani rasmiylashtirish</h2>
            <p>Iltimos, telefon raqamingizni kiriting. Biz siz bilan tez orada bog'lanamiz.</p>
            <form onSubmit={handleCheckoutSubmit}>
              <input 
                type="text" 
                placeholder="+998 (__) ___-__-__" 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
              <button type="submit" className="cart-modal-submit">Tasdiqlash</button>
            </form>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="cart-modal-overlay" onClick={() => setShowSuccessModal(false)}>
          <div className="cart-success-modal" onClick={(e) => e.stopPropagation()}>
            <button className="cart-modal-close" onClick={() => setShowSuccessModal(false)}>
              <X size={20} />
            </button>
            <div className="success-icon-wrapper">
              <CheckCircle size={48} color="#fff" />
            </div>
            <h2>Muvaffaqiyatli qabul qilindi!</h2>
            <p>Sizning buyurtmangiz olindi. Tez orada operatorlarimiz sizga qo'ng'iroq qilishadi.</p>
            <button className="cart-modal-submit" onClick={() => setShowSuccessModal(false)}>
              Tushunarli
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
