import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { LogOut, User, Heart, ShoppingBag, Plus, Package, Image, X, Trash2 } from 'lucide-react';
import './Profile.css';
import UserProfile from './UserProfile';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('info');

  const handleLogout = () => {
    logout();
    navigate('/register');
  };

  // State: Favorites
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('favorites');
    return saved ? JSON.parse(saved) : [];
  });

  // State: Products added by user (Seller Products)
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('products');
    return saved ? JSON.parse(saved) : [];
  });

  // State: Orders (Global, will be filtered)
  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('orders');
    return saved ? JSON.parse(saved) : [];
  });

  // State: Notifications
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('notifications');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(products));
  }, [products]);

  if (!user) {
    return <div className="container" style={{padding: '50px 0'}}>Iltimos, tizimga kiring.</div>;
  }

  // --- Add Product Form State ---
  const [newProductName, setNewProductName] = useState('');
  const [newProductPrice, setNewProductPrice] = useState('');
  const [newProductOldPrice, setNewProductOldPrice] = useState('');
  const [newProductCategory, setNewProductCategory] = useState('');
  const [newProductImages, setNewProductImages] = useState([]);
  const [newProductDesc, setNewProductDesc] = useState('');
  const [newProductStock, setNewProductStock] = useState('');
  const [newProductSizes, setNewProductSizes] = useState([]);
  const [showModal, setShowModal] = useState(false);

  // Filter Categories
  const categories = JSON.parse(localStorage.getItem('categories')) || ['Trendli kiyimlar', 'Onalar va bolalar', "Qo'l ishlari"];

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files).slice(0, 5 - newProductImages.length);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewProductImages(prev => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveImage = (index) => {
    setNewProductImages(newProductImages.filter((_, i) => i !== index));
  };

  const handleAddProduct = (e) => {
    e.preventDefault();
    if (newProductImages.length === 0) {
      alert("Kamida 1 ta rasm yuklang!");
      return;
    }

    const newProduct = {
      id: Date.now(),
      name: newProductName,
      price: newProductPrice,
      oldPrice: newProductOldPrice,
      category: newProductCategory,
      images: newProductImages,
      description: newProductDesc,
      stock: newProductStock,
      sizes: newProductSizes,
      creatorPhone: user.phone,
      creatorName: user.name,
      status: 'pending' // Pending approval from admin
    };

    setProducts([...products, newProduct]);
    setShowModal(true); // Show success modal
    
    // Clear form
    setNewProductName('');
    setNewProductPrice('');
    setNewProductOldPrice('');
    setNewProductCategory('');
    setNewProductImages([]);
    setNewProductDesc('');
    setNewProductStock('');
    setNewProductSizes([]);
  };

  const isClothingCategory = newProductCategory.toLowerCase().includes('kiyim') || newProductCategory.toLowerCase().includes('bolalar');

  // Filters
  const userFavorites = products.filter(p => favorites.includes(p.id) && (p.status === 'approved' || !p.status));
  
  // Mening xaridlarim (Orders where I am the buyer)
  const myOrders = orders.filter(o => o.buyer?.phone === user.phone);

  // Menga kelgan buyurtmalar (Orders containing items created by me)
  const sellerOrders = orders.filter(o => o.items.some(item => item.creatorPhone === user.phone));

  // User Notifications
  const myNotifications = notifications.filter(n => n.phone === user.phone);

  // Format price
  const formatPrice = (price) => {
    return Number(price).toLocaleString('uz-UZ') + " so'm";
  };

  if (user.role === 'user') {
    return <UserProfile />;
  }

  return (
    <div className="profile-dashboard">
      {/* SUCCESS MODAL */}
      {showModal && (
        <div className="admin-modal-overlay">
          <div className="admin-modal">
            <h3>Muvaffaqiyatli!</h3>
            <p>Mahsulotingiz admin panelga yuborildi. Admin tasdiqlagach, dasturga kiritiladi.</p>
            <div className="admin-modal-actions">
              <button className="profile-save-btn" onClick={() => setShowModal(false)}>Tushunarli</button>
            </div>
          </div>
        </div>
      )}

      {/* SIDEBAR */}
      <aside className="profile-sidebar">
        <div className="profile-sidebar-header">
          <h2>{user.name}</h2>
          <button className="profile-logout-btn" onClick={handleLogout} title="Chiqish">
            <LogOut size={18} />
          </button>
        </div>

        <nav className="profile-nav">
          <button className={`profile-nav-item ${activeTab === 'info' ? 'active' : ''}`} onClick={() => setActiveTab('info')}>
            <User size={20} />
            <span>Ma'lumotlarim</span>
          </button>
          <button className={`profile-nav-item ${activeTab === 'favorites' ? 'active' : ''}`} onClick={() => setActiveTab('favorites')}>
            <Heart size={20} />
            <span>Yoqtirganlarim</span>
          </button>
          <button className={`profile-nav-item ${activeTab === 'my-orders' ? 'active' : ''}`} onClick={() => setActiveTab('my-orders')}>
            <ShoppingBag size={20} />
            <span>Mening xaridlarim</span>
          </button>
          <button className={`profile-nav-item ${activeTab === 'seller-add' ? 'active' : ''}`} onClick={() => setActiveTab('seller-add')}>
            <Plus size={20} />
            <span>Mahsulot qo'shish</span>
          </button>
          <button className={`profile-nav-item ${activeTab === 'seller-orders' ? 'active' : ''}`} onClick={() => setActiveTab('seller-orders')}>
            <Package size={20} />
            <span>Menga kelgan buyurtmalar</span>
          </button>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="profile-main">
        
        {/* INFO TAB */}
        {activeTab === 'info' && (
          <div className="profile-tab-content">
            <div className="profile-page-header">
              <h1>Ma'lumotlarim</h1>
              <p>Shaxsiy ma'lumotlaringiz va bildirishnomalar</p>
            </div>
            
            <div className="profile-info-card">
              <p><strong>Ism:</strong> {user.name}</p>
              <p><strong>Telefon raqam:</strong> {user.phone}</p>
              <p><strong>Huquq:</strong> {user.role === 'admin' ? 'Administrator' : 'Oddiy foydalanuvchi'}</p>
            </div>

            <div className="profile-page-header" style={{marginTop: '40px'}}>
              <h2>Bildirishnomalar (SMS)</h2>
            </div>
            
            {myNotifications.length === 0 ? (
              <p style={{color: '#64748b'}}>Hozircha xabarlar yo'q.</p>
            ) : (
              <div>
                {myNotifications.reverse().map(note => (
                  <div key={note.id} className={`notification-card ${note.type}`}>
                    <div className="notification-time">{note.date}</div>
                    <p className="notification-text">{note.message}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* FAVORITES TAB */}
        {activeTab === 'favorites' && (
          <div className="profile-tab-content">
            <div className="profile-page-header">
              <h1>Yoqtirganlarim</h1>
              <p>Sizga yoqqan mahsulotlar ro'yxati</p>
            </div>
            {userFavorites.length === 0 ? (
              <p style={{color: '#64748b'}}>Hozircha yoqtirgan mahsulotlaringiz yo'q.</p>
            ) : (
              <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px'}}>
                {userFavorites.map(product => (
                  <Link key={product.id} to={`/product/${product.id}`} style={{textDecoration: 'none', color: 'inherit'}}>
                    <div style={{border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden'}}>
                      <img src={product.images?.[0] || product.image} alt={product.name} style={{width: '100%', height: '200px', objectFit: 'cover'}} />
                      <div style={{padding: '12px'}}>
                        <h4 style={{margin: '0 0 8px 0', fontSize: '14px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{product.name}</h4>
                        <strong style={{color: '#16a34a'}}>{formatPrice(product.price)}</strong>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {/* MY ORDERS TAB */}
        {activeTab === 'my-orders' && (
          <div className="profile-tab-content">
            <div className="profile-page-header">
              <h1>Mening Xaridlarim</h1>
              <p>Siz tomoningizdan buyurtma qilingan mahsulotlar</p>
            </div>
            {myOrders.length === 0 ? (
              <p style={{color: '#64748b'}}>Siz hali hech narsa xarid qilmadingiz.</p>
            ) : (
              <div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
                {myOrders.map(order => (
                  <div key={order.id} style={{border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px', background: '#fff'}}>
                    <div style={{display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px', marginBottom: '12px'}}>
                      <strong>Buyurtma: #{order.id}</strong>
                      <span style={{color: order.status === 'Yangi' ? '#f59e0b' : '#10b981', fontWeight: 600}}>
                        {order.status}
                      </span>
                    </div>
                    {order.items.map((item, idx) => (
                      <div key={idx} style={{display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px'}}>
                        <span>{item.name} (x{item.quantity}) {item.size && `- ${item.size}`}</span>
                        <span>{formatPrice(item.price * item.quantity)}</span>
                      </div>
                    ))}
                    <div style={{textAlign: 'right', marginTop: '12px', fontWeight: 700, fontSize: '16px', color: '#7c3aed'}}>
                      Jami: {formatPrice(order.totalAmount)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ADD PRODUCT TAB */}
        {activeTab === 'seller-add' && (
          <div className="profile-tab-content">
            <div className="profile-page-header">
              <h1>Mahsulot Qo'shish</h1>
              <p>O'z mahsulotingizni soting (Max 5 ta rasm)</p>
            </div>
            
            <form className="profile-form-container" onSubmit={handleAddProduct}>
              <div className="profile-field">
                <label>Mahsulot nomi *</label>
                <input required type="text" value={newProductName} onChange={e => setNewProductName(e.target.value)} placeholder="Masalan: Qishki kurtka..." />
              </div>
              <div className="profile-field" style={{display: 'flex', gap: '15px', padding: 0, border: 'none', background: 'transparent'}}>
                <div style={{flex: 1, padding: '16px', background: '#fff', border: '1px dashed #94a3b8', borderRadius: '12px'}}>
                  <label>Hozirgi narxi (so'm) *</label>
                  <input required type="number" value={newProductPrice} onChange={e => setNewProductPrice(e.target.value)} placeholder="Masalan: 150000" />
                </div>
                <div style={{flex: 1, padding: '16px', background: '#fff', border: '1px dashed #94a3b8', borderRadius: '12px'}}>
                  <label>Oldingi narxi (ixtiyoriy)</label>
                  <input type="number" value={newProductOldPrice} onChange={e => setNewProductOldPrice(e.target.value)} placeholder="Masalan: 200000" />
                </div>
              </div>
              <div className="profile-field">
                <label>Bo'limni tanlang *</label>
                <select required value={newProductCategory} onChange={e => setNewProductCategory(e.target.value)}>
                  <option value="" disabled>-- Tanlang --</option>
                  {categories.map((c, i) => <option key={i} value={c}>{c}</option>)}
                </select>
              </div>
              
              {!isClothingCategory && (
                <div className="profile-field">
                  <label>Ombordagi soni (Zaxira) *</label>
                  <input required={!isClothingCategory} type="number" value={newProductStock} onChange={e => setNewProductStock(e.target.value)} placeholder="Masalan: 50" />
                </div>
              )}

              {isClothingCategory && (
                <div className="profile-field">
                  <label>Razmerlar va ularning zaxirasi *</label>
                  <div style={{display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '10px'}}>
                    {newProductSizes.map((sz, idx) => (
                      <div key={idx} style={{display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: '#e2e8f0', borderRadius: '8px'}}>
                        <span><strong>{sz.size}</strong> - {sz.stock} ta bor</span>
                        <button type="button" onClick={() => setNewProductSizes(newProductSizes.filter((_, i) => i !== idx))} style={{background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer'}}><X size={16} /></button>
                      </div>
                    ))}
                  </div>
                  <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                    <input
                      type="text"
                      id="new-profile-size-name"
                      placeholder="Razmer (M, 42)"
                      style={{ flex: 1, padding: '10px', border: '1px solid #cbd5e1', borderRadius: '8px' }}
                    />
                    <input
                      type="number"
                      id="new-profile-size-stock"
                      placeholder="Soni"
                      style={{ width: '80px', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '8px' }}
                    />
                    <button
                      type="button"
                      className="profile-save-btn"
                      style={{ padding: '0 12px' }}
                      onClick={() => {
                        const name = document.getElementById('new-profile-size-name').value.trim();
                        const stock = parseInt(document.getElementById('new-profile-size-stock').value, 10);
                        if (name && stock > 0) {
                          setNewProductSizes([...newProductSizes, { size: name, stock }]);
                          document.getElementById('new-profile-size-name').value = '';
                          document.getElementById('new-profile-size-stock').value = '';
                        }
                      }}
                    >
                      Qo'shish
                    </button>
                  </div>
                </div>
              )}

              <div className="profile-field">
                <label>Rasmlar (Fayl yuklash - max 5 ta) *</label>
                <div style={{display: 'flex', gap: '10px', flexWrap: 'wrap'}}>
                  {newProductImages.map((img, i) => (
                    <div key={i} style={{position: 'relative', width: '100px', height: '100px'}}>
                      <img src={img} alt="preview" style={{width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px'}} />
                      <button type="button" onClick={() => handleRemoveImage(i)} style={{position: 'absolute', top: '-5px', right: '-5px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'}}>
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                  {newProductImages.length < 5 && (
                    <label className="profile-image-upload" style={{width: '100px', height: '100px'}}>
                      <Image size={24} color="#94a3b8" />
                      <input type="file" accept="image/*" multiple onChange={handleImageUpload} style={{display: 'none'}} />
                    </label>
                  )}
                </div>
              </div>
              <div className="profile-field">
                <label>Qisqacha ta'rif</label>
                <textarea rows="4" value={newProductDesc} onChange={e => setNewProductDesc(e.target.value)} placeholder="Mahsulot haqida ma'lumot..."></textarea>
              </div>
              <button type="submit" className="profile-save-btn">Yuborish</button>
            </form>
          </div>
        )}

        {/* SELLER ORDERS TAB */}
        {activeTab === 'seller-orders' && (
          <div className="profile-tab-content">
            <div className="profile-page-header">
              <h1>Menga Kelgan Buyurtmalar</h1>
              <p>Siz kiritgan mahsulotlarni kimdir buyurtma qilsa, shu yerda ko'rinadi</p>
            </div>
            {sellerOrders.length === 0 ? (
              <p style={{color: '#64748b'}}>Hozircha sizning mahsulotlaringizga buyurtma tushmadi.</p>
            ) : (
              <div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
                {sellerOrders.map(order => {
                  // Only show items in this order that belong to this seller
                  const myItems = order.items.filter(item => item.creatorPhone === user.phone);
                  if (myItems.length === 0) return null;
                  
                  return (
                    <div key={order.id} style={{border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px', background: '#fff', borderLeft: '4px solid #7c3aed'}}>
                      <div style={{display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px', marginBottom: '12px'}}>
                        <div>
                          <strong>Buyurtma: #{order.id}</strong><br/>
                          <span style={{fontSize: '13px', color: '#64748b'}}>Mijoz: {order.buyer?.name} ({order.buyer?.phone})</span>
                        </div>
                        <span style={{color: order.status === 'Yangi' ? '#f59e0b' : '#10b981', fontWeight: 600}}>
                          {order.status}
                        </span>
                      </div>
                      {myItems.map((item, idx) => (
                        <div key={idx} style={{display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px'}}>
                          <span>{item.name} (x{item.quantity}) {item.size && `- ${item.size}`}</span>
                          <span>{formatPrice(item.price * item.quantity)}</span>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

      </main>
    </div>
  );
};

export default Profile;
