const { Category } = require('../models');
const { validateCategory } = require('../validation/categoryValidation');
const { Op } = require('sequelize');

exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.findAll({});
    res.status(200).send(categories);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) return res.status(404).send('Category not found');
    res.status(200).send(category);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.createCategory = async (req, res) => {
  const { error } = validateCategory(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    const { name, variants } = req.body;
    const categoryExists = await Category.findOne({ where: { name } });
    if (categoryExists) {
      return res.status(400).send('Category already exists');
    }

    const category = await Category.create({ 
      name,
      variants: Array.isArray(variants) ? variants : []
    });
    res.status(201).send(category);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.updateCategory = async (req, res) => {
  const { error } = validateCategory(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) return res.status(404).send('Category not found');

    await category.update(req.body);
    res.status(200).send(category);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) return res.status(404).send('Category not found');

    const data = category.toJSON();
    await category.destroy();
    res.status(200).send(data);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.searchCategories = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) return res.status(400).send('Search query is required');

    const categories = await Category.findAll({
      where: {
        name: { [Op.iLike]: `%${query}%` }
      }
    });
    res.status(200).send(categories);
  } catch (error) {
    res.status(500).send(error.message);
  }
};
