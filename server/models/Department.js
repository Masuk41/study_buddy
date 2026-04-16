const mongoose = require('mongoose');

const DepartmentSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true },
  description: { type: String, trim: true },
  color: { type: String, default: '#3B82F6' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Department', DepartmentSchema);
