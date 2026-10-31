const Joi = require("joi");

const validateCategory = (category) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    variants: Joi.array().items(Joi.string()).allow(null),
  });

  return schema.validate(category);
};

module.exports = { validateCategory };
