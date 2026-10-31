const Joi = require("joi");

const validateProduct = (product) => {
  const schema = Joi.object({
    name: Joi.string().min(2).required(),
    price: Joi.string().required(),
    oldPrice: Joi.string().allow('', null),
    category: Joi.string().required(),
    images: Joi.array().items(Joi.string()).allow(null),
    description: Joi.string().allow('', null),
    stock: Joi.string().allow('', null),
    badge: Joi.string().allow('', null),
    brand: Joi.string().allow('', null),
    sizes: Joi.array().items(Joi.string()).allow(null),
    cardNumber: Joi.string().allow('', null),
    cardHolderName: Joi.string().allow('', null),
    cardType: Joi.string().allow('', null),
    creatorPhone: Joi.string().allow('', null),
    creatorName: Joi.string().allow('', null),
    status: Joi.string().valid('pending', 'approved', 'rejected').allow(null),
  });

  return schema.validate(product);
};

module.exports = { validateProduct };
