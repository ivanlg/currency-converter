const money = require('accounting-js');
const currencies = require('../../data/currencies');
const STATES = require('../../utils/states');

const helpers = {
  currenciesMatch: (currencyCode1, currencyCode2) => currencyCode1 === currencyCode2,
  getCurrencyDescription: (code) => currencies.find((currency) => currency.code === code).description,
  formatMoney: (code, value) => {
    const currency = currencies.find((item) => item.code === code);
    return money.formatMoney(value, {
      symbol: currency.symbol,
      precision: 2,
      thousand: '.',
      decimal: ',',
    });
  },
  isStateWaitingForInput: (state) => state === STATES.WAITING_FOR_INPUT,
  isStateError: (state) => state === STATES.ERROR,
  isStateSuccess: (state) => state === STATES.SUCCESS,
};

module.exports = helpers;
