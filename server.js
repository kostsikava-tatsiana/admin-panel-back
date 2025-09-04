const express = require('express');
const sequelize = require('./config/database');
const cors = require('cors');
const { User, Role } = require('./models');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5174'
}));
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// GET /users -> list users with roles
app.get('/users', async (req, res) => {
  try {
    const users = await User.findAll({
      include: [{
        model: Role,
        as: 'roles',
        through: { attributes: [] }
      }]
    });
    res.json(users);
  } catch (err) {
    console.error('GET /users error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /roles -> list all roles
app.get('/roles', async (req, res) => {
  try {
    const roles = await Role.findAll();
    res.json(roles);
  } catch (err) {
    console.error('GET /roles error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PATCH /users/:id/roles -> set roles for a user
// Body: { roleIds: number[] }
app.patch('/users/:id/roles', async (req, res) => {
  const { id } = req.params;
  const { roleIds } = req.body || {};
  try {
    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    let rolesToSet = [];
    if (Array.isArray(roleIds) && roleIds.length > 0) {
      rolesToSet = await Role.findAll({ where: { id: roleIds } });
    } else {
      return res.status(400).json({ error: 'Provide roleIds array' });
    } 
    await user.setRoles(rolesToSet);

    const updated = await User.findByPk(id, {
      include: [{ model: Role, as: 'roles', through: { attributes: [] } }]
    });
    res.json(updated);
  } catch (err) {
    console.error('PATCH /users/:id/roles error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

async function start() {
  try {
    await sequelize.authenticate();
    console.log('Database connection established.');

    if (process.env.DB_SYNC === 'true') {
      await sequelize.sync({ alter: true });
      console.log('Database synchronized.');
    }

    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

start();


