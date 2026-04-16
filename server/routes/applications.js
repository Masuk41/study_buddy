const router = require('express').Router();
const Application = require('../models/Application');
const Club = require('../models/Club');
const { auth, requireRole } = require('../middleware/auth');

router.post('/', auth, async (req, res) => {
  try {
    const { clubId, message } = req.body;
    const existing = await Application.findOne({ user: req.user._id, club: clubId });
    if (existing) return res.status(400).json({ message: 'You already applied to this club' });

    const application = await Application.create({
      user: req.user._id,
      club: clubId,
      message
    });
    await application.populate([
      { path: 'club', select: 'name category', populate: { path: 'department', select: 'name' } }
    ]);
    res.status(201).json({ application });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.get('/my', auth, async (req, res) => {
  try {
    const applications = await Application.find({ user: req.user._id })
      .populate({
        path: 'club',
        select: 'name category coverImage',
        populate: { path: 'department', select: 'name color' }
      })
      .sort({ createdAt: -1 });
    res.json({ applications });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.get('/club/:clubId', auth, async (req, res) => {
  try {
    const club = await Club.findById(req.params.clubId);
    if (!club) return res.status(404).json({ message: 'Club not found' });

    const isLeader = club.leader?.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'super_admin';
    if (!isLeader && !isAdmin) return res.status(403).json({ message: 'Access denied' });

    const applications = await Application.find({ club: req.params.clubId })
      .populate('user', 'name email studentId department')
      .sort({ createdAt: -1 });
    res.json({ applications });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const application = await Application.findById(req.params.id).populate('club');
    if (!application) return res.status(404).json({ message: 'Application not found' });

    const club = application.club;
    const isLeader = club.leader?.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'super_admin';
    if (!isLeader && !isAdmin) return res.status(403).json({ message: 'Access denied' });

    const { status, reviewNote } = req.body;
    application.status = status;
    application.reviewNote = reviewNote;
    application.reviewedBy = req.user._id;
    application.reviewedAt = new Date();
    await application.save();

    if (status === 'approved') {
      await Club.findByIdAndUpdate(club._id, {
        $addToSet: { members: application.user }
      });
    } else if (status === 'rejected') {
      await Club.findByIdAndUpdate(club._id, {
        $pull: { members: application.user }
      });
    }

    res.json({ application });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
