import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { X, ChevronRight, FileText } from 'lucide-react';
import './UserProfile.css';

const UserProfile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState('Buyurtmalarim');
  const [showUnderConstruction, setShowUnderConstruction] = useState(false);

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
        </nav>
      </aside>

      {/* RIGHT CONTENT */}
      <main className="up-content">
        {activeMenu === "Ma'lumotlarim" ? (
          <div className="up-settings-form">
            <h2>Ma'lumotlarim</h2>
            <div className="up-form-grid">
              <div className="up-form-group">
                <label>Familiya *</label>
                <input type="text" />
              </div>
              <div className="up-form-group">
                <label>Ism *</label>
                <input type="text" />
              </div>
              <div className="up-form-group">
                <label>Otasining ismi</label>
                <input type="text" />
              </div>
              <div className="up-form-group">
                <label>Tug'ilgan sana</label>
                <input type="date" />
              </div>
              <div className="up-form-group">
                <label>Jins</label>
                <div className="up-gender-toggle">
                  <button className="active">Erkak</button>
                  <button>Ayol</button>
                </div>
              </div>
              <div className="up-form-group">
                <label>Elektron pochta *</label>
                <input type="email" />
              </div>
              <div className="up-form-group">
                <label>Telefon raqami *</label>
                <input type="text" value={user?.phone || '+998 '} readOnly />
              </div>
            </div>
            <button className="up-text-btn" style={{color: 'red', marginTop: '40px', padding: 0, fontWeight: '500', display: 'flex'}} onClick={() => { logout(); navigate('/'); }}>
              Profildan chiqish
            </button>
          </div>
        ) : (
          <div className="up-empty-state">
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
        )}
      </main>
    </div>
  );
};

export default UserProfile;