const mongoose = require('mongoose');

const { Schema } = mongoose;
const exchangeRateSchema = new Schema({
  result: {
    type: String,
  },
  time_zone: {
    type: String,
  },
  time_last_update: {
    type: Date,
    set: (v) => new Date(v * 1000),
  },
  time_next_update: {
    type: Date,
    set: (v) => new Date(v * 1000),
  },
  base: {
    type: String,
  },
  conversion_rates: {
    type: Map,
    of: String,
  },
},
{
  toObject: { getters: true },
});

exchangeRateSchema.methods.toJSON = function () {
  const exchangeRate = this;
  const exchangeRateObject = exchangeRate.toObject();
  exchangeRateObject.conversion_rates = Object.fromEntries(exchangeRateObject.conversion_rates);
  return exchangeRateObject;
};

module.exports = mongoose.model('exchange-rate', exchangeRateSchema);
