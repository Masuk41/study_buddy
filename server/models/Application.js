const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  club: { type: mongoose.Schema.Types.ObjectId, ref: 'Club', required: true },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  message: { type: String, trim: true },
  reviewNote: { type: String, trim: true },
  reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  reviewedAt: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

ApplicationSchema.index({ user: 1, club: 1 }, { unique: true });

ApplicationSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('Application', ApplicationSchema);
