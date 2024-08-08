const mongoose = require('mongoose');

const PDFSummarySchema = new mongoose.Schema({
    summary: String,
    projectId: String,
    phase: String,
    questionType: String,
    questionSubType: String,
    userId: String,
    timeSent: {
        type: Date,
        default: Date.now
      }
});



const PDFSummary = mongoose.model('pdf', PDFSummarySchema);

module.exports = PDFSummary;
