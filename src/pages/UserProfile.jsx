import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { X, ChevronRight, FileText, Loader2, Store, Trash2, Edit2 } from 'lucide-react';
import CustomDatePicker from '../components/CustomDatePicker';
import api from '../api/axios';
import './UserProfile.css';

const UserProfile = () => {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState('Buyurtmalarim');
  const [activeTab, setActiveTab] = useState('Faol');
  const [showUnderConstruction, setShowUnderConstruction] = useState(false);

  const [formData, setFormData] = useState({
    lastName: '',
    firstName: '',
    middleName: '',
    birthDate: '',
    gender: 'Erkak',
    email: '',
    phone: user?.phone || '+998 '
  });
  const [isDirty, setIsDirty] = useState(false);
  const [showError, setShowError] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Store Application states
  const [storeModalOpen, setStoreModalOpen] = useState(false);
  const [editingStoreApp, setEditingStoreApp] = useState(null);
  const [storeAppFormData, setStoreAppFormData] = useState({
    storeName: '',
    ownerName: user?.name !== 'Foydalanuvchi' ? user?.name : '',
    phone: user?.phone || '',
    category: '',
    customCategory: ''
  });
  const [categories, setCategories] = useState([]);
  const [myApplications, setMyApplications] = useState([]);
  const [unseenApproved, setUnseenApproved] = useState(false);
  const [myProducts, setMyProducts] = useState([]);
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [mySales, setMySales] = useState([]);
  const [showApprovalMsg, setShowApprovalMsg] = useState(false);
  const [productFormData, setProductFormData] = useState({
    name: '', price: '', oldPrice: '', category: '', description: '', images: [],
    cardNumber: '', cardHolderName: '', cardType: 'uzcard', sizes: []
  });
  const [customSize, setCustomSize] = useState('');
  const [customStock, setCustomStock] = useState('1');
  const [showCustomSizeInput, setShowCustomSizeInput] = useState(false);

  const addStandardSize = (sizeVal) => {
    if (!productFormData.sizes.find(s => s.size === sizeVal)) {
      setProductFormData(prev => ({ ...prev, sizes: [...prev.sizes, { size: sizeVal, stock: 1 }] }));
    }
  };

  const handleAddCustomSize = () => {
    if (customSize.trim()) {
      if (!productFormData.sizes.find(s => s.size === customSize.trim())) {
        setProductFormData(prev => ({ 
          ...prev, 
          sizes: [...prev.sizes, { size: customSize.trim(), stock: parseInt(customStock) || 1 }] 
        }));
      }
      setCustomSize('');
      setCustomStock('1');
      setShowCustomSizeInput(false);
    }
  };

  const updateSizeStock = (index, val) => {
    const newSizes = [...productFormData.sizes];
    newSizes[index].stock = parseInt(val) || 0;
    setProductFormData(prev => ({ ...prev, sizes: newSizes }));
  };

  const removeSize = (index) => {
    setProductFormData(prev => ({
      ...prev,
      sizes: prev.sizes.filter((_, i) => i !== index)
    }));
  };

  useEffect(() => {
    const approvedApps = myApplications.filter(a => a.status === 'approved').length;
    const approvedProds = myProducts.filter(p => p.status === 'approved').length;
    const totalApproved = approvedApps + approvedProds;
    const lastSeen = parseInt(localStorage.getItem('lastSeenApprovedCount') || '0', 10);
    
    if (activeMenu === "Do'kon ochish" || activeMenu === "Menga kelgan buyurtmalar") {
      localStorage.setItem('lastSeenApprovedCount', totalApproved.toString());
      setUnseenApproved(false);
      window.dispatchEvent(new Event('storeAppUpdated'));
    } else if (totalApproved > lastSeen) {
      setUnseenApproved(true);
    } else {
      setUnseenApproved(false);
    }
  }, [myApplications, myProducts, activeMenu]);

  const handleStoreTabClick = () => {
    setActiveMenu("Do'kon ochish");
    const approvedProds = myProducts.filter(p => p.status === 'approved').length;

    const hasShown = localStorage.getItem('firstProductApprovedMsgShown');
    if (!hasShown && approvedProds > 0) {
      setShowApprovalMsg(true);
      localStorage.setItem('firstProductApprovedMsgShown', 'true');
      setTimeout(() => setShowApprovalMsg(false), 10000);
    }
  };
  
  useEffect(() => {
    const fetchStoreData = async () => {
      // Fetch categories
      try {
        const catsRes = await api.get('/categories');
        setCategories(catsRes.data);
      } catch (err) { console.error('Failed to load categories', err); }

      // Fetch applications
      try {
        const appsRes = await api.get('/store-applications/my-applications');
        setMyApplications(appsRes.data);
      } catch (err) { console.error('Failed to load applications', err); }

      // Fetch products
      try {
        const prodsRes = await api.get('/products/my-products');
        setMyProducts(prodsRes.data);
      } catch (err) { console.error('Failed to load products', err); }

      // Fetch sales (might fail if backend not updated)
      try {
        const salesRes = await api.get('/orders/my-sales');
        setMySales(salesRes.data);
      } catch (err) { console.error('Failed to load sales', err); }
    };
    if (user) {
      fetchStoreData();
    }
  }, [user]);

  const handleStoreAppSubmit = async (e) => {
    e.preventDefault();
    const { storeName, ownerName, phone, category, customCategory } = storeAppFormData;
    if (!storeName.trim() || !ownerName.trim() || !phone.trim() || (!category && !customCategory.trim())) {
      alert("Iltimos, barcha maydonlarni to'ldiring!");
      return;
    }

    const finalCategory = category === 'boshqa' ? customCategory : category;

    try {
      if (editingStoreApp) {
        const { data } = await api.put(`/store-applications/${editingStoreApp.id}`, {
          storeName, ownerName, phone, categories: [finalCategory]
        });
        setMyApplications(myApplications.map(app => app.id === editingStoreApp.id ? data : app));
      } else {
        const { data } = await api.post('/store-applications', {
          storeName, ownerName, phone, categories: [finalCategory]
        });
        setMyApplications([...myApplications, data]);
      }
      setStoreModalOpen(false);
      setEditingStoreApp(null);
      setStoreAppFormData({ storeName: '', ownerName: user?.name !== 'Foydalanuvchi' ? user?.name : '', phone: user?.phone || '', category: '', customCategory: '' });
    } catch (error) {
      alert("Xatolik: " + (error.response?.data?.message || error.message));
    }
  };

  const handleDeleteStoreApp = async (id) => {
    if (window.confirm("Rostdan ham o'chirmoqchimisiz?")) {
      try {
        await api.delete(`/store-applications/${id}`);
        setMyApplications(myApplications.filter(app => app.id !== id));
      } catch (error) {
        alert("Xatolik: " + (error.response?.data?.message || error.message));
      }
    }
  };

  const openEditStoreApp = (app) => {
    setEditingStoreApp(app);
    const cat = categories.find(c => c.name === app.categories?.[0]) ? app.categories[0] : 'boshqa';
    const customCat = cat === 'boshqa' ? app.categories?.[0] : '';
    setStoreAppFormData({
      storeName: app.storeName,
      ownerName: app.ownerName,
      phone: app.phone,
      category: cat,
      customCategory: customCat
    });
    setStoreModalOpen(true);
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    if (!productFormData.name || !productFormData.price || !productFormData.category) {
      alert("Majburiy maydonlarni to'ldiring!");
      return;
    }
    try {
      const { data } = await api.post('/products', {
        name: productFormData.name,
        price: productFormData.price,
        oldPrice: productFormData.oldPrice || null,
        category: productFormData.category,
        description: productFormData.description,
        images: productFormData.images,
        cardNumber: productFormData.cardNumber,
        cardHolderName: productFormData.cardHolderName,
        cardType: productFormData.cardType,
        sizes: productFormData.sizes,
        stock: productFormData.sizes.length > 0 
          ? productFormData.sizes.reduce((acc, curr) => acc + curr.stock, 0).toString() 
          : '1'
      });
      setMyProducts([...myProducts, data]);
      setProductModalOpen(false);
      setProductFormData({ name: '', price: '', oldPrice: '', category: '', description: '', images: [], cardNumber: '', cardHolderName: '', cardType: 'uzcard', sizes: [] });
      alert("Tavar muvaffaqiyatli jo'natildi! Admin tasdiqlashi kutilmoqda.");
    } catch (error) {
      alert("Xatolik: " + (error.response?.data?.message || error.message));
    }
  };

  const handleProductImage = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const remainingSlots = 5 - productFormData.images.length;
    const filesToProcess = files.slice(0, remainingSlots);

    filesToProcess.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProductFormData(prev => ({ ...prev, images: [...prev.images, reader.result] }));
      };
      reader.readAsDataURL(file);
    });
  };

  const removeProductImage = (index) => {
    setProductFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  // Parse existing user name if available
  useEffect(() => {
    if (user?.name && user.name !== 'Foydalanuvchi' && !isDirty) {
      const parts = user.name.split(' ');
      if (parts.length > 1) {
        setFormData(prev => ({ ...prev, lastName: parts[0], firstName: parts.slice(1).join(' ') }));
      } else {
        setFormData(prev => ({ ...prev, firstName: user.name }));
      }
    }
  }, [user]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setIsDirty(true);
    setShowError(false);
  };

  const handleSave = async () => {
    if (!formData.lastName.trim() || !formData.firstName.trim() || !formData.email.trim() || !formData.phone.trim()) {
      setShowError(true);
      return;
    }
    
    setIsSaving(true);
    
    const res = await updateUser({ 
      name: `${formData.lastName} ${formData.firstName}`.trim(),
      phone: formData.phone
    });
    
    if (res?.success) {
      setIsDirty(false);
      setShowError(false);
    } else {
      setShowError(true);
    }
    
    setIsSaving(false);
  };

  const handleCancel = () => {
    setFormData({
      lastName: '',
      firstName: '',
      middleName: '',
      birthDate: '',
      gender: 'Erkak',
      email: '',
      phone: user?.phone || '+998 '
    });
    setIsDirty(false);
    setShowError(false);
  };

  // Auto-hide modal after 3 seconds
  useEffect(() => {
    let timer;
    if (showUnderConstruction) {
      timer = setTimeout(() => {
        setShowUnderConstruction(false);
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [showUnderConstruction]);

  const handleBonusClick = () => {
    setShowUnderConstruction(true);
  };

  const handleStartShopping = () => {
    navigate('/');
  };

  return (
    <div className="user-profile-layout">
      {/* Approval Notification Modal */}
      {showApprovalMsg && (
        <div className="approval-toast">
          Sizning mahsulotingiz tasdiqlandi va siz uchun "Menga kelgan buyurtmalar" bo'limi ochildi. Siz bu yerdan turib mijozlar bilan bog'lanib tavaringizni sotishingiz mumkin.
          <button 
            onClick={() => setShowApprovalMsg(false)}
            className="approval-toast-close"
          >
            &times;
          </button>
        </div>
      )}

      {/* Under Construction Modal */}
      {showUnderConstruction && (
        <div className="up-modal-overlay">
          <div className="up-modal">
            <button className="up-modal-close" onClick={() => setShowUnderConstruction(false)}>
              <X size={20} />
            </button>
            <h3>Ustida ishlanmoqda</h3>
            <p>Bu bo'lim tez orada ishga tushadi!</p>
          </div>
        </div>
      )}

      {/* Product Creation Modal (Creative & Compact) */}
      {productModalOpen && (
        <div className="up-modal-overlay" onClick={() => setProductModalOpen(false)}>
          <div className="up-modal creative-modal" onClick={(e) => e.stopPropagation()}>
            <button className="up-modal-close" onClick={() => setProductModalOpen(false)}>
              <X size={20} />
            </button>
            <div className="creative-modal-header">
              <div className="creative-icon-wrapper">
                <Store size={24} color="#3b82f6" />
              </div>
              <div>
                <h3>Yangi Tavar</h3>
                <p>O'z mahsulotingizni soting</p>
              </div>
            </div>
            
            <div className="creative-alert">
              <span>Admin tasdiqlagandan so'ng, ushbu tavar NAMDTU Bazaar-da paydo bo'ladi.</span>
            </div>

            <form onSubmit={handleProductSubmit} className="creative-form">
              <div className="creative-form-row">
                <div className="creative-input-group">
                  <label>Nomi <span className="req">*</span></label>
                  <input type="text" className="creative-input" placeholder="Kurtka" value={productFormData.name} onChange={(e) => setProductFormData({...productFormData, name: e.target.value})} required />
                </div>
                <div className="creative-input-group">
                  <label>Narxi <span className="req">*</span></label>
                  <input type="number" className="creative-input" placeholder="150 000" value={productFormData.price} onChange={(e) => setProductFormData({...productFormData, price: e.target.value})} required />
                </div>
                <div className="creative-input-group">
                  <label>Oldingi narxi</label>
                  <input type="number" className="creative-input" placeholder="200 000" value={productFormData.oldPrice} onChange={(e) => setProductFormData({...productFormData, oldPrice: e.target.value})} />
                </div>
              </div>

              <div className="creative-form-row">
                <div className="creative-input-group">
                  <label>Kategoriya <span className="req">*</span></label>
                  <select className="creative-input" value={productFormData.category} onChange={(e) => setProductFormData({...productFormData, category: e.target.value})} required>
                    <option value="">Tanlang</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.name}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div className="creative-input-group">
                  <label>Rasm ({productFormData.images.length}/5)</label>
                  <div className="creative-file-input">
                    <input type="file" accept="image/*" multiple onChange={handleProductImage} disabled={productFormData.images.length >= 5} />
                    <span>{productFormData.images.length >= 5 ? 'Joy to\'ldi' : 'Fayl tanlash'}</span>
                  </div>
                </div>
              </div>
              
              {productFormData.images.length > 0 && (
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '-5px', marginBottom: '15px' }}>
                  {productFormData.images.map((img, i) => (
                    <div key={i} style={{ position: 'relative', width: '60px', height: '60px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                      <img src={img} alt={`Preview ${i}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <button type="button" onClick={() => removeProductImage(i)} style={{ position: 'absolute', top: '2px', right: '2px', background: 'rgba(0,0,0,0.5)', color: 'white', border: 'none', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', padding: 0 }}>
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="creative-input-group" style={{ marginTop: '15px' }}>
                <label>Ta'rif (qisqacha)</label>
                <textarea className="creative-input" rows="3" placeholder="Mahsulot haqida ma'lumot..." value={productFormData.description} onChange={(e) => setProductFormData({...productFormData, description: e.target.value})} />
              </div>

              {productFormData.category && (
                <div className="creative-card-section" style={{ marginTop: '15px' }}>
                  <label className="section-label" style={{ marginBottom: '8px' }}>O'lchamlar va variantlar (qaysidan nechta bor)</label>
                  
                  {productFormData.sizes.length > 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '15px' }}>
                      {productFormData.sizes.map((s, idx) => (
                        <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#f8fafc', padding: '8px 12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                          <span style={{ fontWeight: 'bold', color: '#1e293b', minWidth: '60px' }}>{s.size}</span>
                          <input 
                            type="number" 
                            className="creative-input" 
                            style={{ padding: '6px 10px', width: '80px', flex: 1 }} 
                            value={s.stock} 
                            onChange={(e) => updateSizeStock(idx, e.target.value)} 
                            min="0"
                          />
                          <span style={{ fontSize: '13px', color: '#64748b' }}>dona</span>
                          <button type="button" onClick={() => removeSize(idx)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px' }}>
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '10px' }}>
                    {['S', 'M', 'L', 'XL', 'XXL'].map(sz => (
                      <button key={sz} type="button" onClick={() => addStandardSize(sz)} style={{ padding: '6px 12px', background: '#eff6ff', color: '#2563eb', border: '1px solid #bfdbfe', borderRadius: '6px', fontSize: '13px', cursor: 'pointer', fontWeight: '500' }}>
                        + {sz}
                      </button>
                    ))}
                    <button type="button" onClick={() => setShowCustomSizeInput(!showCustomSizeInput)} style={{ padding: '6px 12px', background: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px', cursor: 'pointer', fontWeight: '500' }}>
                      Boshqacha variant qo'shish
                    </button>
                  </div>

                  {showCustomSizeInput && (
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end', background: '#f1f5f9', padding: '12px', borderRadius: '8px', marginTop: '10px' }}>
                      <div className="creative-input-group" style={{ flex: 2 }}>
                        <label>Variant nomi (masalan: 39, Qizil)</label>
                        <input type="text" className="creative-input" value={customSize} onChange={(e) => setCustomSize(e.target.value)} placeholder="Nomi" />
                      </div>
                      <div className="creative-input-group" style={{ flex: 1 }}>
                        <label>Soni</label>
                        <input type="number" className="creative-input" value={customStock} onChange={(e) => setCustomStock(e.target.value)} min="1" />
                      </div>
                      <button type="button" onClick={handleAddCustomSize} className="up-primary-btn" style={{ margin: '0', padding: '10px 16px', background: '#2563eb' }}>
                        Qo'shish
                      </button>
                    </div>
                  )}
                </div>
              )}

              <div className="creative-card-section">
                <label className="section-label">Plastik karta (foyda uchun)</label>
                <div className="creative-form-row">
                  <div className="creative-input-group">
                    <input type="text" className="creative-input" placeholder="Karta raqami" value={productFormData.cardNumber} onChange={(e) => {
                      const onlyNums = e.target.value.replace(/\D/g, '');
                      setProductFormData({...productFormData, cardNumber: onlyNums});
                    }} />
                  </div>
                  <div className="creative-input-group" style={{ maxWidth: '100px' }}>
                    <input type="text" className="creative-input text-center" placeholder="UZCARD" value={productFormData.cardType} onChange={(e) => setProductFormData({...productFormData, cardType: e.target.value})} />
                  </div>
                </div>
                <div className="creative-input-group" style={{ marginTop: '10px' }}>
                  <input type="text" className="creative-input" placeholder="Karta egasi (Ism Familiya)" value={productFormData.cardHolderName} onChange={(e) => setProductFormData({...productFormData, cardHolderName: e.target.value})} />
                </div>
              </div>

              <button type="submit" className="creative-submit-btn">Tavarni Jo'natish</button>
            </form>
          </div>
        </div>
      )}

      {/* LEFT SIDEBAR */}
      <aside className="up-sidebar">
        <div className="up-bonus-card">
          {(user?.name && user.name !== 'Foydalanuvchi') && <div className="up-bonus-name">{user.name}</div>}
          <div className="up-bonus-phone">{user?.phone || '+998 00 000 00 00'}</div>
          <div className="up-bonus-inner" onClick={handleBonusClick}>
            <div className="up-bonus-text">
              <h4>Olib ketish foizi: 100%</h4>
              <p>Barcha bonuslaringizni ko'ring</p>
            </div>
            <ChevronRight size={18} className="up-bonus-icon" />
          </div>
        </div>

        <nav className="up-nav">
          <button className={`up-nav-item ${activeMenu === 'Buyurtmalarim' ? 'active' : ''}`} onClick={() => setActiveMenu('Buyurtmalarim')}>Buyurtmalarim</button>
          <button className={`up-nav-item ${activeMenu === 'Sharhlar' ? 'active' : ''}`} onClick={() => setActiveMenu('Sharhlar')}>
            Sharhlar <span className="up-dot"></span>
          </button>
          <button className={`up-nav-item ${activeMenu === "Ma'lumotlarim" ? 'active' : ''}`} onClick={() => setActiveMenu("Ma'lumotlarim")}>Ma'lumotlarim</button>
          <button className={`up-nav-item ${activeMenu === 'Ijtimoiy promokodlar' ? 'active' : ''}`} onClick={() => setActiveMenu('Ijtimoiy promokodlar')}>Ijtimoiy promokodlar</button>
          <button className={`up-nav-item ${activeMenu === "Do'kon ochish" ? 'active' : ''}`} onClick={handleStoreTabClick}>
            Do'kon ochish
            {unseenApproved && (
              <span style={{ background: '#ef4444', color: 'white', fontSize: '10px', padding: '2px 6px', borderRadius: '10px', marginLeft: '5px' }}>1</span>
            )}
          </button>
          {myProducts.filter(p => p.status === 'approved').length > 0 && (
            <button className={`up-nav-item ${activeMenu === 'Menga kelgan buyurtmalar' ? 'active' : ''}`} onClick={() => setActiveMenu('Menga kelgan buyurtmalar')}>
              Menga kelgan buyurtmalar
            </button>
          )}
        </nav>
      </aside>

      {/* RIGHT CONTENT */}
      <main className="up-content">
        {activeMenu === "Ma'lumotlarim" ? (
          <div className="up-settings-wrapper">
            <h2>Ma'lumotlarim</h2>
            <div className="up-form-grid">
              <div className="up-form-group">
                <label>Familiya <span className="req">*</span></label>
                <div className="input-with-clear">
                  <input type="text" value={formData.lastName} onChange={(e) => handleInputChange('lastName', e.target.value)} />
                  {formData.lastName && <button className="clear-btn" onClick={() => handleInputChange('lastName', '')}><X size={14}/></button>}
                </div>
              </div>
              <div className="up-form-group">
                <label>Ism <span className="req">*</span></label>
                <input type="text" value={formData.firstName} onChange={(e) => handleInputChange('firstName', e.target.value)} />
              </div>
              <div className="up-form-group">
                <label>Otasining ismi</label>
                <input type="text" value={formData.middleName} onChange={(e) => handleInputChange('middleName', e.target.value)} />
              </div>
              <div className="up-form-group">
                <label>Tug'ilgan sana</label>
                <CustomDatePicker value={formData.birthDate} onChange={(val) => handleInputChange('birthDate', val)} />
              </div>
              <div className="up-form-group">
                <label>Jins</label>
                <div className="up-gender-toggle">
                  <button className={formData.gender === 'Erkak' ? 'active' : ''} onClick={() => handleInputChange('gender', 'Erkak')}>Erkak</button>
                  <button className={formData.gender === 'Ayol' ? 'active' : ''} onClick={() => handleInputChange('gender', 'Ayol')}>Ayol</button>
                </div>
              </div>
              <div className="up-form-group">
                <label>Elektron pochta <span className="req">*</span></label>
                <input type="email" value={formData.email} onChange={(e) => handleInputChange('email', e.target.value)} />
              </div>
              <div className="up-form-group">
                <label>Telefon raqami <span className="req">*</span></label>
                <div className="phone-input-wrapper">
                  <span className="flag-icon">🇺🇿</span>
                  <input type="text" value={formData.phone} onChange={(e) => handleInputChange('phone', e.target.value)} />
                  {formData.phone && formData.phone !== '+998 ' && <button className="clear-btn" onClick={() => handleInputChange('phone', '+998 ')}><X size={14}/></button>}
                </div>
              </div>
            </div>
            
            <div className="up-form-footer">
              <button className="up-logout-btn" onClick={() => { logout(); navigate('/'); }}>
                Tizimdan chiqish
              </button>

              <div className="up-form-actions-wrapper">
                {showError && <span className="up-error-msg">Iltimos qolgan joylarni ham to'ldiring!</span>}
                {isDirty && (
                  <div className="up-form-actions">
                    <button className="up-cancel-btn" onClick={handleCancel} disabled={isSaving}>Bekor qilish</button>
                    <button className="up-save-btn" onClick={handleSave} disabled={isSaving}>
                      {isSaving ? <Loader2 size={18} className="spin-icon" style={{animation: 'spin 1s linear infinite'}} /> : 'Saqlash'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : activeMenu === "Do'kon ochish" ? (
          <div className="up-settings-wrapper">
            <h2 style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              Do'kon ochish
              <button className="up-primary-btn" onClick={() => setStoreModalOpen(true)}>Do'kon yaratish</button>
            </h2>
            <div className="up-form-group" style={{ marginTop: '20px' }}>
              <p style={{ color: '#0a1052', fontWeight: '500', marginBottom: '20px' }}>
                Do'kon yaratib o'zingizni tavaringizni NAMDTU Bazaar dasturida sotishingiz mumkin
              </p>
              
              {myApplications.length > 0 ? (
                <div className="store-apps-list" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  {myApplications.map(app => (
                    <div key={app.id}>
                      <div className="store-app-card">
                        <div className="store-app-header">
                          <h3>{app.storeName}</h3>
                          <span className={`store-app-badge ${app.status}`}>
                            {app.status === 'approved' ? 'Qabul qilindi' : app.status === 'rejected' ? 'Qabul qilinmadi' : 'Kutilmoqda'}
                          </span>
                        </div>
                        
                        <div className="store-app-body">
                          <p><strong>Boshliq:</strong> <span>{app.ownerName}</span></p>
                          <p><strong>Nomer:</strong> <span>{app.phone}</span></p>
                          <p><strong>Kategoriyalar:</strong> <span>{app.categories?.join(', ')}</span></p>
                        </div>
                        
                        {app.status === 'pending' && (
                          <div className="store-app-actions">
                            <button onClick={() => openEditStoreApp(app)} className="edit-btn">
                              <Edit2 size={16}/> O'zgartirish
                            </button>
                            <button onClick={() => handleDeleteStoreApp(app.id)} className="delete-btn">
                              <Trash2 size={16}/> O'chirish
                            </button>
                          </div>
                        )}
                        
                        {app.status === 'pending' && (
                          <div className="store-app-footer">
                            <span className="pulsing-dot"></span>
                            Ko'rib chiqilmoqda. Ertagacha natijani aytamiz.
                          </div>
                        )}

                        {app.status === 'approved' && (
                          <div style={{ marginTop: '20px', borderTop: '1px solid #e2e8f0', paddingTop: '15px' }}>
                            <button className="up-primary-btn" style={{ width: '100%' }} onClick={() => setProductModalOpen(true)}>
                              Tavar yaratish
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Display Products of the User */}
                      {app.status === 'approved' && myProducts.length > 0 && (
                        <div style={{ marginTop: '20px' }}>
                          <h3 style={{ color: '#0a1052', marginBottom: '15px' }}>Sizning tavarlaringiz</h3>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '15px' }}>
                            {myProducts.map(prod => (
                              <div key={prod.id} style={{ background: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                                <div style={{ height: '120px', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                  {prod.images && prod.images.length > 0 ? (
                                    <img src={prod.images[0]} alt={prod.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                  ) : (
                                    <span style={{ color: '#94a3b8' }}>Rasm yo'q</span>
                                  )}
                                </div>
                                <div style={{ padding: '12px' }}>
                                  <h4 style={{ margin: '0 0 5px 0', fontSize: '14px', color: '#1e293b' }}>{prod.name}</h4>
                                  <p style={{ margin: '0 0 10px 0', fontSize: '13px', fontWeight: 'bold', color: '#2563eb' }}>{prod.price} so'm</p>
                                  <span style={{ 
                                    padding: '4px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: '600',
                                    background: prod.status === 'approved' ? '#dcfce7' : prod.status === 'rejected' ? '#fee2e2' : '#fef9c3',
                                    color: prod.status === 'approved' ? '#166534' : prod.status === 'rejected' ? '#991b1b' : '#854d0e'
                                  }}>
                                    {prod.status === 'approved' ? 'Tasdiqlangan' : prod.status === 'rejected' ? 'Rad etilgan' : 'Ko\'rib chiqilmoqda'}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ padding: '40px', textAlign: 'center', background: '#f8fafc', borderRadius: '12px', border: '1px dashed #cbd5e1' }}>
                  <Store size={48} color="#94a3b8" style={{ marginBottom: '15px' }} />
                  <p style={{ color: '#64748b' }}>Hali arizalar yo'q. "Do'kon yaratish" tugmasini bosing.</p>
                </div>
              )}
            </div>
          </div>
        ) : activeMenu === "Menga kelgan buyurtmalar" ? (
          <div className="up-settings-wrapper">
            <h2>Menga kelgan buyurtmalar</h2>
            <p style={{ color: '#64748b', marginBottom: '20px' }}>Bu yerda sizning tavarlaringizni sotib olgan xaridorlarning ro'yxati ko'rinadi.</p>
            {mySales && mySales.length > 0 ? (
              <div className="my-sales-list">
                {mySales.map(order => (
                  <div key={order.id} style={{ background: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '15px', marginBottom: '15px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '10px', marginBottom: '10px' }}>
                      <div>
                        <strong>Buyurtma ID:</strong> #{order.id}<br/>
                        <span style={{ fontSize: '12px', color: '#64748b' }}>{new Date(order.createdAt).toLocaleString('uz-UZ')}</span>
                      </div>
                      <div>
                        <span style={{ background: '#dcfce7', color: '#166534', padding: '4px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' }}>
                          {order.status || 'Yangi'}
                        </span>
                      </div>
                    </div>
                    <div>
                      <p><strong>Xaridor:</strong> {order.buyerName} ({order.buyerPhone})</p>
                      <p><strong>Manzil:</strong> {order.address}</p>
                      <p><strong>Tavarlar:</strong></p>
                      <ul style={{ paddingLeft: '20px' }}>
                        {order.items.map((item, idx) => (
                          <li key={idx}>
                            {item.name} - {item.quantity} dona ({item.price} so'm)
                          </li>
                        ))}
                      </ul>
                      <p style={{ marginTop: '10px', fontSize: '16px', fontWeight: 'bold', color: '#2563eb' }}>
                        Sizga tushadigan jami: {order.totalAmount.toLocaleString('uz-UZ')} so'm
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="up-empty-state">
                <div style={{marginBottom: '20px', color: '#cbd5e1'}}>
                  <Store size={64} strokeWidth={1} />
                </div>
                <h2>Hozircha buyurtmalar yo'q</h2>
                <p>
                  Sizning tavarlaringiz bo'yicha hali hech qanday xarid amalga oshirilmagan.
                </p>
              </div>
            )}
          </div>
        ) : (
          <>
            {activeMenu === 'Buyurtmalarim' && (
              <div className="up-tabs">
                <button 
                  className={`up-tab ${activeTab === 'Barcha buyurtmalar' ? 'active' : ''}`}
                  onClick={() => setActiveTab('Barcha buyurtmalar')}
                >
                  Barcha buyurtmalar
                </button>
                <button 
                  className={`up-tab ${activeTab === "To'lov qilinmagan" ? 'active' : ''}`}
                  onClick={() => setActiveTab("To'lov qilinmagan")}
                >
                  To'lov qilinmagan
                </button>
                <button 
                  className={`up-tab ${activeTab === 'Faol' ? 'active' : ''}`}
                  onClick={() => setActiveTab('Faol')}
                >
                  Faol
                </button>
              </div>
            )}
            <div className={`up-empty-state ${activeMenu !== 'Buyurtmalarim' ? 'no-border' : ''}`}>
              <div style={{marginBottom: '20px', color: '#cbd5e1'}}>
                <FileText size={64} strokeWidth={1} />
              </div>
              <h2>Hozircha hech qanday ma'lumot yo'q</h2>
              <p>
                Siz tanlagan bo'limda hozircha ma'lumotlar mavjud emas.<br/>
                Barcha kerakli narsalarni topish uchun qidirishdan foydalaning!
              </p>
              <button className="up-primary-btn" onClick={handleStartShopping}>
                Xaridlarni boshlash
              </button>
            </div>
          </>
        )}
      </main>

      {storeModalOpen && (
        <div className="up-modal-overlay" onClick={() => { setStoreModalOpen(false); setEditingStoreApp(null); }}>
          <div className="up-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '500px', width: '90%', textAlign: 'left' }}>
            <button className="up-modal-close" onClick={() => { setStoreModalOpen(false); setEditingStoreApp(null); }}>
              <X size={20} />
            </button>
            <h2 style={{ marginBottom: '20px', color: '#0a1052' }}>{editingStoreApp ? 'Arizani tahrirlash' : 'Do\'kon yaratish'}</h2>
            <form onSubmit={handleStoreAppSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div className="up-field">
                <label>Do'kon nomi</label>
                <input 
                  type="text" 
                  value={storeAppFormData.storeName} 
                  onChange={e => setStoreAppFormData({...storeAppFormData, storeName: e.target.value})} 
                  required 
                  className={storeAppFormData.storeName ? 'filled' : ''}
                />
              </div>
              <div className="up-field">
                <label>Do'kon egasi ismi</label>
                <input 
                  type="text" 
                  value={storeAppFormData.ownerName} 
                  onChange={e => setStoreAppFormData({...storeAppFormData, ownerName: e.target.value})} 
                  required 
                  className={storeAppFormData.ownerName ? 'filled' : ''}
                />
              </div>
              <div className="up-field">
                <label>Telefon raqam</label>
                <input 
                  type="text" 
                  value={storeAppFormData.phone} 
                  onChange={e => setStoreAppFormData({...storeAppFormData, phone: e.target.value})} 
                  required 
                  className={storeAppFormData.phone ? 'filled' : ''}
                />
              </div>
              <div className="up-field">
                <label>Qanday turdagi tovarlar sotiladi?</label>
                <select 
                  value={storeAppFormData.category} 
                  onChange={e => setStoreAppFormData({...storeAppFormData, category: e.target.value})} 
                  required
                  className={storeAppFormData.category ? 'filled' : ''}
                >
                  <option value="">Tanlang...</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                  <option value="boshqa">Boshqa turdagi tovar sotish</option>
                </select>
              </div>
              
              {storeAppFormData.category === 'boshqa' && (
                <div className="up-field">
                  <label>Tovarlar turini kiriting</label>
                  <input 
                    type="text" 
                    value={storeAppFormData.customCategory} 
                    onChange={e => setStoreAppFormData({...storeAppFormData, customCategory: e.target.value})} 
                    required 
                    placeholder="Masalan: Uy anjomlari"
                    className={storeAppFormData.customCategory ? 'filled' : ''}
                  />
                </div>
              )}
              
              <button type="submit" className="up-primary-btn" style={{ marginTop: '10px' }}>
                Tasdiqlash
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;