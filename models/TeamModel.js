// models/User.js

const mongoose = require('mongoose');

const TeamSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  projectId: String,
  teamRole: String,
  email: String,
  link: String,
  timeSent: {
    type: Date,
    default: Date.now
  }
});

const Team = mongoose.model('Team', TeamSchema);

module.exports = Team;