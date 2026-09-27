const StoreApplication = require('../models/StoreApplication');

exports.createApplication = async (req, res) => {
  try {
    const { storeName, ownerName, phone, categories } = req.body;
    const application = await StoreApplication.create({
      userId: req.user.id,
      storeName,
      ownerName,
      phone,
      categories
    });
    res.status(201).json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMyApplications = async (req, res) => {
  try {
    const applications = await StoreApplication.findAll({ where: { userId: req.user.id } });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllApplications = async (req, res) => {
  try {
    const applications = await StoreApplication.findAll({ order: [['createdAt', 'DESC']] });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateApplication = async (req, res) => {
  try {
    const { storeName, ownerName, phone, categories } = req.body;
    const application = await StoreApplication.findOne({ where: { id: req.params.id, userId: req.user.id } });
    if (!application) return res.status(404).json({ message: 'Topilmadi' });
    
    application.storeName = storeName || application.storeName;
    application.ownerName = ownerName || application.ownerName;
    application.phone = phone || application.phone;
    application.categories = categories || application.categories;
    
    await application.save();
    res.json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteApplication = async (req, res) => {
  try {
    const application = await StoreApplication.findOne({ where: { id: req.params.id, userId: req.user.id } });
    if (!application) return res.status(404).json({ message: 'Topilmadi' });
    
    await application.destroy();
    res.json({ message: 'O`chirildi' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const application = await StoreApplication.findByPk(req.params.id);
    if (!application) return res.status(404).json({ message: 'Topilmadi' });
    
    application.status = status;
    await application.save();
    res.json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
