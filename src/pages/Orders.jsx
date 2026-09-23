import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, ChevronLeft, X } from 'lucide-react';
import api from '../api/axios';
import './Orders.css';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const navigate = useNavigate();

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const savedIds = JSON.parse(localStorage.getItem('my_order_ids') || '[]');
      if (savedIds.length === 0) {
        setOrders([]);
        setLoading(false);
        return;
      }
      const response = await api.post('/orders/my', { orderIds: savedIds });
      setOrders(response.data);
    } catch (error) {
      console.error("Failed to fetch my orders", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const formatMoney = (val) => Number(val).toLocaleString('uz-UZ') + " so'm";

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm("Haqiqatan ham ushbu buyurtmani bekor qilmoqchimisiz?")) return;
    try {
      await api.post(`/orders/${orderId}/cancel`);
      setSelectedOrder(null);
      fetchOrders(); // Refresh orders
    } catch (error) {
      console.error("Failed to cancel order", error);
      alert("Xatolik yuz berdi");
    }
  };

  return (
    <div className="orders-page">
      <div className="orders-header">
        <button className="orders-back-btn" onClick={() => navigate(-1)}>
          <ChevronLeft size={20} />
          <span>Orqaga</span>
        </button>
        <h1>Mening buyurtmalarim</h1>
      </div>

      {loading ? (
        <div className="orders-loading">Yuklanmoqda...</div>
      ) : orders.length === 0 ? (
        <div className="orders-empty">
          <ShoppingBag size={64} />
          <h2>Sizda hozircha buyurtmalar yo'q</h2>
          <p>Xaridni boshlash uchun mahsulotlar katalogiga o'ting</p>
          <button className="btn" onClick={() => navigate('/')}>Bosh sahifaga o'tish</button>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map(order => {
            const statusClass = 
              order.status === 'Yangi' ? 'status-new' : 
              order.status === 'Bekor qilingan' ? 'status-cancelled' : 'status-sold';
              
            const statusText = 
              order.status === 'Yangi' ? 'Tayyorlanmoqda' : 
              order.status === 'Bekor qilingan' ? 'Bekor qilingan' : 'Tasdiqlangan va sotib olingan';

            // Show main image of first item
            const firstItemImg = order.items && order.items[0] 
              ? (order.items[0].image || "https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=500&auto=format&fit=crop&q=60")
              : "https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=500&auto=format&fit=crop&q=60";

            return (
              <div key={order.id} className="order-card clickable" onClick={() => setSelectedOrder(order)}>
                <div className="order-card-flex">
                  <div className="order-card-img">
                    <img src={firstItemImg} alt="Order item" />
                  </div>
                  <div className="order-card-main-info">
                    <div className="order-card-top-row">
                      <h3>Buyurtma #{order.id}</h3>
                      <div className={`order-status ${statusClass}`}>{statusText}</div>
                    </div>
                    <div className="order-card-date">{new Date(order.createdAt).toLocaleString('uz-UZ')}</div>
                    <div className="order-card-price">{formatMoney(order.totalAmount)}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="orders-modal-overlay" onClick={() => setSelectedOrder(null)}>
          <div className="orders-modal" onClick={(e) => e.stopPropagation()}>
            <div className="orders-modal-header">
              <h3>Buyurtma #{selectedOrder.id} tafsilotlari</h3>
              <button className="orders-modal-close" onClick={() => setSelectedOrder(null)}>
                <X size={24} />
              </button>
            </div>
            
            <div className="orders-modal-body">
              <div className="orders-modal-items">
                {selectedOrder.items.map((item, idx) => (
                  <div key={idx} className="orders-modal-item">
                    <img src={item.image || "https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=500&auto=format&fit=crop&q=60"} alt={item.name} />
                    <div className="orders-modal-item-info">
                      <div className="orders-modal-item-name">{item.name}</div>
                      {item.size && <div className="orders-modal-item-size">Razmer: {item.size}</div>}
                      <div className="orders-modal-item-qty">Miqdor: {item.quantity} ta</div>
                      <div className="orders-modal-item-price">{formatMoney(item.price * item.quantity)}</div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="orders-modal-summary">
                <div className="orders-modal-row">
                  <span>Sana:</span>
                  <span>{new Date(selectedOrder.createdAt).toLocaleString('uz-UZ')}</span>
                </div>
                <div className="orders-modal-row">
                  <span>Holati:</span>
                  <strong className={
                    selectedOrder.status === 'Yangi' ? 'text-blue' : 
                    selectedOrder.status === 'Bekor qilingan' ? 'text-red' : 'text-green'
                  }>
                    {selectedOrder.status === 'Yangi' ? 'Tayyorlanmoqda' : 
                     selectedOrder.status === 'Bekor qilingan' ? 'Bekor qilingan' : 'Yetkazildi'}
                  </strong>
                </div>
                <div className="orders-modal-row">
                  <span>To'lov turi:</span>
                  <strong>{selectedOrder.paymentMethod === 'karta' ? 'Karta orqali' : 'Qo\'lga olganda'}</strong>
                </div>
                <div className="orders-modal-row total">
                  <span>Jami to'lov:</span>
                  <strong>{formatMoney(selectedOrder.totalAmount)}</strong>
                </div>
              </div>
            </div>

            {selectedOrder.status === 'Yangi' && (
              <div className="orders-modal-footer">
                <button className="btn btn-danger" onClick={() => handleCancelOrder(selectedOrder.id)}>
                  Buyurtmani bekor qilish
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
