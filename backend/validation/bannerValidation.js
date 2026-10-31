const Joi = require("joi");

const validateBanner = (banner) => {
  const schema = Joi.object({
    image: Joi.string().required(),
    title: Joi.string().allow('', null),
    subtitle: Joi.string().allow('', null),
  });

  return schema.validate(banner);
};

module.exports = { validateBanner };
