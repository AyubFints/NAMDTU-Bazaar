import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, ChevronLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Orders.css';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const savedOrders = localStorage.getItem('orders');
    if (savedOrders) {
      const parsedOrders = JSON.parse(savedOrders);
      // For demo, if user exists we could filter by user.id or just show all if guest/admin. 
      // We will show all for now so they are always visible as requested by user.
      setOrders(parsedOrders);
    }
  }, []);

  const formatMoney = (val) => Number(val).toLocaleString('uz-UZ') + " so'm";

  return (
    <div className="orders-page">
      <div className="orders-header">
        <button className="orders-back-btn" onClick={() => navigate(-1)}>
          <ChevronLeft size={20} />
          <span>Orqaga</span>
        </button>
        <h1>Mening buyurtmalarim</h1>
      </div>

      {orders.length === 0 ? (
        <div className="orders-empty">
          <ShoppingBag size={64} />
          <h2>Sizda hozircha buyurtmalar yo'q</h2>
          <p>Xaridni boshlash uchun mahsulotlar katalogiga o'ting</p>
          <button className="btn" onClick={() => navigate('/')}>Bosh sahifaga o'tish</button>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map(order => (
            <div key={order.id} className="order-card">
              <div className="order-card-header">
                <div>
                  <h3>Buyurtma #{order.id}</h3>
                  <span className="order-date">{new Date(order.date).toLocaleString('uz-UZ')}</span>
                </div>
                <div className={`order-status status-${order.status === 'Yangi' ? 'new' : 'sold'}`}>
                  {order.status === 'Yangi' ? 'Jarayonda' : 'Yetkazib berildi (Sotildi)'}
                </div>
              </div>

              <div className="order-items-grid">
                {order.items.map((item, idx) => (
                  <div key={idx} className="order-item">
                    <img 
                      src={item.images?.[0] || item.image || "https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=500&auto=format&fit=crop&q=60"} 
                      alt={item.name} 
                    />
                    <div className="order-item-info">
                      <div className="order-item-title">{item.name}</div>
                      {item.size && <div className="order-item-detail">Razmer: {item.size}</div>}
                      <div className="order-item-detail">Miqdor: {item.quantity} ta</div>
                      <div className="order-item-price">{formatMoney(item.price)}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="order-card-footer">
                <span>Jami to'lov:</span>
                <strong>{formatMoney(order.total)}</strong>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
