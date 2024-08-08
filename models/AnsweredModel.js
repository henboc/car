const mongoose = require('mongoose');

const answeredSchema = new mongoose.Schema({
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
    questionType: String,
    questionSubType: String,
    questionName: String,
    timeSent: {
        type: Date,
        default: Date.now
      }
});

const Answered = mongoose.model('answered', answeredSchema);

module.exports = Answered;
