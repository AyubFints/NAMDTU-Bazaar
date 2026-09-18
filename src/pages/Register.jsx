import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const Register = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const { register } = useAuth();
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    let role = 'user';
    if (name === 'Admin' && phone === '91 000 00 00' && password === 'Admin001') {
      role = 'admin';
    }
    
    const result = await register(name, phone, password, role);
    if (result.success) {
      navigate(role === 'admin' ? '/admin' : '/');
    } else {
      alert(result.message);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card card">
        <div className="auth-header">
          <h2>Ro'yxatdan o'tish</h2>
          <p>Yangi akkaunt yarating</p>
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
              placeholder="Parol o'ylab toping" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>
          
          <button type="submit" className="btn btn-primary auth-btn">Ro'yxatdan o'tish</button>
        </form>
        
        <div className="auth-footer">
          Akkauntingiz bormi? <Link to="/login">Tizimga kirish</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
