const { Sequelize } = require('sequelize');

const dialect = process.env.DB_DIALECT || 'postgres';
const isSqlite = dialect === 'sqlite';

// Build config based on dialect
const sequelize = isSqlite
  ? new Sequelize({
      dialect: 'sqlite',
      storage: process.env.SQLITE_STORAGE || './database.sqlite',
      logging: console.log,
    })
  : new Sequelize(
      process.env.DB_NAME || 'app',
      process.env.DB_USERNAME || 'admin',
      process.env.DB_PASSWORD || 'admin',
      {
        host: process.env.DB_HOST || 'localhost',
        port: Number(process.env.DB_PORT || 5432),
        dialect,
        logging: console.log,
      }
    );

module.exports = sequelize;
