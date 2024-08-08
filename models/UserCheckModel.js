// models/User.js

const mongoose = require('mongoose');

const UserCheckerSchema = new mongoose.Schema({
  userId: String,
  pageSection: String,
  pageSectionSub: String,
  projectId: String,
  timeSent: {
    type: Date,
    default: Date.now
  }
});

const UserChecker = mongoose.model('UserChecker', UserCheckerSchema);

module.exports = UserChecker;