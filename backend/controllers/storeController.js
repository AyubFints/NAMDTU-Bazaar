const { StoreApplication } = require('../models');
const { validateStoreApplication } = require('../validation/storeValidation');

exports.createApplication = async (req, res) => {
  const { error } = validateStoreApplication(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    const { storeName, ownerName, phone, categories } = req.body;
    const application = await StoreApplication.create({
      userId: req.user.id,
      storeName,
      ownerName,
      phone,
      categories
    });
    res.status(201).send(application);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.getMyApplications = async (req, res) => {
  try {
    const applications = await StoreApplication.findAll({ where: { userId: req.user.id } });
    res.status(200).send(applications);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.getAllApplications = async (req, res) => {
  try {
    const applications = await StoreApplication.findAll({ order: [['createdAt', 'DESC']] });
    res.status(200).send(applications);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.updateApplication = async (req, res) => {
  const { error } = validateStoreApplication(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    const { storeName, ownerName, phone, categories } = req.body;
    const application = await StoreApplication.findOne({ where: { id: req.params.id, userId: req.user.id } });
    if (!application) return res.status(404).send('Topilmadi');
    
    application.storeName = storeName || application.storeName;
    application.ownerName = ownerName || application.ownerName;
    application.phone = phone || application.phone;
    application.categories = categories || application.categories;
    
    await application.save();
    res.status(200).send(application);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.deleteApplication = async (req, res) => {
  try {
    const application = await StoreApplication.findOne({ where: { id: req.params.id, userId: req.user.id } });
    if (!application) return res.status(404).send('Topilmadi');
    
    const data = application.toJSON();
    await application.destroy();
    res.status(200).send(data);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const application = await StoreApplication.findByPk(req.params.id);
    if (!application) return res.status(404).send('Topilmadi');
    
    application.status = status;
    await application.save();
    res.status(200).send(application);
  } catch (error) {
    res.status(500).send(error.message);
  }
};
