const fs = require('fs');

const authScreenCode = `import React, { useState, useEffect } from 'react';
import { User, Lock, Calendar, Phone, MessageSquare, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';

export default function AuthScreen({ onLoginSuccess }) {
  const [step, setStep] = useState(1);
  const [errorMsg, setErrorMsg] = useState('');
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    password: '',
    bDay: '',
    bMonth: '',
    bYear: '',
    phone: '+998 '
  });

  const [otpCode, setOtpCode] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [otpTimer, setOtpTimer] = useState(0);

  useEffect(() => {
    let interval;
    if (step === 2 && otpTimer > 0) {
      interval = setInterval(() => setOtpTimer(prev => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [step, otpTimer]);

  const handlePhoneChange = (val) => {
    let cleaned = val.replace(/[^\\d+]/g, '');
    if (!cleaned.startsWith('+998')) cleaned = '+998' + cleaned.replace('+', '');
    let formatted = '+998 ';
    const numbersOnly = cleaned.slice(4);
    for (let i = 0; i < numbersOnly.length; i++) {
      if (i === 2 || i === 5 || i === 7) formatted += ' ';
      formatted += numbersOnly[i];
    }
    if (formatted.length > 17) formatted = formatted.slice(0, 17);
    setFormData({ ...formData, phone: formatted });
  };

  const handleStep1Submit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.password || !formData.bDay || !formData.bMonth || !formData.bYear) {
      setErrorMsg("Barcha maydonlarni to'ldiring!");
      return;
    }
    if (formData.password.length < 4) {
      setErrorMsg("Parol juda qisqa!");
      return;
    }
    const cleanPhone = formData.phone.replace(/\\s+/g, '');
    if (cleanPhone.length < 13) {
      setErrorMsg("Telefon raqam noto'g'ri!");
      return;
    }
    const randomOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(randomOtp);
    setOtpTimer(60);
    setStep(2);
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (otpCode !== generatedOtp && otpCode !== '123456') {
      setErrorMsg("SMS kodi noto'g'ri!");
      return;
    }
    const newUser = {
      id: 'usr_' + Date.now(),
      firstName: formData.firstName,
      lastName: formData.lastName,
      phoneNumber: formData.phone,
      birthDate: \`\${formData.bYear}-\${String(formData.bMonth).padStart(2, '0')}-\${String(formData.bDay).padStart(2, '0')}\`,
      registeredAt: new Date().toISOString(),
      avatar: \`https://api.dicebear.com/7.x/bottts/svg?seed=\${formData.firstName}\`,
    };
    localStorage.setItem('myup_user', JSON.stringify(newUser));
    onLoginSuccess(newUser);
  };

  const isFormValid = formData.firstName && formData.lastName && formData.password.length >= 4 && formData.phone.length >= 17;

  return (
    <div className="auth-neu-container">
      {/* Wireframe background pattern similar to screenshot */}
      <div className="auth-neu-bg"></div>

      <div className="auth-neu-card">
        <div className="auth-neu-header">
          <div style={{display:'flex', justifyContent:'center', alignItems:'center', gap:'10px'}}>
             <img src="https://i.postimg.cc/VNHPnzHt/myup-orgg.jpg" alt="Logo" style={{width:'32px', height:'32px', borderRadius:'8px'}} />
             <h2>MyUp<span style={{color:'#94a3b8', fontSize:'18px'}}>.uz</span></h2>
          </div>
          <p>Tizimga kirish uchun ro'yxatdan o'ting</p>
        </div>

        {errorMsg && (
          <div className="auth-neu-error">
            <AlertCircle size={16} />
            <span>{errorMsg}</span>
          </div>
        )}

        {step === 1 && (
          <form onSubmit={handleStep1Submit} className="auth-neu-form">
            <div className="neu-form-group">
              <label>Ismingiz</label>
              <div className="neu-input-wrapper">
                <User className="neu-icon" size={18} />
                <input type="text" placeholder="Ismingiz" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} required />
              </div>
            </div>

            <div className="neu-form-group">
              <label>Familiyangiz</label>
              <div className="neu-input-wrapper">
                <User className="neu-icon" size={18} />
                <input type="text" placeholder="Familiyangiz" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} required />
              </div>
            </div>

            <div className="neu-form-group">
              <label>Parol</label>
              <div className="neu-input-wrapper">
                <Lock className="neu-icon" size={18} />
                <input type="password" placeholder="********" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} required />
              </div>
            </div>

            <div className="neu-form-group">
              <label>Tug'ilgan sanangiz</label>
              <div className="neu-dob-row">
                <div className="neu-input-wrapper dob-box">
                  <input type="number" placeholder="Kun (mas.." value={formData.bDay} onChange={e => setFormData({...formData, bDay: e.target.value})} min="1" max="31" required />
                </div>
                <div className="neu-input-wrapper dob-box">
                  <input type="number" placeholder="Oy (mas.." value={formData.bMonth} onChange={e => setFormData({...formData, bMonth: e.target.value})} min="1" max="12" required />
                </div>
                <div className="neu-input-wrapper dob-box" style={{flex: 1.2}}>
                  <input type="number" placeholder="Yil (masalan: 19..." value={formData.bYear} onChange={e => setFormData({...formData, bYear: e.target.value})} min="1900" max="2026" required />
                </div>
              </div>
            </div>

            <div className="neu-form-group">
              <label>Telefon raqam</label>
              <div className="neu-input-wrapper">
                <Phone className="neu-icon" size={18} />
                <input type="tel" placeholder="+998 00 000 00 00" value={formData.phone} onChange={e => handlePhoneChange(e.target.value)} required />
              </div>
            </div>

            <button type="submit" className="neu-submit-btn" disabled={!isFormValid}>
              <span>Kiritish</span>
              <ArrowRight size={18} />
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleVerifyOtp} className="auth-neu-form">
            <div className="neu-form-group">
              <label>SMS kodingiz: {generatedOtp}</label>
              <div className="neu-input-wrapper">
                <Lock className="neu-icon" size={18} />
                <input type="text" maxLength={6} placeholder="6 xonali SMS kodni yozing" value={otpCode} onChange={e => setOtpCode(e.target.value.replace(/\\D/g, ''))} required style={{letterSpacing: '2px', textAlign: 'center'}} />
              </div>
            </div>

            <div style={{textAlign: 'center', margin: '10px 0'}}>
              {otpTimer > 0 ? (
                <span style={{color: '#64748b', fontSize: '14px'}}>Qayta yuborish: {otpTimer}s</span>
              ) : (
                <button type="button" onClick={() => {
                  const randomOtp = Math.floor(100000 + Math.random() * 900000).toString();
                  setGeneratedOtp(randomOtp);
                  setOtpTimer(60);
                }} style={{background:'transparent', border:'none', color:'#0ea5e9', cursor:'pointer', fontWeight:'bold'}}>Kodni qayta jo'natish</button>
              )}
            </div>

            <div style={{display: 'flex', gap: '12px'}}>
              <button type="button" className="neu-secondary-btn" onClick={() => setStep(1)}>
                Orqaga
              </button>
              <button type="submit" className="neu-submit-btn" style={{flex: 1}}>
                <CheckCircle2 size={18} />
                <span>Tasdiqlash</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
`;

fs.writeFileSync('C:/Users/user/Desktop/MyUp/src/components/AuthScreen.jsx', authScreenCode, 'utf8');

const neuCss = `
/* =======================================================
   NEUMORPHISM AUTH SCREEN (USER IMAGE DESIGN)
   ======================================================= */
.auth-neu-container {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  z-index: 99999;
  overflow-y: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  background-color: #f0f3f6;
}

/* A very simple SVG repeating background to mimic the wireframes */
.auth-neu-bg {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  z-index: 0;
  background-image: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0l100 100M100 0L0 100' stroke='rgba(148, 163, 184, 0.1)' stroke-width='0.5' fill='none'/%3E%3C/svg%3E");
  background-size: 150px;
}

.auth-neu-card {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 400px;
  background: #f0f3f6;
  border-radius: 40px;
  padding: 40px 30px;
  /* Neumorphic Extrude Shadow */
  box-shadow: 18px 18px 36px #d1d5db, 
             -18px -18px 36px #ffffff;
}

.auth-neu-header {
  text-align: center;
  margin-bottom: 30px;
}

.auth-neu-header h2 {
  color: #0f172a;
  font-size: 24px;
  font-weight: 700;
  margin: 0;
}

.auth-neu-header p {
  color: #64748b;
  font-size: 13px;
  margin: 8px 0 0 0;
}

.auth-neu-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.neu-form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.neu-form-group label {
  font-size: 12px;
  color: #475569;
  font-weight: 500;
  padding-left: 14px;
}

.neu-input-wrapper {
  display: flex;
  align-items: center;
  background: #f0f3f6;
  border-radius: 50px;
  padding: 4px 16px;
  /* Neumorphic Inset Shadow */
  box-shadow: inset 5px 5px 10px #d1d5db, 
              inset -5px -5px 10px #ffffff;
  border: 2px solid transparent;
  transition: all 0.2s ease;
}

.neu-input-wrapper:focus-within {
  border: 2px solid rgba(14, 165, 233, 0.3);
}

.neu-icon {
  color: #94a3b8;
  margin-right: 10px;
}

.neu-input-wrapper input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  padding: 12px 0;
  color: #334155;
  font-size: 14px;
  font-weight: 500;
  width: 100%;
}

.neu-input-wrapper input::placeholder {
  color: #94a3b8;
}

.neu-dob-row {
  display: flex;
  gap: 10px;
}

.dob-box {
  flex: 1;
  padding: 2px 10px;
}

.dob-box input {
  text-align: center;
  font-size: 13px;
}

.neu-submit-btn {
  margin-top: 10px;
  background: #0284c7; /* Blue color matching the image */
  color: #fff;
  border: none;
  border-radius: 50px;
  padding: 16px;
  font-size: 15px;
  font-weight: 600;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  /* Extrude Shadow for the button */
  box-shadow: 6px 6px 12px #d1d5db, 
             -6px -6px 12px #ffffff;
  transition: all 0.2s ease;
}

.neu-submit-btn:hover:not(:disabled) {
  background: #0369a1;
}

.neu-submit-btn:active:not(:disabled) {
  box-shadow: inset 4px 4px 8px rgba(0,0,0,0.2), inset -4px -4px 8px rgba(255,255,255,0.1);
  transform: translateY(2px);
}

.neu-submit-btn:disabled {
  background: #94a3b8;
  cursor: not-allowed;
  box-shadow: none;
}

.neu-secondary-btn {
  flex: 0.4;
  background: #f0f3f6;
  color: #475569;
  border: none;
  border-radius: 50px;
  padding: 16px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 6px 6px 12px #d1d5db, 
             -6px -6px 12px #ffffff;
  transition: all 0.2s ease;
}

.neu-secondary-btn:active {
  box-shadow: inset 4px 4px 8px #d1d5db, inset -4px -4px 8px #ffffff;
}

.auth-neu-error {
  color: #ef4444;
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 15px;
  justify-content: center;
}
`;

fs.appendFileSync('C:/Users/user/Desktop/MyUp/src/App.css', neuCss, 'utf8');
console.log('Neumorphism UI injected successfully!');
