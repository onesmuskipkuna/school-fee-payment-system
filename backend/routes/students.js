const express = require('express');
const router = express.Router();
const { Student } = require('../models');

// Get all students
router.get('/', async (req, res) => {
  try {
    const students = await Student.findAll();
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch students' });
  }
});

// Get student by admissionNumber
router.get('/:admissionNumber', async (req, res) => {
  try {
    const student = await Student.findOne({ where: { admissionNumber: req.params.admissionNumber } });
    if (!student) return res.status(404).json({ error: 'Student not found' });
    res.json(student);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch student' });
  }
});

// Create new student
router.post('/', async (req, res) => {
  try {
    const newStudent = await Student.create(req.body);
    res.status(201).json(newStudent);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create student' });
  }
});

// Update student
router.put('/:admissionNumber', async (req, res) => {
  try {
    const student = await Student.findOne({ where: { admissionNumber: req.params.admissionNumber } });
    if (!student) return res.status(404).json({ error: 'Student not found' });
    await student.update(req.body);
    res.json(student);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update student' });
  }
});

// Delete student
router.delete('/:admissionNumber', async (req, res) => {
  try {
    const student = await Student.findOne({ where: { admissionNumber: req.params.admissionNumber } });
    if (!student) return res.status(404).json({ error: 'Student not found' });
    await student.destroy();
    res.json({ message: 'Student deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete student' });
  }
});

module.exports = router;
