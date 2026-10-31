const fs = require('fs');

// 1. Rewrite AuthScreen.jsx
const authScreenCode = import React, { useState, useEffect } from 'react';
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
      birthDate: \\\\-\-\\\\,
      registeredAt: new Date().toISOString(),
      avatar: \\\https://api.dicebear.com/7.x/bottts/svg?seed=\\\\,
    };
    localStorage.setItem('myup_user', JSON.stringify(newUser));
    onLoginSuccess(newUser);
  };

  const isFormValid = formData.firstName && formData.lastName && formData.password.length >= 4 && formData.phone.length >= 17;

  return (
    <div className="auth-ultra-container">
      {/* Animated Abstract Background */}
      <div className="auth-ultra-bg-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
      </div>

      <div className="auth-ultra-glass-card">
        <div className="auth-ultra-header">
          <div className="auth-ultra-logo-box">
            <img src="https://i.postimg.cc/VNHPnzHt/myup-orgg.jpg" alt="Logo" />
          </div>
          <h2>Xush kelibsiz!</h2>
          <p>Yangi va zamonaviy olamga kirish</p>
        </div>

        {errorMsg && (
          <div className="auth-ultra-error">
            <AlertCircle size={18} />
            <span>{errorMsg}</span>
          </div>
        )}

        {step === 1 && (
          <form onSubmit={handleStep1Submit} className="auth-ultra-form">
            <div className="auth-ultra-input-group staggered-1">
              <User className="ultra-icon" size={20} />
              <input type="text" placeholder="Ismingiz" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} required />
            </div>

            <div className="auth-ultra-input-group staggered-2">
              <User className="ultra-icon" size={20} />
              <input type="text" placeholder="Familiyangiz" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} required />
            </div>

            <div className="auth-ultra-input-group staggered-3">
              <Lock className="ultra-icon" size={20} />
              <input type="password" placeholder="Maxfiy parolingiz" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} required />
            </div>

            <div className="auth-ultra-dob-row staggered-4">
              <div className="auth-ultra-dob-item">
                <input type="number" placeholder="Kun (15)" value={formData.bDay} onChange={e => setFormData({...formData, bDay: e.target.value})} min="1" max="31" required />
              </div>
              <div className="auth-ultra-dob-item">
                <input type="number" placeholder="Oy (08)" value={formData.bMonth} onChange={e => setFormData({...formData, bMonth: e.target.value})} min="1" max="12" required />
              </div>
              <div className="auth-ultra-dob-item">
                <input type="number" placeholder="Yil (95)" value={formData.bYear} onChange={e => setFormData({...formData, bYear: e.target.value})} min="1900" max="2026" required />
              </div>
            </div>

            <div className="auth-ultra-input-group staggered-5">
              <Phone className="ultra-icon" size={20} />
              <input type="tel" placeholder="+998 00 000 00 00" value={formData.phone} onChange={e => handlePhoneChange(e.target.value)} required />
            </div>

            <button type="submit" className="auth-ultra-btn staggered-6" disabled={!isFormValid}>
              <span>Davom etish</span>
              <ArrowRight size={20} />
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleVerifyOtp} className="auth-ultra-form">
            <div className="auth-ultra-input-group staggered-1" style={{background: 'rgba(236, 72, 153, 0.1)', borderColor: 'rgba(236, 72, 153, 0.3)', marginBottom: '10px'}}>
              <MessageSquare className="ultra-icon" style={{color: '#ec4899'}} size={20} />
              <span style={{color: '#fff', fontSize: '14px'}}>Sizning SMS kodingiz: <strong>{generatedOtp}</strong></span>
            </div>

            <div className="auth-ultra-input-group staggered-2">
              <Lock className="ultra-icon" size={20} />
              <input type="text" maxLength={6} placeholder="6 xonali SMS kodni yozing" value={otpCode} onChange={e => setOtpCode(e.target.value.replace(/\\D/g, ''))} required style={{textAlign: 'center', letterSpacing: '4px', fontSize: '18px'}} />
            </div>

            <div className="staggered-3" style={{textAlign: 'center', margin: '10px 0'}}>
              {otpTimer > 0 ? (
                <span style={{color: '#94a3b8', fontSize: '14px'}}>Qayta yuborish: {otpTimer}s</span>
              ) : (
                <button type="button" onClick={() => {
                  const randomOtp = Math.floor(100000 + Math.random() * 900000).toString();
                  setGeneratedOtp(randomOtp);
                  setOtpTimer(60);
                }} style={{background:'transparent', border:'none', color:'#0ea5e9', cursor:'pointer', fontWeight:'bold'}}>Kodni qayta jo'natish</button>
              )}
            </div>

            <div style={{display: 'flex', gap: '12px'}} className="staggered-4">
              <button type="button" className="auth-ultra-btn" style={{flex: 0.4, background: 'rgba(255,255,255,0.1)'}} onClick={() => setStep(1)}>
                Orqaga
              </button>
              <button type="submit" className="auth-ultra-btn" style={{flex: 1}}>
                <CheckCircle2 size={20} />
                <span>Tasdiqlash</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
;

fs.writeFileSync('C:/Users/user/Desktop/MyUp/src/components/AuthScreen.jsx', authScreenCode, 'utf8');

// 2. Append ultra styles to App.css
const ultraCss = 
/* =======================================================
   ULTRA AUTH SCREEN (WORLD NO 1 DESIGN)
   ======================================================= */
.auth-ultra-container {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  z-index: 99999;
  overflow-y: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  background: #0f172a;
}

.auth-ultra-bg-shapes {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  overflow: hidden;
  z-index: 0;
}
.auth-ultra-bg-shapes .shape {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.5;
  animation: floatShape 10s infinite alternate ease-in-out;
}
.auth-ultra-bg-shapes .shape-1 { width: 350px; height: 350px; background: #0ea5e9; top: -50px; left: -100px; }
.auth-ultra-bg-shapes .shape-2 { width: 450px; height: 450px; background: #8b5cf6; bottom: -100px; right: -50px; animation-delay: -3s; }
.auth-ultra-bg-shapes .shape-3 { width: 250px; height: 250px; background: #ec4899; bottom: 30%; left: 10%; animation-delay: -6s; }

@keyframes floatShape {
  0% { transform: translate(0, 0) scale(1); }
  100% { transform: translate(40px, 60px) scale(1.15); }
}

.auth-ultra-glass-card {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 440px;
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(25px);
  -webkit-backdrop-filter: blur(25px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 40px;
  padding: 40px 30px;
  box-shadow: 0 40px 80px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.2);
  animation: slideUpFade 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.auth-ultra-header {
  text-align: center;
  margin-bottom: 35px;
}
.auth-ultra-logo-box {
  width: 80px;
  height: 80px;
  margin: 0 auto 20px;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 15px 35px rgba(14, 165, 233, 0.4);
  animation: pulseLogo 2.5s infinite alternate;
}
.auth-ultra-logo-box img {
  width: 100%; height: 100%; object-fit: cover;
}
@keyframes pulseLogo {
  0% { transform: translateY(0) scale(1); box-shadow: 0 10px 25px rgba(14, 165, 233, 0.3); }
  100% { transform: translateY(-8px) scale(1.05); box-shadow: 0 20px 45px rgba(14, 165, 233, 0.6); }
}

.auth-ultra-header h2 {
  color: #fff;
  font-size: 30px;
  font-weight: 800;
  margin: 0 0 8px 0;
  letter-spacing: -0.5px;
}
.auth-ultra-header p {
  color: rgba(255, 255, 255, 0.6);
  font-size: 15px;
  margin: 0;
}

.auth-ultra-form {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.auth-ultra-input-group {
  position: relative;
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 50px;
  padding: 6px 24px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.auth-ultra-input-group:focus-within {
  background: rgba(255, 255, 255, 0.1);
  border-color: #0ea5e9;
  box-shadow: 0 0 0 4px rgba(14, 165, 233, 0.15);
  transform: translateY(-2px);
}
.auth-ultra-input-group .ultra-icon {
  color: #94a3b8;
  margin-right: 14px;
  transition: color 0.3s ease;
}
.auth-ultra-input-group:focus-within .ultra-icon {
  color: #0ea5e9;
}
.auth-ultra-input-group input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  padding: 14px 0;
  color: #fff;
  font-size: 16px;
  font-weight: 500;
  width: 100%;
}
.auth-ultra-input-group input::placeholder {
  color: rgba(255, 255, 255, 0.3);
}

.auth-ultra-dob-row {
  display: flex;
  gap: 12px;
}
.auth-ultra-dob-item {
  flex: 1;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 50px;
  padding: 6px 10px;
  transition: all 0.3s ease;
}
.auth-ultra-dob-item:focus-within {
  background: rgba(255, 255, 255, 0.1);
  border-color: #0ea5e9;
  box-shadow: 0 0 0 4px rgba(14, 165, 233, 0.15);
  transform: translateY(-2px);
}
.auth-ultra-dob-item input {
  width: 100%;
  background: transparent;
  border: none;
  outline: none;
  padding: 14px 0;
  color: #fff;
  font-size: 15px;
  text-align: center;
}
.auth-ultra-dob-item input::placeholder {
  color: rgba(255, 255, 255, 0.3);
}

.auth-ultra-btn {
  margin-top: 15px;
  background: linear-gradient(135deg, #0ea5e9, #8b5cf6);
  color: #fff;
  border: none;
  border-radius: 50px;
  padding: 18px;
  font-size: 17px;
  font-weight: 700;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  box-shadow: 0 15px 30px rgba(14, 165, 233, 0.4);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}
.auth-ultra-btn:hover:not(:disabled) {
  transform: translateY(-4px) scale(1.02);
  box-shadow: 0 20px 40px rgba(139, 92, 246, 0.5);
}
.auth-ultra-btn:active:not(:disabled) {
  transform: translateY(1px) scale(0.98);
}
.auth-ultra-btn::after {
  content: '';
  position: absolute;
  top: 0; left: -100%; width: 100%; height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
  animation: shineUltra 3s infinite;
}
@keyframes shineUltra {
  0% { left: -100%; }
  20% { left: 200%; }
  100% { left: 200%; }
}
.auth-ultra-btn:disabled {
  background: rgba(255, 255, 255, 0.05);
  color: rgba(255, 255, 255, 0.2);
  box-shadow: none;
  cursor: not-allowed;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.auth-ultra-error {
  background: rgba(239, 68, 68, 0.15);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: #fca5a5;
  padding: 14px 20px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 25px;
  font-size: 15px;
  font-weight: 500;
  animation: shakeUltra 0.6s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
}
@keyframes shakeUltra {
  10%, 90% { transform: translate3d(-2px, 0, 0); }
  20%, 80% { transform: translate3d(4px, 0, 0); }
  30%, 50%, 70% { transform: translate3d(-8px, 0, 0); }
  40%, 60% { transform: translate3d(8px, 0, 0); }
}

/* Staggered Animations */
.staggered-1 { animation: slideInFade 0.6s 0.1s both; }
.staggered-2 { animation: slideInFade 0.6s 0.2s both; }
.staggered-3 { animation: slideInFade 0.6s 0.3s both; }
.staggered-4 { animation: slideInFade 0.6s 0.4s both; }
.staggered-5 { animation: slideInFade 0.6s 0.5s both; }
.staggered-6 { animation: slideInFade 0.6s 0.6s both; }

@keyframes slideInFade {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes slideUpFade {
  from { opacity: 0; transform: translateY(60px) scale(0.9); filter: blur(10px); }
  to { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
}
;

fs.appendFileSync('C:/Users/user/Desktop/MyUp/src/App.css', ultraCss, 'utf8');
console.log('AuthScreen ultra redesign completed!');
