require('./config/config');
const express = require('express');
const bodyParser = require('body-parser');
const handlebars = require('express-handlebars');
const path = require('path');
const fx = require('money');
const ExchangeRateApi = require('@ivanvr/exchangerate-api-wrapper');
const money = require('accounting-js');

const exchangeRateApi = new ExchangeRateApi(process.env.API_KEY);

const STATES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WAITING_FOR_INPUT: 'waiting_for_input',
};

const currencies = [
  {
    code: 'USD',
    description: 'US Dollar',
    flag: 'usd.svg',
    symbol: '$',
  },
  {
    code: 'ARS',
    description: 'Argentine Peso',
    flag: 'ars.svg',
    symbol: '$',
  },
  {
    code: 'EUR',
    description: 'Euro',
    flag: 'eur.svg',
    symbol: '€',
  },
  {
    code: 'CLP',
    description: 'Chilean Peso',
    flag: 'clp.svg',
    symbol: '$',
  },
  {
    code: 'INR',
    description: 'Indian Rupee',
    flag: 'inr.svg',
    symbol: '₹',
  },
];
const defaultCodeFrom = 'USD';
const defaultCodeTo = 'ARS';

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

const app = express();
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

app.set('view engine', 'hbs');

app.engine('hbs', handlebars({
  layoutsDir: path.join(__dirname, 'views', 'layouts'),
  extname: 'hbs',
  helpers,
}));

app.use(express.static('public'));

app.get('/', async (req, res) => {
  const layout = 'index';
  const { amount, from, to } = req.query;
  let convertedAmount;
  let state = STATES.WAITING_FOR_INPUT;
  let errorDescription;
  if (to && from && amount) {
    const response = await exchangeRateApi.latest(from);
    state = response.result;
    if (state === STATES.SUCCESS) {
      fx.rates = response.conversion_rates;
      fx.base = response.base;
      try {
        convertedAmount = fx(amount).from(from).to(to);
      } catch (error) {
        state = STATES.ERROR;
        errorDescription = `Invalid amount (${amount}) or currency code (${to})`;
      }
    } else {
      errorDescription = response.error;
    }
  }

  const templateVars = {
    layout,
    from,
    to,
    amount,
    convertedAmount,
    state,
    errorDescription,
    currencies,
    defaultCodeFrom,
    defaultCodeTo,
  };

  res.render('main', templateVars);
});

app.listen(process.env.PORT, () => {
  console.log('Listening on port: ', process.env.PORT);
});
