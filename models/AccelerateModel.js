const mongoose = require('mongoose');

const accelerateSchema = new mongoose.Schema({
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
    phases: [{ type: String }], 
    timeSent: {
        type: Date,
        default: Date.now
      }
});

const Accelerate = mongoose.model('accelerate', accelerateSchema);

module.exports = Accelerate;
