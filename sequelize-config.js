require('dotenv').config();

const common = {
  dialect: process.env.DB_DIALECT || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  username: process.env.DB_USERNAME || 'admin',
  password: process.env.DB_PASSWORD || 'admin',
  database: process.env.DB_NAME || 'app',
  logging: console.log
};

module.exports = {
  development: { ...common },
  test: { ...common, database: (process.env.DB_NAME_TEST || 'app_test') },
  production: { ...common }
};


