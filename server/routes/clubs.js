const router = require('express').Router();
const Club = require('../models/Club');
const Application = require('../models/Application');
const { auth, requireRole } = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const { department, category, search } = req.query;
    const filter = { isActive: true };
    if (department) filter.department = department;
    if (category) filter.category = category;
    if (search) filter.name = { $regex: search, $options: 'i' };

    const clubs = await Club.find(filter)
      .populate('department', 'name color')
      .populate('leader', 'name email')
      .select('-members')
      .sort({ createdAt: -1 });

    res.json({ clubs });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const club = await Club.findById(req.params.id)
      .populate('department', 'name color')
      .populate('leader', 'name email bio')
      .populate('members', 'name email');

    if (!club) return res.status(404).json({ message: 'Club not found' });
    res.json({ club });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.post('/', auth, requireRole('super_admin'), async (req, res) => {
  try {
    const club = await Club.create({ ...req.body });
    await club.populate(['department', 'leader']);
    res.status(201).json({ club });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const club = await Club.findById(req.params.id);
    if (!club) return res.status(404).json({ message: 'Club not found' });

    const isLeader = club.leader?.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'super_admin';
    if (!isLeader && !isAdmin) return res.status(403).json({ message: 'Access denied' });

    const updated = await Club.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate('department', 'name color')
      .populate('leader', 'name email');

    res.json({ club: updated });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.delete('/:id', auth, requireRole('super_admin'), async (req, res) => {
  try {
    await Club.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ message: 'Club deactivated' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.get('/:id/my-application', auth, async (req, res) => {
  try {
    const application = await Application.findOne({
      user: req.user._id,
      club: req.params.id
    });
    res.json({ application });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
