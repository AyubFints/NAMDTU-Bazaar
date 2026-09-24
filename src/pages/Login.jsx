import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { X } from 'lucide-react';
import './Auth.css';

const Login = () => {
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [phone, setPhone] = useState('');
  
  // Admin fields
  const [adminName, setAdminName] = useState('');
  const [adminPhone, setAdminPhone] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handlePhoneChange = (e, setter) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 9) val = val.substring(0, 9);
    
    let formatted = '';
    if (val.length > 0) formatted += val.substring(0, 2);
    if (val.length > 2) formatted += ' ' + val.substring(2, 5);
    if (val.length > 5) formatted += ' ' + val.substring(5, 7);
    if (val.length > 7) formatted += ' ' + val.substring(7, 9);
    
    setter(formatted);
  };

  const handleUserLogin = async (e) => {
    e.preventDefault();
    const cleanPhone = phone.replace(/\s/g, '');
    if (cleanPhone.length < 9) {
      alert("Iltimos, telefon raqamni to'liq kiriting!");
      return;
    }

    // Try to login with fixed password
    const result = await login(cleanPhone, 'User123!');
    if (result.success) {
      closeLoginModal();
    } else {
      // If login fails, they probably don't have an account, so register them
      const regResult = await register('Foydalanuvchi', cleanPhone, 'User123!', 'user');
      if (regResult.success) {
        closeLoginModal();
      } else {
        alert("Xatolik yuz berdi: " + regResult.message);
      }
    }
  };

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    const cleanPhone = adminPhone.replace(/\s/g, '');
    if (cleanPhone.length < 9) {
      alert("Telefon raqamni to'liq kiriting!");
      return;
    }
    
    const result = await login(cleanPhone, adminPassword);
    if (result.success) {
      closeLoginModal();
    } else {
      alert("Xatolik yuz berdi: " + result.message);
    }
  };

  return (
    <div className="auth-overlay">
      <div className="auth-modal">
        <button className="auth-close-btn" onClick={closeLoginModal}>
          <X size={20} />
        </button>

        {!isAdminMode ? (
          <>
            <div className="auth-modal-header">
              <div className="auth-logo">NAMDTU Bazaar</div>
              <h2>NAMDTU Bazaar'ga kirish</h2>
            </div>
            
            <form className="auth-modal-form" onSubmit={handleUserLogin}>
              <div className="uzum-phone-input">
                <span className="uzum-prefix">+998</span>
                <input 
                  type="text" 
                  placeholder="00 000-00-00" 
                  value={phone}
                  onChange={(e) => handlePhoneChange(e, setPhone)}
                  autoFocus
                />
              </div>

              <button type="submit" className="uzum-primary-btn">
                Kirish
              </button>

              <div className="auth-terms">
                Davom etgan holda men 
                <a href="#"> shaxsiy ma'lumotlarni qayta ishlash siyosatiga rozilik bildirasiz</a> va 
                <a href="#"> ommaviy oferta bilan rozi bo'laman</a>
              </div>

              <button type="button" className="auth-switch-mode-btn" onClick={() => setIsAdminMode(true)}>
                Tizimga kirish
              </button>
            </form>
          </>
        ) : (
          <>
            <div className="auth-modal-header">
              <div className="auth-logo">NAMDTU Bazaar Admin</div>
              <h2>Tizimga kirish</h2>
            </div>
            
            <form className="auth-modal-form" onSubmit={handleAdminLogin}>
              <div className="admin-form-group">
                <input 
                  type="text" 
                  placeholder="Ismingiz (Masalan: Admin)" 
                  value={adminName}
                  onChange={(e) => setAdminName(e.target.value)}
                  className="admin-input"
                  required
                />
              </div>

              <div className="admin-form-group uzum-phone-input">
                <span className="uzum-prefix">+998</span>
                <input 
                  type="text" 
                  placeholder="91 000 00 00" 
                  value={adminPhone}
                  onChange={(e) => handlePhoneChange(e, setAdminPhone)}
                  required
                />
              </div>

              <div className="admin-form-group">
                <input 
                  type="password" 
                  placeholder="Parol (Masalan: Admin001)" 
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="admin-input"
                  required
                />
              </div>

              <button type="submit" className="uzum-primary-btn">
                Tizimga kirish
              </button>

              <button type="button" className="auth-switch-mode-btn" onClick={() => setIsAdminMode(false)}>
                Orqaga qaytish
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default Login;
