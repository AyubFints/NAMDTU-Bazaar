const Joi = require('joi');

const validateStoreApplication = (data) => {
  const schema = Joi.object({
    storeName: Joi.string().min(2).required(),
    ownerName: Joi.string().min(2).required(),
    phone: Joi.string().required(),
    categories: Joi.array().items(Joi.string()).allow(null),
  });

  return schema.validate(data);
};

module.exports = { validateStoreApplication };
