const Joi = require('@hapi/joi');
const currencies = require('../data/currencies');

const requireAllFieldsPresent = Joi.object({
  amount: Joi.required(),
  from: Joi.required(),
  to: Joi.required(),
});

const symbols = currencies.map((currency) => currency.code);
const validCurrencySchema = Joi.string().valid(...symbols).required();
const validNumberSchema = Joi.number().required();

module.exports = {
  requireAllFieldsPresent,
  validCurrencySchema,
  validNumberSchema,
};
