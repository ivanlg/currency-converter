require('./config/config');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const handlebars = require('express-handlebars');
const path = require('path');
const currencies = require('./data/currencies');
const helpers = require('./views/helpers/helpers');
const { convertCurrency } = require('./utils/utils');
const {
  requireAllFieldsPresent,
  validCurrencySchema,
  validNumberSchema,
} = require('./schemas/schemas');
const STATES = require('./utils/states');

// constants
const defaultCodeFrom = 'USD';
const defaultCodeTo = 'ARS';
const defaultAmount = 1;

const allFieldsPresent = (data) => {
  const { error } = requireAllFieldsPresent.validate(data);
  return !error;
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
  const from = defaultCodeFrom;
  const to = defaultCodeTo;
  const amount = defaultAmount;
  const convertedAmount = 0;
  const state = STATES.WAITING_FOR_INPUT;
  const errorDescription = '';

  const templateVars = {
    layout,
    from,
    to,
    amount,
    convertedAmount,
    state,
    errorDescription,
    currencies,
  };

  res.render('main', templateVars);
});

app.get('/convert', async (req, res) => {
  const layout = 'index';
  let { amount, from, to } = req.query;
  const data = { amount, from, to };
  let convertedAmount = 0;
  let state = STATES.WAITING_FOR_INPUT;
  let errorDescription = '';

  if (!allFieldsPresent(data)) {
    res.redirect('/');
    return;
  }
  // If the value is invalid, set the default value
  amount = validNumberSchema.validate(amount).error ? defaultAmount : amount;
  from = validCurrencySchema.validate(from).error ? defaultCodeFrom : from;
  to = validCurrencySchema.validate(to).error ? defaultCodeTo : to;

  try {
    convertedAmount = await convertCurrency(amount, from, to);
    state = STATES.SUCCESS;
  } catch (error) {
    state = STATES.ERROR;
    errorDescription = error.message;
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
  };

  res.render('main', templateVars);
});

mongoose.connect(
  process.env.DBURI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  },
);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', async () => {
  console.log("We're connected!");
  app.listen(process.env.PORT, () => {
    console.log('Listening on port: ', process.env.PORT);
  });
});
