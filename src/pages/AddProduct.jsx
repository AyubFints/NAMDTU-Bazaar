import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadCloud } from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import './AddProduct.css';

const AddProduct = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: '',
    description: '',
    image: null
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("Iltimos, avval tizimga kiring!");
      return;
    }
    try {
      await api.post('/products', {
        name: formData.name,
        price: formData.price,
        category: formData.category,
        description: formData.description,
        images: formData.image ? [formData.image] : [],
        stock: '10' // Default stock for now
      });
      if (user.role === 'admin') {
        alert("Mahsulot muvaffaqiyatli qo'shildi va darhol sotuvga chiqdi!");
      } else {
        alert("Mahsulot muvaffaqiyatli qo'shildi! Admin tasdiqlashi kutilmoqda.");
      }
      navigate('/');
    } catch (error) {
      console.error(error);
      alert("Xatolik yuz berdi: " + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className="add-product-container">
      <div className="card add-product-card">
        <div className="card-header">
          <h2>Yangi Mahsulot Qo'shish</h2>
          <p>O'z mahsulotingizni soting va daromad toping!</p>
        </div>
        
        <form className="add-product-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group flex-1">
              <label className="form-label">Mahsulot Nomi</label>
              <input type="text" name="name" className="form-control" placeholder="Masalan: Qo'lda to'qilgan sharf" required value={formData.name} onChange={handleChange} />
            </div>
            <div className="form-group flex-1">
              <label className="form-label">Narxi (UZS)</label>
              <input type="number" name="price" className="form-control" placeholder="Masalan: 50000" required value={formData.price} onChange={handleChange} />
            </div>
          </div>
          
          <div className="form-group">
            <label className="form-label">Kategoriya</label>
            <select name="category" className="form-control" required value={formData.category} onChange={handleChange}>
              <option value="">Tanlang...</option>
              <option value="kiyim">Kiyim-kechak</option>
              <option value="hunar">Hunarmandchilik</option>
              <option value="sanat">San'at asari (Rasm, Haykal)</option>
              <option value="aksessuar">Aksessuarlar</option>
              <option value="boshqa">Boshqa</option>
            </select>
          </div>
          
          <div className="form-group">
            <label className="form-label">Mahsulot Ta'rifi</label>
            <textarea name="description" className="form-control" rows="4" placeholder="Mahsulotingiz haqida batafsil ma'lumot bering..." value={formData.description} onChange={handleChange}></textarea>
          </div>
          
          <div className="form-group">
            <label className="form-label">Rasm yuklash</label>
            <div className="upload-area" style={{ position: 'relative' }}>
              <input type="file" accept="image/*" onChange={handleImageChange} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }} />
              {formData.image ? (
                <img src={formData.image} alt="Preview" style={{ height: '100px', objectFit: 'contain' }} />
              ) : (
                <>
                  <UploadCloud size={48} className="upload-icon" />
                  <p>Rasmlarni shu yerga tashlang yoki <span>fayl tanlang</span></p>
                  <p className="upload-hint">Maksimal o'lcham: 5MB</p>
                </>
              )}
            </div>
          </div>
          
          <div className="form-actions">
            <button type="button" className="btn btn-outline" onClick={() => navigate(-1)}>Bekor qilish</button>
            <button type="submit" className="btn btn-primary">Mahsulotni E'lon Qilish</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
