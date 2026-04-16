const router = require('express').Router();
const Department = require('../models/Department');
const { auth, requireRole } = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const departments = await Department.find().sort({ name: 1 });
    res.json({ departments });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.post('/', auth, requireRole('super_admin'), async (req, res) => {
  try {
    const dept = await Department.create(req.body);
    res.status(201).json({ department: dept });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.put('/:id', auth, requireRole('super_admin'), async (req, res) => {
  try {
    const dept = await Department.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!dept) return res.status(404).json({ message: 'Department not found' });
    res.json({ department: dept });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.delete('/:id', auth, requireRole('super_admin'), async (req, res) => {
  try {
    await Department.findByIdAndDelete(req.params.id);
    res.json({ message: 'Department deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
