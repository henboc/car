// models/EnteredPhase.js

const mongoose = require('mongoose');

const EnteredPhaseSchema = new mongoose.Schema({
  projectId: String,
  phase: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  timeSent: {
    type: Date,
    default: Date.now
  }
});

const EnteredPhase = mongoose.model('EnteredPhase', EnteredPhaseSchema);

module.exports = EnteredPhase;