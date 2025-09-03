const User = require('./User');
const Role = require('./Role');
const UserRole = require('./UserRole');

// Define associations
User.belongsToMany(Role, {
  through: UserRole,
  foreignKey: 'userId',
  otherKey: 'roleId',
  as: 'roles'
});

Role.belongsToMany(User, {
  through: UserRole,
  foreignKey: 'roleId',
  otherKey: 'userId',
  as: 'users'
});

// Direct associations for the junction table
UserRole.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user'
});

UserRole.belongsTo(Role, {
  foreignKey: 'roleId',
  as: 'role'
});

User.hasMany(UserRole, {
  foreignKey: 'userId',
  as: 'userRoles'
});

Role.hasMany(UserRole, {
  foreignKey: 'roleId',
  as: 'userRoles'
});

module.exports = {
  User,
  Role,
  UserRole
};
