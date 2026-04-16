const mongoose = require('mongoose');

const ClubSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  shortDescription: { type: String, trim: true },
  department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
  leader: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  requirements: { type: String, trim: true },
  coverImage: { type: String, default: '' },
  category: {
    type: String,
    enum: ['academic', 'arts', 'sports', 'culture', 'technology', 'community', 'other'],
    default: 'other'
  },
  isActive: { type: Boolean, default: true },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  maxMembers: { type: Number, default: 50 },
  foundedYear: { type: Number },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Club', ClubSchema);
