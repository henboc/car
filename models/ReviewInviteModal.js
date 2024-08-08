

const mongoose = require('mongoose');

const ReviewInviteSchema = new mongoose.Schema({
  uniqueCode: String,
  projectId: String,
  email: String,
  link: String,
  phases: { type: [String], required: true },
  timeSent: {
    type: Date,
    default: Date.now
  }
});

const ReviewInvite = mongoose.model('ReviewInvite', ReviewInviteSchema);

module.exports = ReviewInvite;