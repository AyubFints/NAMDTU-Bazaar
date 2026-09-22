const Product = require('../models/Product');

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.findAll({ where: { status: 'approved' } });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAdminProducts = async (req, res) => {
  try {
    const products = await Product.findAll({});
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const { name, price, oldPrice, category, images, description, stock, badge, brand, sizes, cardNumber, cardHolderName } = req.body;
    
    const product = await Product.create({
      name,
      price,
      oldPrice,
      category,
      images: images || [],
      description,
      stock,
      badge,
      brand,
      sizes: sizes || [],
      cardNumber,
      cardHolderName,
      creatorPhone: req.user.phone,
      creatorName: req.user.name,
      status: req.user.role === 'admin' ? 'approved' : 'pending'
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { name, price, oldPrice, category, images, description, stock, badge, brand, sizes } = req.body;
    const product = await Product.findByPk(req.params.id);

    if (product) {
      product.name = name || product.name;
      product.price = price || product.price;
      product.oldPrice = oldPrice || product.oldPrice;
      product.category = category || product.category;
      product.images = images || product.images;
      product.description = description || product.description;
      product.stock = stock || product.stock;
      product.badge = badge || product.badge;
      product.brand = brand || product.brand;
      product.sizes = sizes || product.sizes;

      await product.save();
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (product) {
      await product.destroy();
      res.json({ message: 'Product removed' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.approveProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (product) {
      product.status = 'approved';
      await product.save();
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.rejectProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (product) {
      product.status = 'rejected';
      await product.save();
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
