// models/UserWaitlist.js
const mongoose = require('mongoose');

const userWaitlistSchema = new mongoose.Schema({
    email: String,
    timeSent: {
      type: Date,
      default: Date.now
    }
});

const UserWaitlist = mongoose.model('UserWaitlist', userWaitlistSchema);

module.exports = UserWaitlist;
