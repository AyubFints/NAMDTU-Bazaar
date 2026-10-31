const Joi = require("joi");

const validateCustomer = (customer) => {
  const schema = Joi.object({
    name: Joi.string().min(2).required(),
    phone: Joi.string().allow('', null),
    email: Joi.string().email().allow('', null),
    address: Joi.string().allow('', null),
  });

  return schema.validate(customer);
};

module.exports = { validateCustomer };
