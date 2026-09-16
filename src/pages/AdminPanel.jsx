import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogOut, Package, FolderPlus, ShoppingBag, Plus, Trash2, Image, Save, X, Edit2 } from 'lucide-react';
import './AdminPanel.css';

const HERO_SLIDES = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&auto=format&fit=crop&q=80",
    title: "Aziz Talabalar, Xush Kelibsiz!",
    subtitle: "O'z qo'l mehnatingiz bilan yaratgan mahsulotlarni soting va tengdoshlaringizning ajoyib ishlarini xarid qiling."
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1511130558090-00af810c2111?w=1200&auto=format&fit=crop&q=80",
    title: "Kuzgi kiyimlar to'plami",
    subtitle: "Kuz fasli uchun issiq va zamonaviy kiyimlar"
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=1200&auto=format&fit=crop&q=80",
    title: "Onalar va bolalar uchun",
    subtitle: "Eng sifatli va qulay mahsulotlar"
  }
];

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('products');
  const { logout } = useAuth();
  const navigate = useNavigate();

  // Categories state
  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem('categories');
    return saved ? JSON.parse(saved) : ['Trendli kiyimlar', 'Onalar va bolalar', "Qo'l ishlari"];
  });
  const [newCategory, setNewCategory] = useState('');

  // Product form state
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productCategory, setProductCategory] = useState('');
  const [productImages, setProductImages] = useState([]);
  const [productImagePreviews, setProductImagePreviews] = useState([]);
  const [productDescription, setProductDescription] = useState('');
  const [productOldPrice, setProductOldPrice] = useState('');
  const [productBadge, setProductBadge] = useState('');
  const [productBrand, setProductBrand] = useState('');
  const [productStock, setProductStock] = useState('');
  const [productSizes, setProductSizes] = useState([]); // [{size: 'M', stock: 10}]
  const [editingProductId, setEditingProductId] = useState(null);

  // Products list
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('products');
    return saved ? JSON.parse(saved) : [];
  });

  // Notifications
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('notifications');
    return saved ? JSON.parse(saved) : [];
  });

  // Orders list
  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('orders');
    return saved ? JSON.parse(saved) : [];
  });
  const newOrdersCount = orders.filter(o => o.status === 'Yangi').length;

  // Banners list
  const [banners, setBanners] = useState(() => {
    const saved = localStorage.getItem('hero_banners');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.length > 0) return parsed;
    }
    return HERO_SLIDES;
  });
  const [newBannerImage, setNewBannerImage] = useState('');
  const [newBannerTitle, setNewBannerTitle] = useState('');
  const [newBannerSubtitle, setNewBannerSubtitle] = useState('');
  const [editingBannerId, setEditingBannerId] = useState(null);
  const [bannerToDelete, setBannerToDelete] = useState(null);

  // Success message
  const [successMsg, setSuccessMsg] = useState('');

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('hero_banners', JSON.stringify(banners));
  }, [banners]);

  useEffect(() => {
    localStorage.setItem('notifications', JSON.stringify(notifications));
  }, [notifications]);

  const handleLogout = () => {
    logout();
    navigate('/register');
  };

  // Image handler
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    if (productImages.length + files.length > 5) {
      alert("Siz ko'pi bilan 5 ta rasm yuklashingiz mumkin!");
      return;
    }

    setProductImages(prev => [...prev, ...files]);

    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProductImagePreviews(prev => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveImage = (index) => {
    setProductImages(prev => prev.filter((_, i) => i !== index));
    setProductImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  // Add or Update product
  const handleAddProduct = (e) => {
    e.preventDefault();
    if (!productName || !productPrice || !productCategory) return;

    if (editingProductId) {
      const updatedProducts = products.map(p => {
        if (p.id === editingProductId) {
          return {
            ...p,
            name: productName,
            price: productPrice,
            category: productCategory,
            images: productImagePreviews.length > 0 ? productImagePreviews : (p.images || (p.image ? [p.image] : [])),
            description: productDescription,
            oldPrice: productOldPrice,
            badge: productBadge,
            brand: productBrand,
            stock: productStock,
            sizes: productSizes,
          };
        }
        return p;
      });
      setProducts(updatedProducts);
      setEditingProductId(null);
      showSuccess('Mahsulot muvaffaqiyatli o\'zgartirildi!');
    } else {
      const newProduct = {
        id: Date.now(),
        name: productName,
        price: productPrice,
        category: productCategory,
        images: productImagePreviews.length > 0 ? productImagePreviews : [],
        description: productDescription,
        oldPrice: productOldPrice,
        badge: productBadge,
        brand: productBrand,
        stock: productStock,
        sizes: productSizes,
        createdAt: new Date().toLocaleDateString('uz-UZ'),
      };
      setProducts([newProduct, ...products]);
      showSuccess('Mahsulot muvaffaqiyatli qo\'shildi!');
    }

    setProductName('');
    setProductPrice('');
    setProductCategory('');
    setProductImages([]);
    setProductImagePreviews([]);
    setProductDescription('');
    setProductOldPrice('');
    setProductBadge('');
    setProductBrand('');
    setProductStock('');
    setProductSizes([]);
  };

  const handleEditProduct = (product) => {
    setEditingProductId(product.id);
    setProductName(product.name);
    setProductPrice(product.price);
    setProductCategory(product.category);
    setProductDescription(product.description || '');
    setProductImagePreviews(product.images || (product.image ? [product.image] : []));
    setProductOldPrice(product.oldPrice || '');
    setProductBadge(product.badge || '');
    setProductBrand(product.brand || '');
    setProductStock(product.stock || '');
    setProductSizes(product.sizes || []);
    setActiveTab('products');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Add category
  const handleAddCategory = (e) => {
    e.preventDefault();
    if (!newCategory.trim()) return;
    if (categories.includes(newCategory.trim())) {
      showSuccess('Bu bo\'lim allaqachon mavjud!');
      return;
    }
    setCategories([...categories, newCategory.trim()]);
    setNewCategory('');
    showSuccess('Yangi bo\'lim yaratildi!');
  };

  // Delete product
  const handleDeleteProduct = (id) => {
    setProducts(products.filter(p => p.id !== id));
    showSuccess('Mahsulot o\'chirildi!');
  };

  // Product Approval Workflow
  const handleApproveProduct = (id) => {
    const product = products.find(p => p.id === id);
    if (!product) return;
    
    setProducts(products.map(p => p.id === id ? { ...p, status: 'approved' } : p));
    
    const newNote = {
      id: Date.now(),
      phone: product.creatorPhone,
      message: `Tabriklaymiz! "${product.name}" mahsulotingiz tasdiqlandi va bo'zorga chiqarildi.`,
      type: 'approved',
      date: new Date().toLocaleDateString('uz-UZ')
    };
    setNotifications([...notifications, newNote]);
    showSuccess('Mahsulot tasdiqlandi!');
  };

  const handleRejectProduct = (id) => {
    const product = products.find(p => p.id === id);
    if (!product) return;
    
    setProducts(products.filter(p => p.id !== id));
    
    const newNote = {
      id: Date.now(),
      phone: product.creatorPhone,
      message: `Afsuski, "${product.name}" mahsulotingiz talablarga javob bermagani uchun rad etildi.`,
      type: 'rejected',
      date: new Date().toLocaleDateString('uz-UZ')
    };
    setNotifications([...notifications, newNote]);
    showSuccess('Mahsulot rad etildi va o\'chirildi.');
  };

  // Delete category
  const handleDeleteCategory = (cat) => {
    setCategories(categories.filter(c => c !== cat));
    showSuccess('Bo\'lim o\'chirildi!');
  };

  const showSuccess = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleMarkAsSold = (orderId) => {
    // Find order
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    // Deduct stock for each item in the order
    let updatedProducts = [...products];

    order.items.forEach(orderItem => {
      // Assuming orderItem has: originalId (for product), size (if any), quantity
      updatedProducts = updatedProducts.map(prod => {
        if (prod.id === orderItem.originalId) {
          let p = { ...prod };
          if (p.sizes && p.sizes.length > 0 && orderItem.size) {
            p.sizes = p.sizes.map(sz => {
              if (sz.size === orderItem.size) {
                return { ...sz, stock: Math.max(0, parseInt(sz.stock, 10) - orderItem.quantity) };
              }
              return sz;
            });
          } else if (p.stock) {
            p.stock = Math.max(0, parseInt(p.stock, 10) - orderItem.quantity);
          }
          return p;
        }
        return prod;
      });
    });

    setProducts(updatedProducts);

    // Update order status to sold
    setOrders(orders.map(o => o.id === orderId ? { ...o, status: 'Sotildi' } : o));
    showSuccess("Sotildi! Mahsulotlar ombordan ayirildi.");
  };

  const handleDeleteOrder = (orderId) => {
    setOrders(orders.filter(o => o.id !== orderId));
    showSuccess("Buyurtma o'chirildi!");
  };

  const handleBannerImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewBannerImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddBanner = (e) => {
    e.preventDefault();
    if (!newBannerImage.trim()) {
      showSuccess("Iltimos, banner rasmini kiriting!");
      return;
    }

    if (editingBannerId) {
      setBanners(banners.map(b => b.id === editingBannerId ? {
        ...b,
        image: newBannerImage,
        title: newBannerTitle,
        subtitle: newBannerSubtitle
      } : b));
      showSuccess("Banner yangilandi!");
      setEditingBannerId(null);
    } else {
      const newBanner = {
        id: Date.now(),
        image: newBannerImage,
        title: newBannerTitle,
        subtitle: newBannerSubtitle
      };
      setBanners([...banners, newBanner]);
      showSuccess("Yangi banner qo'shildi!");
    }

    setNewBannerImage('');
    setNewBannerTitle('');
    setNewBannerSubtitle('');
  };

  const handleEditBannerClick = (banner) => {
    setEditingBannerId(banner.id);
    setNewBannerImage(banner.image);
    setNewBannerTitle(banner.title);
    setNewBannerSubtitle(banner.subtitle);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelBannerEdit = () => {
    setEditingBannerId(null);
    setNewBannerImage('');
    setNewBannerTitle('');
    setNewBannerSubtitle('');
  };

  const confirmDeleteBanner = () => {
    if (bannerToDelete) {
      setBanners(banners.filter(b => b.id !== bannerToDelete));
      setBannerToDelete(null);
      showSuccess("Banner o'chirildi!");
    }
  };


  // Price formatter
  const handlePriceChange = (e) => {
    let val = e.target.value.replace(/\D/g, '');
    setProductPrice(val);
  };

  const formatPrice = (price) => {
    return Number(price).toLocaleString('uz-UZ') + ' so\'m';
  };

  return (
    <div className="admin-panel">
      {/* Banner delete modal */}
      {bannerToDelete && (
        <div className="admin-modal-overlay">
          <div className="admin-modal">
            <h3>Bannerni o'chirish</h3>
            <p>Siz rostdan ham bu bannerni o'chiravermoqchimisiz?</p>
            <div className="admin-modal-actions">
              <button className="admin-btn-cancel" onClick={() => setBannerToDelete(null)}>Yo'q, bekor qilish</button>
              <button className="admin-btn-danger" onClick={confirmDeleteBanner}>Ha, o'chirish</button>
            </div>
          </div>
        </div>
      )}

      {/* Success toast */}
      {successMsg && (
        <div className="admin-toast">
          <span>✅ {successMsg}</span>
          <button onClick={() => setSuccessMsg('')}><X size={16} /></button>
        </div>
      )}

      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <div className="admin-logo">
            <h2>NAMDTU Bazaar</h2>
          </div>
          <button className="admin-logout-btn" onClick={handleLogout} title="Chiqish">
            <LogOut size={18} />
          </button>
        </div>

        <nav className="admin-nav">
          <button
            className={`admin-nav-item ${activeTab === 'products' ? 'active' : ''}`}
            onClick={() => setActiveTab('products')}
          >
            <Package size={20} />
            <span>Mahsulotlar</span>
          </button>
          <button
            className={`admin-nav-item ${activeTab === 'categories' ? 'active' : ''}`}
            onClick={() => setActiveTab('categories')}
          >
            <FolderPlus size={20} />
            <span>Bo'limlar</span>
          </button>
          <button
            className={`admin-nav-item ${activeTab === 'banners' ? 'active' : ''}`}
            onClick={() => setActiveTab('banners')}
          >
            <Image size={20} />
            <span>Bannerlar</span>
          </button>
          <button
            className={`admin-nav-item ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            <div style={{ position: 'relative', display: 'flex' }}>
              <ShoppingBag size={20} />
              {newOrdersCount > 0 && (
                <span className="admin-nav-badge">{newOrdersCount}</span>
              )}
            </div>
            <span>Buyurtmalar</span>
          </button>
          <button
            className={`admin-nav-item ${activeTab === 'pending' ? 'active' : ''}`}
            onClick={() => setActiveTab('pending')}
          >
            <div style={{position: 'relative', display: 'flex'}}>
              <Package size={20} />
              {products.filter(p => p.status === 'pending').length > 0 && (
                <span className="admin-nav-badge">{products.filter(p => p.status === 'pending').length}</span>
              )}
            </div>
            <span>Kutayotganlar</span>
          </button>
        </nav>

      </aside>

      {/* Main content */}
      <main className="admin-main">
        {/* ===== PRODUCTS TAB ===== */}
        {activeTab === 'products' && (
          <div className="admin-tab-content">
            <div className="admin-page-header">
              <h1>{editingProductId ? "Mahsulotni tahrirlash" : "Yangi mahsulot qo'shish"}</h1>
              <p>{editingProductId ? "Mahsulot ma'lumotlarini o'zgartiring va saqlang" : "Mahsulot ma'lumotlarini to'ldiring va saqlang"}</p>
            </div>

            <form className="admin-product-form" onSubmit={handleAddProduct}>
              <div className="admin-form-grid">
                {/* Left column */}
                <div className="admin-form-left">
                  <div className="admin-field">
                    <label>Mahsulot nomi</label>
                    <input
                      type="text"
                      placeholder="Masalan: Qishki kurtka"
                      value={productName}
                      onChange={(e) => setProductName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="admin-field">
                    <label>Narxi (so'm)</label>
                    <input
                      type="text"
                      placeholder="Masalan: 150000"
                      value={productPrice}
                      onChange={handlePriceChange}
                      required
                    />
                    {productPrice && (
                      <span className="admin-price-preview">{formatPrice(productPrice)}</span>
                    )}
                  </div>

                  <div className="admin-field">
                    <label>Bo'limni tanlang</label>
                    <select
                      value={productCategory}
                      onChange={(e) => setProductCategory(e.target.value)}
                      required
                    >
                      <option value="">-- Tanlang --</option>
                      {categories.map((cat, i) => (
                        <option key={i} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div className="admin-field">
                    <label>Brend / Sotuvchi (ixtiyoriy)</label>
                    <input
                      type="text"
                      placeholder="Masalan: Axma, Apple..."
                      value={productBrand}
                      onChange={(e) => setProductBrand(e.target.value)}
                    />
                  </div>

                  <div className="admin-field" style={{ display: 'flex', gap: '16px' }}>
                    <div style={{ flex: 1 }}>
                      <label>Eski narx (ixtiyoriy)</label>
                      <input
                        type="text"
                        placeholder="Masalan: 200000"
                        value={productOldPrice}
                        onChange={(e) => setProductOldPrice(e.target.value.replace(/\D/g, ''))}
                      />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label>Ombordagi soni</label>
                      <input
                        type="number"
                        placeholder="Masalan: 100"
                        value={productStock}
                        onChange={(e) => setProductStock(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="admin-field">
                    <label>Maxsus Yorliq (Badge)</label>
                    <select
                      value={productBadge}
                      onChange={(e) => setProductBadge(e.target.value)}
                    >
                      <option value="">-- Yorliqsiz --</option>
                      <option value="YANGI">Yangi</option>
                      <option value="ARZON NARX KAFOLATI">Arzon narx kafolati</option>
                      <option value="KO'P SOTILGAN">Ko'p sotilgan</option>
                      <option value="CHEGIRMA">Chegirma</option>
                    </select>
                  </div>

                  <div className="admin-field">
                    <label>Tavsif (ixtiyoriy)</label>
                    <textarea
                      placeholder="Mahsulot haqida qisqacha yozing..."
                      value={productDescription}
                      onChange={(e) => setProductDescription(e.target.value)}
                      rows={3}
                    />
                  </div>

                  <div className="admin-field">
                    <label>Razmerlar va ularning zaxirasi (ixtiyoriy)</label>
                    <div className="admin-sizes-list">
                      {productSizes.map((sz, idx) => (
                        <div key={idx} className="admin-size-item">
                          <span>{sz.size} - {sz.stock} ta</span>
                          <button type="button" onClick={() => {
                            setProductSizes(productSizes.filter((_, i) => i !== idx));
                          }}><X size={14} /></button>
                        </div>
                      ))}
                    </div>
                    <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                      <input
                        type="text"
                        id="new-size-name"
                        placeholder="Razmer (M, 42, va hokazo)"
                        style={{ flex: 1 }}
                      />
                      <input
                        type="number"
                        id="new-size-stock"
                        placeholder="Soni"
                        style={{ width: '80px' }}
                      />
                      <button
                        type="button"
                        className="btn"
                        style={{ padding: '0 12px' }}
                        onClick={() => {
                          const name = document.getElementById('new-size-name').value.trim();
                          const stock = parseInt(document.getElementById('new-size-stock').value, 10);
                          if (name && stock > 0) {
                            setProductSizes([...productSizes, { size: name, stock }]);
                            document.getElementById('new-size-name').value = '';
                            document.getElementById('new-size-stock').value = '';
                          }
                        }}
                      >
                        Qo'shish
                      </button>
                    </div>
                    <p style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                      * Agar razmerlar kiritsangiz, yuqoridagi "Ombordagi soni" inobatga olinmaydi. Zaxira razmerlarga qarab hisoblanadi.
                    </p>
                  </div>
                </div>

                {/* Right column - image */}
                <div className="admin-form-right">
                  <div className="admin-field">
                    <label>Rasm yuklash (Maksimum 5 ta)</label>

                    {productImagePreviews.length > 0 && (
                      <div className="admin-image-previews-container">
                        {productImagePreviews.map((src, index) => (
                          <div key={index} className="admin-image-preview-item">
                            <img src={src} alt="Preview" />
                            <button type="button" className="admin-remove-img-btn" onClick={(e) => { e.stopPropagation(); handleRemoveImage(index); }}>
                              <X size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {productImagePreviews.length < 5 && (
                      <div className="admin-image-upload" onClick={() => document.getElementById('product-img-input').click()} style={{ height: productImagePreviews.length > 0 ? '100px' : '240px' }}>
                        <div className="admin-image-placeholder">
                          <Image size={productImagePreviews.length > 0 ? 24 : 48} />
                          <span>{productImagePreviews.length > 0 ? "Yana rasm qo'shish" : "Rasm tanlash uchun bosing"}</span>
                        </div>
                        <input
                          id="product-img-input"
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleImageChange}
                          style={{ display: 'none' }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <button type="submit" className="admin-save-btn">
                <Save size={20} />
                <span>{editingProductId ? "O'zgartirishni saqlash" : "Saqlash"}</span>
              </button>
              {editingProductId && (
                <button
                  type="button"
                  className="admin-save-btn"
                  style={{ background: 'rgba(255,255,255,0.1)', marginLeft: '12px', border: '1px solid #e2e8f0', color: '#475569', boxShadow: 'none' }}
                  onClick={() => {
                    setEditingProductId(null);
                    setProductName('');
                    setProductPrice('');
                    setProductCategory('');
                    setProductImages([]);
                    setProductImagePreviews([]);
                    setProductDescription('');
                    setProductOldPrice('');
                    setProductBadge('');
                    setProductBrand('');
                    setProductStock('');
                  }}
                >
                  <X size={20} />
                  <span>Bekor qilish</span>
                </button>
              )}
            </form>

            {/* Products list */}
            {products.filter(p => p.status !== 'pending').length > 0 && (
              <div className="admin-products-list">
                <h3>Qo'shilgan mahsulotlar ({products.filter(p => p.status !== 'pending').length})</h3>
                <div className="admin-products-grid">
                  {products.filter(p => p.status !== 'pending').map((p) => (
                    <div key={p.id} className="admin-product-card">
                      {(p.images && p.images.length > 0) ? (
                        <img src={p.images[0]} alt={p.name} className="admin-product-img" />
                      ) : (p.image ? (
                        <img src={p.image} alt={p.name} className="admin-product-img" />
                      ) : (
                        <div className="admin-product-no-img"><Image size={32} /></div>
                      ))}
                      <div className="admin-product-info">
                        <h4>{p.name}</h4>
                        <span className="admin-product-price">{formatPrice(p.price)}</span>
                        <span className="admin-product-cat">{p.category}</span>
                      </div>
                      <div className="admin-product-actions">
                        <button className="admin-edit-btn" onClick={() => handleEditProduct(p)} title="Tahrirlash">
                          <Edit2 size={16} />
                        </button>
                        <button className="admin-delete-btn" onClick={() => handleDeleteProduct(p.id)} title="O'chirish">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ===== PENDING PRODUCTS TAB ===== */}
        {activeTab === 'pending' && (
          <div className="admin-tab-content">
            <div className="admin-page-header">
              <h1>Tasdiq Kutayotgan Mahsulotlar</h1>
              <p>Foydalanuvchilar tomonidan qo'shilgan, tasdiq kutayotgan mahsulotlar ro'yxati</p>
            </div>
            <div className="admin-products-list">
              {products.filter(p => p.status === 'pending').length === 0 ? (
                <p className="admin-empty-text">Hozircha tasdiq kutayotgan mahsulotlar yo'q.</p>
              ) : (
                <div className="admin-products-grid">
                  {products.filter(p => p.status === 'pending').map(product => (
                    <div key={product.id} className="admin-product-card">
                      <div className="admin-product-img-wrap">
                        {product.images && product.images.length > 0 ? (
                          <img src={product.images[0]} alt={product.name} />
                        ) : (
                          <img src={product.image} alt={product.name} />
                        )}
                        <span className="admin-product-badge pending">Kutmoqda</span>
                      </div>
                      <div className="admin-product-info">
                        <h4>{product.name}</h4>
                        <div className="admin-product-category">{product.category}</div>
                        <div className="admin-product-price">
                          <strong>{formatPrice(product.price)}</strong>
                        </div>
                        <p style={{fontSize: '12px', color: '#64748b', marginTop: '5px'}}>
                          <strong>Foydalanuvchi:</strong> {product.creatorName} ({product.creatorPhone})
                        </p>
                        
                        <div className="admin-product-actions" style={{display: 'flex', gap: '8px', marginTop: '15px'}}>
                          <button className="admin-save-btn" style={{flex: 1, padding: '8px', fontSize: '13px'}} onClick={() => handleApproveProduct(product.id)}>
                            Tasdiqlash
                          </button>
                          <button className="admin-delete-btn" style={{flex: 1, padding: '8px', fontSize: '13px'}} onClick={() => handleRejectProduct(product.id)}>
                            Rad etish
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ===== CATEGORIES TAB ===== */}
        {activeTab === 'categories' && (
          <div className="admin-tab-content">
            <div className="admin-page-header">
              <h1>Bo'limlar boshqaruvi</h1>
              <p>Yangi bo'lim yarating yoki mavjudlarini o'chiring</p>
            </div>

            <form className="admin-category-form" onSubmit={handleAddCategory}>
              <div className="admin-field" style={{ flex: 1 }}>
                <input
                  type="text"
                  placeholder="Yangi bo'lim nomi (Masalan: Kuzgi kiyimlar)"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="admin-add-cat-btn">
                <Plus size={20} />
                <span>Qo'shish</span>
              </button>
            </form>

            <div className="admin-categories-list">
              {categories.map((cat, i) => (
                <div key={i} className="admin-category-item">
                  <div className="admin-cat-info">
                    <FolderPlus size={20} />
                    <span>{cat}</span>
                  </div>
                  <button className="admin-delete-btn" onClick={() => handleDeleteCategory(cat)}>
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===== ORDERS TAB ===== */}
        {activeTab === 'orders' && (
          <div className="admin-tab-content">
            <div className="admin-page-header">
              <h1>Buyurtmalar</h1>
              <p>Kelib tushgan buyurtmalarni ko'ring</p>
            </div>

            {orders.length === 0 ? (
              <div className="admin-empty-state">
                <ShoppingBag size={64} />
                <h3>Hozircha yangi buyurtmalar yo'q</h3>
                <p>Yangi buyurtmalar kelganda bu yerda ko'rinadi</p>
              </div>
            ) : (
              <div className="admin-orders-list">
                {orders.map(order => (
                  <div key={order.id} className={`admin-order-card ${order.status === 'Yangi' ? 'new-order' : ''}`}>
                    <div className="admin-order-header">
                      <div>
                        <h3>Buyurtma #{order.id}</h3>
                        <span className="admin-order-date">{new Date(order.date).toLocaleString('uz-UZ')}</span>
                      </div>
                      <div className={`admin-order-status ${order.status === 'Yangi' ? 'status-new' : 'status-sold'}`}>
                        {order.status}
                      </div>
                    </div>

                    <div className="admin-order-customer">
                      <strong>Telefon:</strong> <span>{order.phone}</span>
                    </div>

                    <div className="admin-order-items">
                      <h4>Mahsulotlar:</h4>
                      {order.items.map((item, idx) => (
                        <div key={idx} className="admin-order-item">
                          <img src={item.images?.[0] || item.image || "https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=500&auto=format&fit=crop&q=60"} alt={item.name} />
                          <div className="admin-order-item-info">
                            <div><strong>{item.name}</strong></div>
                            {item.size && <div>Razmer: {item.size}</div>}
                            <div>Miqdor: {item.quantity} ta</div>
                            <div>Narx: {formatPrice(item.price)}</div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="admin-order-footer">
                      <div className="admin-order-total">
                        <strong>Jami:</strong> {formatPrice(order.total)}
                      </div>
                      <div className="admin-order-actions">
                        <button className="admin-delete-btn" onClick={() => handleDeleteOrder(order.id)}>
                          <Trash2 size={18} />
                        </button>
                        {order.status === 'Yangi' && (
                          <button className="admin-save-btn" onClick={() => handleMarkAsSold(order.id)} style={{ width: 'auto', padding: '10px 20px' }}>
                            Sotildi deb belgilash
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ===== BANNERS TAB ===== */}
        {activeTab === 'banners' && (
          <div className="admin-tab-content">
            <div className="admin-page-header">
              <h1>Asosiy Sahifa Bannerlari</h1>
              <p>Ilova bosh sahifasidagi katta aylanadigan rasmlarni boshqarish</p>
            </div>

            <form className="admin-form" onSubmit={handleAddBanner}>
              <h3>{editingBannerId ? 'Bannerni Tahrirlash' : 'Yangi Banner Qo\'shish'}</h3>

              <div className="admin-field">
                <label>Banner rasmi (Fayl yuklash yoki URL) *</label>
                <div className="admin-file-upload">
                  <label htmlFor="banner-upload" className="admin-upload-label">
                    <Image size={24} />
                    <span>Galereyadan rasm tanlash</span>
                  </label>
                  <input
                    id="banner-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleBannerImageUpload}
                    style={{ display: 'none' }}
                  />
                </div>
                <div style={{ textAlign: 'center', marginBottom: '10px', fontSize: '14px', color: '#64748b' }}>YOKI</div>
                <input
                  type="text"
                  placeholder="Rasm internet havolasi (URL)..."
                  value={newBannerImage}
                  onChange={(e) => setNewBannerImage(e.target.value)}
                />
                {newBannerImage && (
                  <div className="admin-banner-preview">
                    <img src={newBannerImage} alt="Preview" style={{ objectFit: 'contain', width: '100%', maxHeight: '200px' }} />
                  </div>
                )}
              </div>

              <div className="admin-field">
                <label>Sarlavha (Title - ixtiyoriy)</label>
                <input
                  type="text"
                  placeholder="Banner sarlavhasi..."
                  value={newBannerTitle}
                  onChange={(e) => setNewBannerTitle(e.target.value)}
                />
              </div>

              <div className="admin-field">
                <label>Qisqacha matn (Subtitle - ixtiyoriy)</label>
                <input
                  type="text"
                  placeholder="Banner haqida qisqacha..."
                  value={newBannerSubtitle}
                  onChange={(e) => setNewBannerSubtitle(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" className="admin-save-btn" style={{ width: 'auto' }}>
                  {editingBannerId ? <Save size={20} /> : <Plus size={20} />}
                  <span>{editingBannerId ? 'Saqlash' : 'Qo\'shish'}</span>
                </button>
                {editingBannerId && (
                  <button type="button" className="admin-delete-btn" style={{ width: 'auto', background: '#e2e8f0', color: '#1a1a2e' }} onClick={cancelBannerEdit}>
                    <span>Bekor qilish</span>
                  </button>
                )}
              </div>
            </form>

            <div className="admin-banners-list">
              <h3>Mavjud Bannerlar ({banners.length} ta)</h3>
              {banners.length === 0 ? (
                <p className="admin-empty-text">Hozircha bannerlar yo'q. Standart bannerlar ko'rsatilmoqda.</p>
              ) : (
                <div className="admin-banners-grid">
                  {banners.map(banner => (
                    <div key={banner.id} className="admin-banner-card">
                      <div className="admin-banner-img-wrap">
                        <img src={banner.image} alt={banner.title} />
                      </div>
                      <div className="admin-banner-info">
                        <h4>{banner.title || 'Sarlavhasiz'}</h4>
                        <p>{banner.subtitle}</p>
                        <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                          <button className="admin-edit-btn" style={{ flex: 1, padding: '8px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => handleEditBannerClick(banner)} title="Tahrirlash">
                            <Edit2 size={16} color="#7c3aed" />
                          </button>
                          <button className="admin-delete-btn" style={{ flex: 1 }} onClick={() => setBannerToDelete(banner.id)} title="O'chirish">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminPanel;
