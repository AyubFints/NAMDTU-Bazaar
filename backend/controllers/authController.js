const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

exports.registerUser = async (req, res) => {
  try {
    const { name, phone, password, role } = req.body;

    const existingUser = await User.findOne({ where: { phone } });
    if (existingUser) {
      return res.status(400).json({ message: 'Ushbu telefon raqam orqali profil allaqachon yaratilgan. Iltimos, "Tizimga kirish" orqali kiring.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      phone,
      password: hashedPassword,
      role: role || 'user',
    });

    if (user) {
      res.status(201).json({
        id: user.id,
        name: user.name,
        phone: user.phone,
        role: user.role,
        token: generateToken(user.id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { phone, password } = req.body;

    const user = await User.findOne({ where: { phone } });

    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        id: user.id,
        name: user.name,
        phone: user.phone,
        role: user.role,
        token: generateToken(user.id),
      });
    } else {
      res.status(401).json({ message: 'Invalid phone or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.toggleFavorite = async (req, res) => {
  try {
    // In PostgreSQL, favorites should ideally be a junction table (UserFavorites)
    // But since we want to keep it simple for now, we can add a 'favorites' JSON array to the User model
    // Let's quickly update the User model definition to include favorites
    const { productId } = req.body;
    const user = await User.findByPk(req.user.id);
    
    // We haven't added favorites to Sequelize User yet. 
    // We'll return an empty array for now until frontend is fixed
    res.json([]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
