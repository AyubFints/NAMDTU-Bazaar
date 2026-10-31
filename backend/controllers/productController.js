const { Product } = require('../models');
const { validateProduct } = require('../validation/productValidation');
const { Op } = require('sequelize');

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.findAll({ where: { status: 'approved' } });
    res.status(200).send(products);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.getAdminProducts = async (req, res) => {
  try {
    const products = await Product.findAll({});
    res.status(200).send(products);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).send('Product not found');
    res.status(200).send(product);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.createProduct = async (req, res) => {
  const { error } = validateProduct(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    const productData = {
      ...req.body,
      creatorPhone: req.user ? req.user.phone : req.body.creatorPhone,
      creatorName: req.user ? req.user.name : req.body.creatorName,
      status: (req.user && req.user.role === 'admin') ? 'approved' : 'pending'
    };

    const product = await Product.create(productData);
    res.status(201).send(product);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.updateProduct = async (req, res) => {
  const { error } = validateProduct(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).send('Product not found');

    await product.update(req.body);
    res.status(200).send(product);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).send('Product not found');

    const data = product.toJSON();
    await product.destroy();
    res.status(200).send(data);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.searchProducts = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) return res.status(400).send('Search query is required');

    const products = await Product.findAll({
      where: {
        status: 'approved',
        [Op.or]: [
          { name: { [Op.iLike]: `%${query}%` } },
          { category: { [Op.iLike]: `%${query}%` } },
          { brand: { [Op.iLike]: `%${query}%` } },
          { description: { [Op.iLike]: `%${query}%` } }
        ]
      }
    });

    res.status(200).send(products);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.approveProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).send('Product not found');

    product.status = 'approved';
    await product.save();
    res.status(200).send(product);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.rejectProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).send('Product not found');

    product.status = 'rejected';
    await product.save();
    res.status(200).send(product);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.getMyProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      where: { creatorPhone: req.user ? req.user.phone : '' }
    });
    res.status(200).send(products);
  } catch (error) {
    res.status(500).send(error.message);
  }
};
