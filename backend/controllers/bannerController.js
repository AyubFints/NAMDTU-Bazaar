const Banner = require('../models/Banner');

exports.getBanners = async (req, res) => {
  try {
    const banners = await Banner.findAll({});
    res.json(banners);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createBanner = async (req, res) => {
  try {
    const { image, title, subtitle } = req.body;
    const banner = await Banner.create({ image, title, subtitle });
    res.status(201).json(banner);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateBanner = async (req, res) => {
  try {
    const { image, title, subtitle } = req.body;
    const banner = await Banner.findByPk(req.params.id);

    if (banner) {
      banner.image = image || banner.image;
      banner.title = title || banner.title;
      banner.subtitle = subtitle || banner.subtitle;
      
      await banner.save();
      res.json(banner);
    } else {
      res.status(404).json({ message: 'Banner not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteBanner = async (req, res) => {
  try {
    const banner = await Banner.findByPk(req.params.id);
    if (banner) {
      await banner.destroy();
      res.json({ message: 'Banner removed' });
    } else {
      res.status(404).json({ message: 'Banner not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
