import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { X, ChevronRight } from 'lucide-react';
import './UserProfile.css';

const UserProfile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Faol');
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
          <button className="up-nav-item active">Buyurtmalarim</button>
          <button className="up-nav-item">
            Sharhlar <span className="up-dot"></span>
          </button>
          <button className="up-nav-item">Ma'lumotlarim</button>
          <button className="up-nav-item">Ijtimoiy promokodlar</button>
          <button className="up-nav-item" onClick={() => { logout(); navigate('/'); }} style={{color: 'red', marginTop: '20px'}}>
            Tizimdan chiqish
          </button>
        </nav>
      </aside>

      {/* RIGHT CONTENT */}
      <main className="up-content">
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

        <div className="up-empty-state">
          <h2>Hech narsa yo'q</h2>
          <p>
            Sizda faol buyurtma mavjud emas!<br/>
            Barcha kerakli narsalarni topish uchun qidirishdan<br/>foydalaning!
          </p>
          <button className="up-primary-btn" onClick={handleStartShopping}>
            Xaridlarni boshlash
          </button>
          <button className="up-text-btn" onClick={handleStartShopping}>
            Bosh sahifaga qaytish
          </button>
        </div>
      </main>
    </div>
  );
};

export default UserProfile;