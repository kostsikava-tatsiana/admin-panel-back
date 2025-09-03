const { User, Role, UserRole } = require('../models');
const sequelize = require('../config/database');

async function roleExamples() {
  try {
    // Create new roles
    const moderatorRole = await Role.create({
      name: 'moderator'
    });
    console.log('Created moderator role:', moderatorRole.toJSON());

    const viewerRole = await Role.create({
      name: 'viewer'
    });
    console.log('Created viewer role:', viewerRole.toJSON());

    // Find all roles
    const allRoles = await Role.findAll();
    console.log('All roles:', allRoles.map(role => role.toJSON()));

    // Find role by name
    const adminRole = await Role.findOne({
      where: { name: 'admin' }
    });
    console.log('Admin role found:', adminRole?.toJSON());

    // Update role name
    if (viewerRole) {
      await viewerRole.update({ name: 'readonly' });
      console.log('Updated role name to readonly');
    }

    // Find users with a specific role
    const adminUsers = await User.findAll({
      include: [{
        model: Role,
        as: 'roles',
        where: { name: 'admin' },
        through: { attributes: [] }
      }]
    });
    console.log('Users with admin role:', adminUsers.length);

    // Find roles for a specific user
    const user = await User.findOne({
      where: { email: 'admin@example.com' },
      include: [{
        model: Role,
        as: 'roles',
        through: { attributes: [] }
      }]
    });
    
    if (user) {
      console.log('User roles:', user.roles.map(role => role.name));
    }

    // Count users per role
    const roleCounts = await Role.findAll({
      include: [{
        model: User,
        as: 'users',
        through: { attributes: [] }
      }],
      attributes: [
        'id',
        'name',
        [sequelize.fn('COUNT', sequelize.col('users.id')), 'userCount']
      ],
      group: ['Role.id', 'Role.name'],
      raw: true
    });
    console.log('Role counts:', roleCounts);

    // Delete a role (this will also remove all user-role associations)
    const readonlyRole = await Role.findOne({ where: { name: 'readonly' } });
    if (readonlyRole) {
      await readonlyRole.destroy();
      console.log('Deleted readonly role');
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await sequelize.close();
  }
}

// Uncomment the line below to run the examples
// roleExamples();
