import React from 'react';
import { UploadCloud } from 'lucide-react';
import './AddProduct.css';

const AddProduct = () => {
  return (
    <div className="add-product-container">
      <div className="card add-product-card">
        <div className="card-header">
          <h2>Yangi Mahsulot Qo'shish</h2>
          <p>O'z mahsulotingizni soting va daromad toping!</p>
        </div>
        
        <form className="add-product-form">
          <div className="form-row">
            <div className="form-group flex-1">
              <label className="form-label">Mahsulot Nomi</label>
              <input type="text" className="form-control" placeholder="Masalan: Qo'lda to'qilgan sharf" required />
            </div>
            <div className="form-group flex-1">
              <label className="form-label">Narxi (UZS)</label>
              <input type="number" className="form-control" placeholder="Masalan: 50000" required />
            </div>
          </div>
          
          <div className="form-group">
            <label className="form-label">Kategoriya</label>
            <select className="form-control" required>
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
            <textarea className="form-control" rows="4" placeholder="Mahsulotingiz haqida batafsil ma'lumot bering..."></textarea>
          </div>
          
          <div className="form-group">
            <label className="form-label">Rasmlar yuklash</label>
            <div className="upload-area">
              <UploadCloud size={48} className="upload-icon" />
              <p>Rasmlarni shu yerga tashlang yoki <span>fayl tanlang</span></p>
              <p className="upload-hint">Maksimal o'lcham: 5MB</p>
            </div>
          </div>
          
          <div className="form-actions">
            <button type="button" className="btn btn-outline">Bekor qilish</button>
            <button type="submit" className="btn btn-primary">Mahsulotni E'lon Qilish</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
