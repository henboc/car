// models/User.js

const mongoose = require('mongoose');

const TeamInviteSchema = new mongoose.Schema({
  uniqueCode: String,
  projectId: String,
  email: String,
  link: String,
  timeSent: {
    type: Date,
    default: Date.now
  }
});

const TeamInvite = mongoose.model('TeamInvite', TeamInviteSchema);

module.exports = TeamInvite;