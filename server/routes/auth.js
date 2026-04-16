const router = require('express').Router();
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

router.post(
  '/register',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('department').notEmpty().withMessage('Department is required')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const { name, email, password, department, studentId } = req.body;
      const exists = await User.findOne({ email });
      if (exists) return res.status(400).json({ message: 'Email already registered' });

      const user = await User.create({ name, email, password, department, studentId });
      await user.populate('department');
      const token = generateToken(user._id);
      res.status(201).json({ token, user });
    } catch (err) {
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  }
);

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email required'),
    body('password').notEmpty().withMessage('Password required')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email }).populate('department');
      if (!user) return res.status(401).json({ message: 'Invalid credentials' });

      const isMatch = await user.comparePassword(password);
      if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

      const token = generateToken(user._id);
      res.json({ token, user });
    } catch (err) {
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  }
);

router.get('/me', auth, (req, res) => res.json({ user: req.user }));

module.exports = router;
