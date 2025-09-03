const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Role = sequelize.define('Role', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true,
      len: [2, 50]
    }
  }
}, {
  tableName: 'roles',
  timestamps: true, // Adds createdAt and updatedAt fields
  indexes: [
    {
      unique: true,
      fields: ['name']
    }
  ]
});

module.exports = Role;
