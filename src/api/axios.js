import axios from 'axios';

const api = axios.create({
  // Render.com'dagi haqiqiy backend manzili (kompyuter o'chiq bo'lsa ham ishlaydi)
  baseURL: 'https://namdtu-bazaar.onrender.com/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// So'rovlarga avtomatik tarzda tokenni qo'shish
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
