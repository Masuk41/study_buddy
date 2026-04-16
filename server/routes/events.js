const router = require('express').Router();
const Event = require('../models/Event');
const Club = require('../models/Club');
const { auth } = require('../middleware/auth');

router.get('/club/:clubId', async (req, res) => {
  try {
    const events = await Event.find({ club: req.params.clubId })
      .populate('createdBy', 'name')
      .sort({ date: 1 });
    res.json({ events });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.get('/upcoming', async (req, res) => {
  try {
    const events = await Event.find({ date: { $gte: new Date() }, isPublic: true })
      .populate({ path: 'club', select: 'name', populate: { path: 'department', select: 'name' } })
      .sort({ date: 1 })
      .limit(10);
    res.json({ events });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const { clubId } = req.body;
    const club = await Club.findById(clubId);
    if (!club) return res.status(404).json({ message: 'Club not found' });

    const isLeader = club.leader?.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'super_admin';
    if (!isLeader && !isAdmin) return res.status(403).json({ message: 'Access denied' });

    const event = await Event.create({ ...req.body, club: clubId, createdBy: req.user._id });
    res.status(201).json({ event });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate('club');
    if (!event) return res.status(404).json({ message: 'Event not found' });

    const isLeader = event.club.leader?.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'super_admin';
    if (!isLeader && !isAdmin) return res.status(403).json({ message: 'Access denied' });

    await Event.findByIdAndDelete(req.params.id);
    res.json({ message: 'Event deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
