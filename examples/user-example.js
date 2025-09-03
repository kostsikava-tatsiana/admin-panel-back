const { User, Role, UserRole } = require('../models');
const sequelize = require('../config/database');

async function userExamples() {
  try {
    // Create a new user
    const newUser = await User.create({
      name: 'John Doe',
      email: 'john.doe@example.com'
    });
    console.log('Created user:', newUser.toJSON());

    // Get or create roles
    const userRole = await Role.findOne({ where: { name: 'user' } });
    const editorRole = await Role.findOne({ where: { name: 'editor' } });
    const adminRole = await Role.findOne({ where: { name: 'admin' } });

    // Assign roles to the user
    if (userRole && editorRole) {
      await newUser.addRoles([userRole, editorRole]);
      console.log('Assigned roles to user');
    }

    // Find all users with their roles
    const allUsers = await User.findAll({
      include: [{
        model: Role,
        as: 'roles',
        through: { attributes: [] } // Don't include junction table attributes
      }]
    });
    console.log('All users with roles:', JSON.stringify(allUsers, null, 2));

    // Find user by email with roles
    const userByEmail = await User.findOne({
      where: { email: 'john.doe@example.com' },
      include: [{
        model: Role,
        as: 'roles',
        through: { attributes: [] }
      }]
    });
    console.log('User found by email with roles:', JSON.stringify(userByEmail, null, 2));

    // Add admin role to existing user
    if (userByEmail && adminRole) {
      await userByEmail.addRole(adminRole);
      console.log('Added admin role to user');
    }

    // Find users with specific role
    const adminUsers = await User.findAll({
      include: [{
        model: Role,
        as: 'roles',
        where: { name: 'admin' },
        through: { attributes: [] }
      }]
    });
    console.log('Users with admin role:', JSON.stringify(adminUsers, null, 2));

    // Find all roles
    const allRoles = await Role.findAll();
    console.log('All roles:', allRoles.map(role => role.toJSON()));

    // Remove a role from user
    if (userByEmail && editorRole) {
      await userByEmail.removeRole(editorRole);
      console.log('Removed editor role from user');
    }

    // Check user's roles after removal
    const updatedUser = await User.findOne({
      where: { email: 'john.doe@example.com' },
      include: [{
        model: Role,
        as: 'roles',
        through: { attributes: [] }
      }]
    });
    console.log('User roles after removal:', JSON.stringify(updatedUser, null, 2));

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await sequelize.close();
  }
}

// Uncomment the line below to run the examples
// userExamples();
