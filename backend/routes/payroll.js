const express = require('express');
const router = express.Router();
const { Payroll } = require('../models');

// Get all payrolls
router.get('/', async (req, res) => {
  try {
    const payrolls = await Payroll.findAll();
    res.json(payrolls);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch payrolls' });
  }
});

// Get payroll by id
router.get('/:id', async (req, res) => {
  try {
    const payroll = await Payroll.findByPk(req.params.id);
    if (!payroll) return res.status(404).json({ error: 'Payroll not found' });
    res.json(payroll);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch payroll' });
  }
});

// Create new payroll
router.post('/', async (req, res) => {
  try {
    const newPayroll = await Payroll.create(req.body);
    res.status(201).json(newPayroll);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create payroll' });
  }
});

// Update payroll
router.put('/:id', async (req, res) => {
  try {
    const payroll = await Payroll.findByPk(req.params.id);
    if (!payroll) return res.status(404).json({ error: 'Payroll not found' });
    await payroll.update(req.body);
    res.json(payroll);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update payroll' });
  }
});

// Delete payroll
router.delete('/:id', async (req, res) => {
  try {
    const payroll = await Payroll.findByPk(req.params.id);
    if (!payroll) return res.status(404).json({ error: 'Payroll not found' });
    await payroll.destroy();
    res.json({ message: 'Payroll deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete payroll' });
  }
});

module.exports = router;
