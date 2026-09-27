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
  
  useEffect(() => {
    const fetchStoreData = async () => {
      try {
        const [catsRes, appsRes] = await Promise.all([
          api.get('/categories'),
          api.get('/store-applications/my-applications')
        ]);
        setCategories(catsRes.data);
        setMyApplications(appsRes.data);
      } catch (error) {
        console.error('Failed to load store application data:', error);
      }
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
          <button className={`up-nav-item ${activeMenu === "Do'kon ochish" ? 'active' : ''}`} onClick={() => setActiveMenu("Do'kon ochish")}>
            Do'kon ochish
            {myApplications.some(app => app.status === 'approved') && (
              <span style={{ background: '#ef4444', color: 'white', fontSize: '10px', padding: '2px 6px', borderRadius: '10px', marginLeft: '5px' }}>1</span>
            )}
          </button>
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
                    <div key={app.id} className="store-app-card">
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