require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const authRoutes = require('./routes/auth');
const clubRoutes = require('./routes/clubs');
const departmentRoutes = require('./routes/departments');
const applicationRoutes = require('./routes/applications');
const eventRoutes = require('./routes/events');
const adminRoutes = require('./routes/admin');
const { seedDatabase } = require('./seed');

const app = express();

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/clubs', clubRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/admin', adminRoutes);

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/university_clubs';

mongoose
  .connect(MONGODB_URI)
  .then(async () => {
    console.log('MongoDB connected');
    await seedDatabase();
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
