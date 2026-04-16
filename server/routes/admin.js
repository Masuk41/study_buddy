const router = require('express').Router();
const User = require('../models/User');
const Club = require('../models/Club');
const Department = require('../models/Department');
const Application = require('../models/Application');
const { auth, requireRole } = require('../middleware/auth');

router.use(auth, requireRole('super_admin'));

router.get('/stats', async (req, res) => {
  try {
    const [users, clubs, departments, applications] = await Promise.all([
      User.countDocuments({ role: { $ne: 'super_admin' } }),
      Club.countDocuments({ isActive: true }),
      Department.countDocuments(),
      Application.countDocuments({ status: 'pending' })
    ]);
    res.json({ stats: { users, clubs, departments, pendingApplications: applications } });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.get('/users', async (req, res) => {
  try {
    const { role, search } = req.query;
    const filter = {};
    if (role) filter.role = role;
    if (search) filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } }
    ];

    const users = await User.find(filter)
      .populate('department', 'name')
      .select('-password')
      .sort({ createdAt: -1 });
    res.json({ users });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.put('/users/:id/role', async (req, res) => {
  try {
    const { role } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).populate('department', 'name');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.get('/clubs', async (req, res) => {
  try {
    const clubs = await Club.find()
      .populate('department', 'name')
      .populate('leader', 'name email')
      .sort({ createdAt: -1 });
    res.json({ clubs });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.put('/clubs/:id/assign-leader', async (req, res) => {
  try {
    const { leaderId } = req.body;
    const [club, user] = await Promise.all([
      Club.findByIdAndUpdate(req.params.id, { leader: leaderId }, { new: true })
        .populate('department', 'name')
        .populate('leader', 'name email'),
      User.findByIdAndUpdate(leaderId, { role: 'club_leader' }, { new: true })
    ]);
    if (!club) return res.status(404).json({ message: 'Club not found' });
    res.json({ club, user });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
