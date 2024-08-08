const mongoose = require('mongoose');

const goSchema = new mongoose.Schema({
    goGate: String,
    phase: String,
    goGateName: String,
    timeSent: {
        type: Date,
        default: Date.now
      }
});

const GoGate = mongoose.model('gogate', goSchema);

module.exports = GoGate;
