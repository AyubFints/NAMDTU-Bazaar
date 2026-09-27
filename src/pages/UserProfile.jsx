import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { X, ChevronRight, FileText, Loader2 } from 'lucide-react';
import CustomDatePicker from '../components/CustomDatePicker';
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
          <button className={`up-nav-item ${activeMenu === "Do'kon ochish" ? 'active' : ''}`} onClick={() => setActiveMenu("Do'kon ochish")}>Do'kon ochish</button>
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
            <h2>Do'kon ochish</h2>
            <div className="up-form-group" style={{ marginTop: '20px' }}>
              <p>Tez orada bu yerda do'kon yaratish imkoniyati qo'shiladi...</p>
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
    </div>
  );
};

export default UserProfile;