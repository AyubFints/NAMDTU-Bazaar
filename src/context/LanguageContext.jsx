import { createContext, useState, useContext } from 'react';

const translations = {
  uz: {
    catalog: 'Katalog',
    searchPlaceholder: 'Mahsulot va turkumlar izlash',
    login: 'Kirish',
    favorites: 'Saralanganlar',
    cart: 'Savat',
    orders: 'Buyurtmalarim'
  },
  ru: {
    catalog: 'Каталог',
    searchPlaceholder: 'Поиск товаров и категорий',
    login: 'Войти',
    favorites: 'Избранное',
    cart: 'Корзина',
    orders: 'Мои заказы'
  },
  en: {
    catalog: 'Catalog',
    searchPlaceholder: 'Search products and categories',
    login: 'Login',
    favorites: 'Favorites',
    cart: 'Cart',
    orders: 'My Orders'
  }
};

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState('uz');

  const t = (key) => {
    return translations[lang][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
