const express = require('express');
const router = express.Router();
const { FeeStructure } = require('../models');

// Get all fee structures
router.get('/', async (req, res) => {
  try {
    const feeStructures = await FeeStructure.findAll();
    res.json(feeStructures);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch fee structures' });
  }
});

// Get fee structure by id
router.get('/:id', async (req, res) => {
  try {
    const feeStructure = await FeeStructure.findByPk(req.params.id);
    if (!feeStructure) return res.status(404).json({ error: 'Fee structure not found' });
    res.json(feeStructure);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch fee structure' });
  }
});

// Create new fee structure
router.post('/', async (req, res) => {
  try {
    const newFeeStructure = await FeeStructure.create(req.body);
    res.status(201).json(newFeeStructure);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create fee structure' });
  }
});

// Update fee structure
router.put('/:id', async (req, res) => {
  try {
    const feeStructure = await FeeStructure.findByPk(req.params.id);
    if (!feeStructure) return res.status(404).json({ error: 'Fee structure not found' });
    await feeStructure.update(req.body);
    res.json(feeStructure);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update fee structure' });
  }
});

// Delete fee structure
router.delete('/:id', async (req, res) => {
  try {
    const feeStructure = await FeeStructure.findByPk(req.params.id);
    if (!feeStructure) return res.status(404).json({ error: 'Fee structure not found' });
    await feeStructure.destroy();
    res.json({ message: 'Fee structure deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete fee structure' });
  }
});

module.exports = router;
