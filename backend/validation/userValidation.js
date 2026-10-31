const Joi = require("joi");

const validateUser = (user) => {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(3).required(),
    customer_id: Joi.number(),
    car_id: Joi.number(),    
  });

  return schema.validate(user);
};

module.exports = { validateUser };
