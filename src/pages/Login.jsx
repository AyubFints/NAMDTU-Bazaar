import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const Login = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handlePhoneChange = (e) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 9) val = val.substring(0, 9);
    
    let formatted = '';
    if (val.length > 0) formatted += val.substring(0, 2);
    if (val.length > 2) formatted += ' ' + val.substring(2, 5);
    if (val.length > 5) formatted += ' ' + val.substring(5, 7);
    if (val.length > 7) formatted += ' ' + val.substring(7, 9);
    
    setPhone(formatted);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name === 'Admin' && phone === '91 000 00 00' && password === 'Admin001') {
      login({ name: 'Admin', role: 'admin', phone });
      navigate('/admin');
    } else {
      // Mock successful login for normal user until backend is ready
      login({ name: name || 'Foydalanuvchi', role: 'user', phone });
      navigate('/');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card card">
        <div className="auth-header">
          <h2>Tizimga kirish</h2>
          <p>O'z profilingizga kiring</p>
        </div>
        
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Ism</label>
            <input 
              type="text" 
              className="form-control" 
              placeholder="Ismingizni kiriting" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              required 
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Telefon raqam</label>
            <input 
              type="text" 
              className="form-control" 
              placeholder="Masalan: 91 234 56 78" 
              value={phone}
              onChange={handlePhoneChange}
              required 
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Parol</label>
            <input 
              type="password" 
              className="form-control" 
              placeholder="Parolingizni kiriting" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>
          
          <div className="auth-options">
            <label className="remember-me">
              <input type="checkbox" /> Eslab qolish
            </label>
            <a href="#" className="forgot-password">Parolni unutdingizmi?</a>
          </div>
          
          <button type="submit" className="btn btn-primary auth-btn">Tizimga kirish</button>
        </form>
        
        <div className="auth-footer">
          Akkauntingiz yo'qmi? <Link to="/register">Ro'yxatdan o'tish</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
