// models/Finished.js

const mongoose = require('mongoose');

const FinishedSchema = new mongoose.Schema({
  projectId: String,
  questionType: String,
  questionSubType: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  timeSent: {
    type: Date,
    default: Date.now
  }
});

const Finished = mongoose.model('Finished', FinishedSchema);

module.exports = Finished;