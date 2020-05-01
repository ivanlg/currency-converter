const fx = require('money');
const ExchangeRateApi = require('@ivanvr/exchangerate-api-wrapper');
const STATES = require('./states');

const exchangeRateApi = new ExchangeRateApi(process.env.API_KEY);

async function convertCurrency(amount, from, to) {
  const response = await exchangeRateApi.latest(from);
  const state = response.result;
  if (state === STATES.SUCCESS) {
    fx.rates = response.conversion_rates;
    fx.base = response.base;
    return fx(amount).from(from).to(to);
  }
  throw new Error(response.error);
}

module.exports = convertCurrency;
