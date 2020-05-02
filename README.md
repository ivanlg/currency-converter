# Currency Converter

Tiny currency converter using data from https://www.exchangerate-api.com

## Built With

* Express (Framework used)
* Handlebars (View Engine)
* Mongoose (For exchange rates caching)
* @hapi/joi (For request validation)
* @ivanvr/exchangerate-api-wrapper (An npm package made by me, used for getting exchange rates from https://www.exchangerate-api.com)
* Money.js and accounting.js (For currency conversion and display)
* Bootstrap 4/ Autonumeric.js/ Jquery etc.

## Development setup

```sh
npm install
npm API_KEY=[YOUR API_KEY FROM exchangerate-api.com] node index.js 
```

## Live Demo

https://ibazan-currency-converter.herokuapp.com/

