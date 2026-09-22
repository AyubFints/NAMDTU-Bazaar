import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { Minus, Plus, Trash2, Check, ChevronRight, X, CheckCircle, CreditCard, Truck, UploadCloud } from 'lucide-react';
import './Cart.css';

const Cart = () => {
  const { cart, updateQuantity, removeFromCart, toggleSelect, selectAll, removeSelected, clearCart } = useCart();
  const { user } = useAuth();
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showCardDetailsModal, setShowCardDetailsModal] = useState(false);
  const [phone, setPhone] = useState(user?.phone || '');
  const [purchasedItems, setPurchasedItems] = useState([]);
  
  // Receipt upload state
  const [receiptImage, setReceiptImage] = useState(null);
  const [isUploadingReceipt, setIsUploadingReceipt] = useState(false);

  const formatMoney = (val) => Number(val).toLocaleString('uz-UZ') + " so'm";

  const allSelected = cart.length > 0 && cart.every(item => item.selected);
  const selectedItems = cart.filter(item => item.selected);
  
  const totalItemsCount = selectedItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalBasePrice = selectedItems.reduce((acc, item) => {
    const price = parseFloat(String(item.price).replace(/\D/g, '')) || 0;
    return acc + (price * item.quantity);
  }, 0);

  const totalDiscount = selectedItems.reduce((acc, item) => {
    const price = parseFloat(String(item.price).replace(/\D/g, '')) || 0;
    const oldPrice = item.oldPrice ? parseFloat(String(item.oldPrice).replace(/\D/g, '')) : 0;
    if (oldPrice > price) {
      return acc + ((oldPrice - price) * item.quantity);
    }
    return acc;
  }, 0);

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

  const handlePhoneSubmit = (e) => {
    e.preventDefault();
    if (!phone.trim()) return;
    setShowPhoneModal(false);
    setShowPaymentModal(true);
  };

  const handlePaymentSelection = (method) => {
    setShowPaymentModal(false);
    if (method === 'karta') {
      setPurchasedItems(selectedItems);
      setReceiptImage(null);
      setIsUploadingReceipt(false);
      setShowCardDetailsModal(true);
    } else {
      submitOrder('naqd', null);
    }
  };

  const processImageFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    setIsUploadingReceipt(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      // Simulate 1 second upload loading
      setTimeout(() => {
        setReceiptImage(reader.result);
        setIsUploadingReceipt(false);
      }, 1000); 
    };
    reader.readAsDataURL(file);
  };

  const handlePaste = (e) => {
    const items = e.clipboardData?.items;
    if (!items) return;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const file = items[i].getAsFile();
        processImageFile(file);
        break;
      }
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      processImageFile(e.target.files[0]);
    }
  };

  const submitOrder = async (method, receiptStr) => {
    try {
      const response = await api.post('/orders', {
        buyer: user ? { name: user.name, phone: phone } : { name: 'Mehmon', phone: phone },
        items: selectedItems.map(item => ({
          originalId: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          size: item.size || null,
          image: (item.images && item.images.length > 0) ? item.images[0] : item.image,
          cardNumber: item.cardNumber,
          cardHolderName: item.cardHolderName
        })),
        totalAmount: grandTotal,
        paymentMethod: method,
        receiptImage: receiptStr,
        address: 'Kiritilmagan',
        comment: ''
      });

      if (response.data && response.data.id) {
        const savedIds = JSON.parse(localStorage.getItem('my_order_ids') || '[]');
        savedIds.push(response.data.id);
        localStorage.setItem('my_order_ids', JSON.stringify(savedIds));
      }

      setShowCardDetailsModal(false);
      setShowSuccessModal(true);
      removeSelected();
    } catch (error) {
      console.error(error);
      alert("Buyurtmani yuborishda xatolik yuz berdi: " + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className="cart-page">
      <h1 className="cart-title">Savatingiz, <span>{cart.length} mahsulot</span></h1>
      
      <div className="cart-layout">
        <div className="cart-items-section">
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
                            alert(`Bazada faqat ${maxStock} ta qolgan.`);
                          }
                        }}
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                    
                    <div className="cart-item-pricing">
                      <div className="current-price">{formatMoney(price * item.quantity)}</div>
                      {oldPrice > price && (
                        <div className="old-price">{formatMoney(oldPrice * item.quantity)}</div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

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

      {showPhoneModal && (
        <div className="cart-modal-overlay" onClick={() => setShowPhoneModal(false)}>
          <div className="cart-modal" onClick={(e) => e.stopPropagation()}>
            <button className="cart-modal-close" onClick={() => setShowPhoneModal(false)}>
              <X size={20} />
            </button>
            <h2>Buyurtmani rasmiylashtirish</h2>
            <p>Iltimos, telefon raqamingizni kiriting. Biz siz bilan tez orada bog'lanamiz.</p>
            <form onSubmit={handlePhoneSubmit}>
              <input 
                type="text" 
                placeholder="+998 (__) ___-__-__" 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
              <button type="submit" className="cart-modal-submit">Davom etish</button>
            </form>
          </div>
        </div>
      )}

      {showPaymentModal && (
        <div className="cart-modal-overlay" onClick={() => setShowPaymentModal(false)}>
          <div className="cart-modal" onClick={(e) => e.stopPropagation()}>
            <button className="cart-modal-close" onClick={() => setShowPaymentModal(false)}>
              <X size={20} />
            </button>
            <h2>To'lov turi</h2>
            <p>Qanday to'lov qilmoqchisiz?</p>
            
            <div className="payment-options">
              <button className="payment-option-btn" onClick={() => handlePaymentSelection('karta')}>
                <CreditCard size={24} />
                <span>Karta orqali</span>
              </button>
              <button className="payment-option-btn" onClick={() => handlePaymentSelection('naqd')}>
                <Truck size={24} />
                <span>Tovarni qo'lga olganda</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {showCardDetailsModal && (
        <div className="cart-modal-overlay" onClick={() => setShowCardDetailsModal(false)}>
          <div className="cart-modal" onClick={(e) => e.stopPropagation()}>
            <button className="cart-modal-close" onClick={() => setShowCardDetailsModal(false)}>
              <X size={20} />
            </button>
            <h2>Karta orqali to'lov</h2>
            <p style={{ color: '#1a1a2e', fontWeight: '500' }}>
              Mana shu karta raqamiga tovarning narxini qo'shib to'lovni amalga oshiring:
            </p>
            
            <div className="card-details-list" style={{ maxHeight: '200px', overflowY: 'auto', margin: '15px 0' }}>
              {purchasedItems.map((item, idx) => {
                const itemPrice = parseFloat(String(item.price).replace(/\D/g, '')) || 0;
                return (
                  <div key={idx} style={{ padding: '12px', border: '1px solid #e2e8f0', borderRadius: '10px', marginBottom: '10px' }}>
                    <div style={{ fontWeight: '600', marginBottom: '4px', fontSize: '14px' }}>{item.name}</div>
                    <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '8px' }}>
                      Karta egasi: {item.cardHolderName || "Kiritilmagan"}
                    </div>
                    <div style={{ background: '#f1f5f9', padding: '10px', borderRadius: '8px', fontSize: '15px', fontWeight: 'bold', color: '#1a1a2e', letterSpacing: '1px', userSelect: 'all' }}>
                      {item.cardNumber || "Karta kiritilmagan"}
                    </div>
                    <div style={{ marginTop: '8px', fontWeight: '600', color: '#ef4444', fontSize: '14px' }}>
                      To'lanadigan summa: {formatMoney(itemPrice * item.quantity)}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="receipt-upload-section" onPaste={handlePaste}>
              <div style={{ fontWeight: 600, marginBottom: '8px', fontSize: '15px' }}>To'lov chekini yuklang (majburiy)</div>
              <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '12px' }}>Rasmni shu yerga Ctrl+C/Ctrl+V qilib tashlang yoki galereyadan tanlang.</div>
              
              <div className="receipt-upload-box">
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleFileSelect} 
                  title=""
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer', zIndex: 10 }} 
                />
                {isUploadingReceipt ? (
                  <div className="receipt-loading-spinner"></div>
                ) : receiptImage ? (
                  <img src={receiptImage} alt="Chek" className="receipt-preview" />
                ) : (
                  <div className="receipt-placeholder">
                    <UploadCloud size={32} color="#cbd5e1" />
                    <span>Rasmni yuklash (Ctrl+V)</span>
                  </div>
                )}
              </div>
            </div>
            
            <button 
              className={`cart-modal-submit ${!receiptImage ? 'disabled' : ''}`}
              onClick={() => {
                if (receiptImage && !isUploadingReceipt) submitOrder('karta', receiptImage);
              }}
              disabled={!receiptImage || isUploadingReceipt}
              style={{
                background: receiptImage ? 'rgb(10, 16, 82)' : '#fff',
                color: receiptImage ? '#fff' : '#94a3b8',
                border: receiptImage ? 'none' : '1px solid #cbd5e1',
                cursor: receiptImage ? 'pointer' : 'not-allowed',
                marginTop: '15px',
                transition: 'all 0.3s'
              }}
            >
              Tasdiqlash
            </button>
          </div>
        </div>
      )}

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
