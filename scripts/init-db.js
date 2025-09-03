const sequelize = require('../config/database');
const { User, Role, UserRole } = require('../models');

async function initializeDatabase() {
  try {
    // Test the connection
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');

    // Sync the database (create tables if they don't exist)
    await sequelize.sync({ force: false }); // Set to true to drop and recreate tables
    console.log('Database synchronized successfully.');

    // Create default roles
    const adminRole = await Role.findOrCreate({
      where: { name: 'admin' },
      defaults: { name: 'admin' }
    });

    const userRole = await Role.findOrCreate({
      where: { name: 'user' },
      defaults: { name: 'user' }
    });

    const editorRole = await Role.findOrCreate({
      where: { name: 'editor' },
      defaults: { name: 'editor' }
    });

    console.log('Roles created/found:', { adminRole, userRole, editorRole });

    // Create a sample user
    const sampleUser = await User.findOrCreate({
      where: { email: 'admin@example.com' },
      defaults: {
        name: 'Admin User',
        email: 'admin@example.com'
      }
    });

    if (sampleUser[1]) { // If user was created (not found)
      // Assign roles to the user
      await sampleUser[0].addRoles([adminRole[0], userRole[0]]);
      console.log('Sample user created with roles:', sampleUser[0].toJSON());
    } else {
      console.log('Sample user already exists:', sampleUser[0].toJSON());
    }

  } catch (error) {
    console.error('Unable to connect to the database:', error);
  } finally {
    await sequelize.close();
  }
}

// Run the initialization
initializeDatabase();
