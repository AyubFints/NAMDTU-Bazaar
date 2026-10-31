const Joi = require("joi");

const validateOrder = (order) => {
  const schema = Joi.object({
    buyerName: Joi.string().required(),
    buyerPhone: Joi.string().required(),
    items: Joi.array().required(),
    totalAmount: Joi.number().required(),
    paymentMethod: Joi.string().default('cash'),
    receiptImage: Joi.string().allow('', null),
    status: Joi.string().valid('Yangi', 'Yetkazilmoqda', 'Sotildi', 'Bekor qilingan').allow(null),
    address: Joi.string().required(),
    comment: Joi.string().allow('', null),
  });

  return schema.validate(order);
};

module.exports = { validateOrder };
