const mongoose = require('mongoose');

const tellUsSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    tellUs: { type: String, required: true },
    timeSent: { type: Date, default: Date.now }
});

const TellUs = mongoose.model('TellUs', tellUsSchema);

module.exports = TellUs;
