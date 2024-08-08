const mongoose = require('mongoose');

const watchedQuoteSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
  quoteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quote' },
  quoteStatus:  String,
  watchedAt: {
    type: Date,
    default: Date.now
  }
});

const WatchedQuote = mongoose.model('WatchedQuote', watchedQuoteSchema);

module.exports = WatchedQuote;
