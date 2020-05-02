// ============================
//  Port
// ============================
process.env.PORT = process.env.PORT || 3001;

// ============================
//  Evn
// ============================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// ============================
//  DB
// ============================

let DBURI;

if (process.env.NODE_ENV === 'dev') {
  DBURI = 'mongodb://localhost/exchange-rates';
} else {
  DBURI = process.env.DATABASE_URI;
}

process.env.DBURI = DBURI;
