const { Banner } = require('../models');
const { validateBanner } = require('../validation/bannerValidation');

exports.getBanners = async (req, res) => {
  try {
    const banners = await Banner.findAll({});
    res.status(200).send(banners);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.getBannerById = async (req, res) => {
  try {
    const banner = await Banner.findByPk(req.params.id);
    if (!banner) return res.status(404).send('Banner not found');
    res.status(200).send(banner);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.createBanner = async (req, res) => {
  const { error } = validateBanner(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    const { image, title, subtitle } = req.body;
    const banner = await Banner.create({ image, title, subtitle });
    res.status(201).send(banner);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.updateBanner = async (req, res) => {
  const { error } = validateBanner(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    const banner = await Banner.findByPk(req.params.id);
    if (!banner) return res.status(404).send('Banner not found');

    await banner.update(req.body);
    res.status(200).send(banner);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.deleteBanner = async (req, res) => {
  try {
    const banner = await Banner.findByPk(req.params.id);
    if (!banner) return res.status(404).send('Banner not found');

    const data = banner.toJSON();
    await banner.destroy();
    res.status(200).send(data);
  } catch (error) {
    res.status(500).send(error.message);
  }
};
