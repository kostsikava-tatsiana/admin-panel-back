'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Ensure roles exist
    const roles = [
      { name: 'Admin', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Editor', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Viewer', createdAt: new Date(), updatedAt: new Date() }
    ];

    await queryInterface.bulkInsert('roles', roles, {
      ignoreDuplicates: true
    });

    // Create users
    const users = [
      { name: 'Alice Admin', email: 'alice@example.com', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Eddie Editor', email: 'eddie@example.com', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Vera Viewer', email: 'vera@example.com', createdAt: new Date(), updatedAt: new Date() }
    ];
    await queryInterface.bulkInsert('users', users, { ignoreDuplicates: true });

    // Fetch ids
    const [roleRows] = await queryInterface.sequelize.query("SELECT id, name FROM roles WHERE name IN ('Admin','Editor','Viewer')");
    const [userRows] = await queryInterface.sequelize.query("SELECT id, email FROM users WHERE email IN ('alice@example.com','eddie@example.com','vera@example.com')");

    const roleIdByName = Object.fromEntries(roleRows.map(r => [r.name, r.id]));
    const userIdByEmail = Object.fromEntries(userRows.map(u => [u.email, u.id]));

    const now = new Date();
    const userRoles = [
      { userId: userIdByEmail['alice@example.com'], roleId: roleIdByName['Admin'], createdAt: now, updatedAt: now },
      { userId: userIdByEmail['alice@example.com'], roleId: roleIdByName['Editor'], createdAt: now, updatedAt: now },
      { userId: userIdByEmail['eddie@example.com'], roleId: roleIdByName['Editor'], createdAt: now, updatedAt: now },
      { userId: userIdByEmail['vera@example.com'], roleId: roleIdByName['Viewer'], createdAt: now, updatedAt: now }
    ];

    await queryInterface.bulkInsert('user_roles', userRoles, { ignoreDuplicates: true });
  },

  async down(queryInterface, Sequelize) {
    // Remove inserted user_roles first due FK
    await queryInterface.bulkDelete('user_roles', null, {});
    await queryInterface.bulkDelete('users', {
      email: ['alice@example.com','eddie@example.com','vera@example.com']
    }, {});
    await queryInterface.bulkDelete('roles', {
      name: ['Admin','Editor','Viewer']
    }, {});
  }
};


