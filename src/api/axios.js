import axios from 'axios';

const api = axios.create({
  // Dinamik manzil: kompyuterda localhost bo'ladi, telefonda IP orqali ochganda IP manzilini oladi
  baseURL: `http://${window.location.hostname}:5000/api`, 
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
