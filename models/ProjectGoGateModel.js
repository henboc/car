const mongoose = require('mongoose');

const projectGoGateSchema = new mongoose.Schema({
    goGate: String,
    goGateName: String,
    phase: String,
    order: Number,
    projectId: String,
    goStatus: String,
    timeSent: {
        type: Date,
        default: Date.now
      }
});

const ProjectGoGate = mongoose.model('projectGoGate', projectGoGateSchema);

module.exports = ProjectGoGate;
