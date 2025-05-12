const express = require('express');
const router = express.Router();
const { Payment, Invoice } = require('../models');

// Get all payments
router.get('/', async (req, res) => {
  try {
    const payments = await Payment.findAll({
      include: [{ model: Invoice }],
    });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch payments' });
  }
});

// Get payment by id
router.get('/:id', async (req, res) => {
  try {
    const payment = await Payment.findByPk(req.params.id, {
      include: [{ model: Invoice }],
    });
    if (!payment) return res.status(404).json({ error: 'Payment not found' });
    res.json(payment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch payment' });
  }
});

// Create new payment
router.post('/', async (req, res) => {
  try {
    const newPayment = await Payment.create(req.body);
    res.status(201).json(newPayment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create payment' });
  }
});

// Update payment
router.put('/:id', async (req, res) => {
  try {
    const payment = await Payment.findByPk(req.params.id);
    if (!payment) return res.status(404).json({ error: 'Payment not found' });
    await payment.update(req.body);
    res.json(payment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update payment' });
  }
});

// Delete payment
router.delete('/:id', async (req, res) => {
  try {
    const payment = await Payment.findByPk(req.params.id);
    if (!payment) return res.status(404).json({ error: 'Payment not found' });
    await payment.destroy();
    res.json({ message: 'Payment deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete payment' });
  }
});

module.exports = router;
