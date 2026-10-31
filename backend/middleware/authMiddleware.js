const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findByPk(decoded.id, {
        attributes: { exclude: ['password'] }
      });
      if (!req.user) {
        return res.status(401).json({ message: 'Foydalanuvchi topilmadi' });
      }
      return next();
    } catch (error) {
      console.error('JWT error:', error.message);
      return res.status(401).json({ message: 'Avtorizatsiyadan o\'tilmagan, token yaroqsiz' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Avtorizatsiyadan o\'tilmagan, token yo\'q' });
  }
};

const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  } else {
    return res.status(403).json({ message: 'Faqat admin uchun ruxsat etilgan' });
  }
};

module.exports = { protect, admin };
