const mongoose = require('mongoose');

const reviewerSchema = new mongoose.Schema({
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
    phases: { type: [String], required: true },
    userId: String,
    timeSent: {
        type: Date,
        default: Date.now
      }
});
const Reviewer = mongoose.model('reviewer', reviewerSchema);

module.exports = Reviewer;
