const fx = require('money');
const ExchangeRateApi = require('@ivanvr/exchangerate-api-wrapper');
const STATES = require('./states');

const exchangeRateApi = new ExchangeRateApi(process.env.API_KEY);
const ExchangeRate = require('../models/exchange-rate/exchange-rate');

async function updateCachedConversionRates(currencySymbol, exchangeRateApiResponse) {
  let exchangeRate = await ExchangeRate.findOneAndUpdate(
    { base: currencySymbol },
    exchangeRateApiResponse,
  ).exec();
  if (!exchangeRate) {
    exchangeRate = await new ExchangeRate(exchangeRateApiResponse).save();
  }
  return exchangeRate;
}

async function getCachedExchangeRates(currencySymbol) {
  let jsonResult = null;
  const exchangeRateDB = await ExchangeRate.findOne({
    base: currencySymbol,
    time_next_update: { $gte: new Date() },
  }).exec();
  if (exchangeRateDB) {
    jsonResult = exchangeRateDB.toJSON().conversion_rates;
    console.log('Getting cached data.');
  }
  return jsonResult;
}

async function getExchangeRates(currencySymbol) {
  let rates = await getCachedExchangeRates(currencySymbol);
  if (!rates) {
    console.log('Getting data from server.');
    const response = await exchangeRateApi.latest(currencySymbol);
    const state = response.result;
    if (state === STATES.SUCCESS) {
      rates = response.conversion_rates;
      updateCachedConversionRates(currencySymbol, response);
    } else {
      throw new Error(response.error);
    }
  }
  return rates;
}

async function convertCurrency(amount, from, to) {
  const rates = await getExchangeRates(from);
  fx.rates = rates;
  fx.base = from;
  return fx(amount).from(from).to(to);
}

module.exports = {
  convertCurrency,
};
