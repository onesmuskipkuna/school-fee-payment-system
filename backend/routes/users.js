const express = require('express');
const router = express.Router();
const { User, Role } = require('../models');
const bcrypt = require('bcryptjs');

// Get all users
router.get('/', async (req, res) => {
  try {
    const users = await User.findAll({
      include: [{ model: Role }],
      attributes: { exclude: ['password'] },
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Get user by id
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      include: [{ model: Role }],
      attributes: { exclude: ['password'] },
    });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// Create new user
router.post('/', async (req, res) => {
  try {
    const { username, password, roleId } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ username, password: hashedPassword, roleId });
    res.status(201).json({ id: newUser.id, username: newUser.username, roleId: newUser.roleId });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// Update user
router.put('/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    if (req.body.password) {
      req.body.password = await bcrypt.hash(req.body.password, 10);
    }
    await user.update(req.body);
    res.json({ id: user.id, username: user.username, roleId: user.roleId });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// Delete user
router.delete('/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    await user.destroy();
    res.json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

module.exports = router;
